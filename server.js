// 
// SERVER.JS — AGENTIC ADVISOR
// -----------------------------------------------------------------------------
// Node.js + Express backend. Handles:
//   - PDF upload and text extraction (pdf2json)
//   - AI analysis via Groq API (llama-3.3-70b-versatile)
//   - Cross-referencing AI output against hardcoded requirement structures
//   - Semester planning recommendations
//
// ROUTES:
//   POST /analyze — accepts PDF upload, returns structured audit JSON
//   POST /plan    — accepts audit data + goal, returns recommended courses
//
// ENVIRONMENT:
//   GROQ_API_KEY must be set in .env
// 

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
const PDFParser = require('pdf2json');

// IMPORT REQUIREMENT STRUCTURES AND MATCHING UTILITIES FROM requirements.js
const {
  REQUIREMENTS,
  isBreadthFulfilled,
  normalizeCode,
  normalizeRequirementCode,
  REQUIREMENT_TO_MATCHER,
  PATHWAYS,
  ALL_PATHWAYS
} = require('./requirements.js');

const app = express();
const upload = multer({ dest: 'uploads/' }); // temp storage for uploaded PDFs
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// SERVE STATIC FILES FROM /public (index.html, logo, etc.)
app.use(express.static('public'));
app.use(express.json());


// 
// POST /analyze — MAIN ANALYSIS ROUTE
// -----------------------------------------------------------------------------
// 1. Accepts a PDF upload from the frontend
// 2. Extracts raw text using pdf2json
// 3. Sends extracted text to Groq/Llama for structured JSON analysis
// 4. Overrides on_track_to_graduate with server-side GPA + credit logic
// 5. Cross-references completed courses against hardcoded REQUIREMENTS
// 6. Builds remaining_requirements grouped by core/distribution/pathway/concentration
// 7. Returns the full structured audit object to the client
// 
app.post('/analyze', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    // EXTRACT TEXT FROM PDF USING pdf2json
    // Handles special characters safely with try/catch per token
    const extractedText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const text = pdfData.Pages.map(page =>
          page.Texts.map(t => {
            try { return decodeURIComponent(t.R.map(r => r.T).join('')); }
            catch { return t.R.map(r => r.T).join(''); } // fallback if URI decode fails
          }).join(' ')
        ).join('\n');
        resolve(text);
      });
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.loadPDF(filePath);
    });

    // CLEAN UP TEMP FILE AFTER EXTRACTION
    fs.unlinkSync(filePath);

    // SEND EXTRACTED TEXT TO GROQ FOR AI ANALYSIS
    // Prompt instructs the model to return only valid JSON — no markdown, no explanation
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an academic advisor assistant helping a Marist College student understand their Degree Works audit. You always respond with valid JSON only, no markdown, no backticks, no explanation.`
        },
        {
          role: 'user',
          content: `Analyze this Degree Works audit and return ONLY a valid JSON object with this exact structure:

{
  "major": "",
  "concentration": "",
  "gpa": "",
  "credits_completed": "",
  "credits_remaining": "",
  "expected_graduation": "",
  "on_track_to_graduate": true,
  "gpa_warning": false,
  "completed_classes": [
    { "code": "", "name": "", "grade": "", "credits": "", "semester": "", "source": "", "source_detail": "", "counts_for_credit": true }
  ],
  "in_progress_classes": [
    { "code": "", "name": "", "credits": "", "semester": "" }
  ],
  "summary_message": "",
  "distribution_credits_earned": 0,
  "liberal_arts_credits_earned": 0,
  "pathway_name": "",
  "fulfilled_breadth": [],
  "pathway_areas": [
    {
      "area_number": 1,
      "area_name": "",
      "fulfilled": false,
      "completed_courses": [],
      "in_progress_courses": []
    }
  ]
}

Rules:
- Return ONLY the JSON. No markdown, no backticks, no explanation.
- "T" grade means Transfer credit, NOT a failing grade. Mark grade as "Transfer".
- Failed classes have grade "F" or "NC". counts_for_credit should be false for these.
- A grade of "D" is passing and counts_for_credit should be true.
- counts_for_credit is false ONLY for F or NC grades.
- Include ALL classes ever attempted including failed ones.
- For transfer credits set source to "Transfer" and source_detail to the originating school and course.
- For AP exams set source to "AP Exam" and source_detail to the exam name and date.
- For regular Marist classes set source to "Marist" and source_detail to "".
- Every completed class must have a semester field.
- gpa_warning should be true if GPA is below 2.0.
- Extract distribution_credits_earned as a number from the "Minimum Distribution Credit" section (e.g. "you currently have 26" → 26).
- Extract liberal_arts_credits_earned as a number from the "Minimum Liberal Art Credits" section (e.g. "You have taken 54" → 54).
- Extract pathway_name from the declared pathway (e.g. "Quantitative Studies").
- fulfilled_breadth is an array of breadth requirement names already satisfied (e.g. ["3 credits in History", "3 credits in Math"]).
- Extract pathway_areas from the Pathway section. Each area should include its number, name, whether fulfilled, and which courses the student completed or is taking in that area.
- Do NOT include remaining_requirements in your response. That will be handled separately.
- fulfilled_breadth must list every breadth area name that is already satisfied, using these exact strings: "3 credits in History", "3 credits in Math", "3 credits in Natural Science", "3 credits in Literature", "3 credits in Social Science", "3 credits in Fine Arts", "3 credits in Ethics / Applied Ethics / Religious Studies", "3 credits in Philosophical Perspectives", "First-Year Seminar", "Writing for College".

Here is the audit text:
${extractedText}`
        }
      ],
      temperature: 0.1,  // low temperature for consistent structured output
      max_tokens: 4000,
    });

    // PARSE AI RESPONSE — strip any accidental markdown fences before parsing
    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // OVERRIDE on_track_to_graduate WITH SERVER-SIDE LOGIC
    // AI's guess can be wrong — we recalculate based on GPA and projected credit total
    const completedCredits = parseInt(parsed.credits_completed) || 0;
    const inProgressCredits = (parsed.in_progress_classes || [])
      .reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
    const projectedCredits = completedCredits + inProgressCredits;
    const gpaOk = !parsed.gpa_warning && (parseFloat(parsed.gpa) || 0) >= 2.0;

    // Only on track if GPA is 2.0+ AND projected credits will reach 120
    parsed.on_track_to_graduate = gpaOk && projectedCredits >= 120;

    if (parsed.on_track_to_graduate) {
      parsed.summary_message = parsed.summary_message ||
        `You appear on track to graduate if you successfully complete your current in-progress courses.`;
    }

    // MATCH MAJOR AND CONCENTRATION TO HARDCODED REQUIREMENTS
    // Uses fuzzy includes() matching so minor AI wording differences still resolve correctly
    const major = (parsed.major || '').trim();
    const concentration = (parsed.concentration || '').trim();

    const majorKey = Object.keys(REQUIREMENTS).find(m =>
      major.toLowerCase().includes(m.toLowerCase())
    );

    // If major matched, find the best concentration key (or default to first)
    let concentrationKey = null;
    if (majorKey) {
      const concentrationKeys = Object.keys(REQUIREMENTS[majorKey] || {});
      concentrationKey = concentration
        ? concentrationKeys.find(c => concentration.toLowerCase().includes(c.toLowerCase()))
        : concentrationKeys[0] || null;
    }

    const majorReqs = majorKey && concentrationKey
      ? REQUIREMENTS[majorKey][concentrationKey]
      : null;

    // INITIALIZE REMAINING REQUIREMENTS BUCKETS
    let remaining_requirements = { core: [], distribution: [], pathway: [], concentration: [], other: [] };

    // ENSURE fulfilled_breadth EXISTS (AI may omit it)
    if (!parsed.fulfilled_breadth) parsed.fulfilled_breadth = [];

    if (majorReqs) {
      // BUILD SETS OF ALL COMPLETED AND IN-PROGRESS COURSE CODES FOR FAST LOOKUP
      const completedCodes = (parsed.completed_classes || [])
        .filter(c => c.counts_for_credit !== false) // exclude failed classes
        .map(c => normalizeCode(c.code));

      const inProgressCodes = (parsed.in_progress_classes || [])
        .map(c => normalizeCode(c.code));

      const allDoneCodes = new Set([...completedCodes, ...inProgressCodes]);
      const allDoneArray = [...allDoneCodes];

      // OVERRIDE fulfilled_breadth WITH SERVER-SIDE CALCULATION
      // More reliable than trusting AI to detect this correctly
      parsed.fulfilled_breadth = (majorReqs.distribution || [])
        .filter(req => {
          // Fixed single-course breadth requirements
          if (req.requirement === "First-Year Seminar") {
            return allDoneArray.some(c => c === "FYS 101L");
          }
          if (req.requirement === "Writing for College") {
            return allDoneArray.some(c => c === "ENG 120L");
          }
          if (req.requirement === "3 credits in Philosophical Perspectives") {
            return allDoneArray.some(c => c === "PHIL 101L");
          }

          // Discipline-based breadth requirements — use BREADTH_MATCHERS
          const matcherKey = REQUIREMENT_TO_MATCHER[req.requirement];
          if (matcherKey) {
            return isBreadthFulfilled(req.requirement, allDoneArray);
          }

          return false;
        })
        .map(req => req.requirement);

      // IS DONE — CHECKS IF A SINGLE REQUIREMENT HAS BEEN FULFILLED
      // Handles three cases: fixed code, discipline-based breadth, and options dropdown
      const isDone = (req) => {
        // Case 1: Single fixed course requirement
        if (req.code) {
          const normalized = normalizeRequirementCode(req.code);
          const base = normalized.replace(/L$|N$/, ''); // strip suffix for flexible matching
          return allDoneCodes.has(normalized) ||
            [...allDoneCodes].some(c => c.replace(/L$|N$/, '') === base);
        }

        // Case 2: Breadth area — use discipline matcher
        const matcherKey = REQUIREMENT_TO_MATCHER[req.requirement];
        if (matcherKey) {
          return isBreadthFulfilled(req.requirement, [...allDoneCodes]);
        }

        // Case 3: Choose-one dropdown — check if any option has been completed
        if (req.options && req.options.length > 0) {
          return req.options.some(o => {
            const normalized = normalizeRequirementCode(o.code);
            const base = normalized.replace(/L$|N$/, '');
            return allDoneCodes.has(normalized) ||
              [...allDoneCodes].some(c => c.replace(/L$|N$/, '') === base);
          });
        }

        return false;
      };

      // BUILD REMAINING REQUIREMENTS BY CHECKING EACH GROUP
      ['core', 'distribution', 'pathway', 'concentration'].forEach(group => {
        (majorReqs[group] || []).forEach(req => {
          if (!isDone(req)) {
            remaining_requirements[group].push(req);
          }
        });
      });

    } else {
      // MAJOR NOT YET MAPPED — show informational message, still return extracted classes
      remaining_requirements = {
        core: [],
        distribution: [],
        pathway: [],
        concentration: [],
        other: [
          {
            requirement: `This major is not yet fully mapped in the planner: ${major}${concentration ? ' / ' + concentration : ''}. Completed and in-progress classes were still extracted successfully.`,
            code: '',
            options: []
          }
        ]
      };

      parsed.summary_message = parsed.summary_message ||
        `Your transcript was analyzed successfully, but ${major}${concentration ? ' / ' + concentration : ''} is not yet supported for full requirement mapping in this prototype.`;
    }

    // ATTACH REMAINING REQUIREMENTS AND SEND RESPONSE
    parsed.remaining_requirements = remaining_requirements;
    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 
// POST /plan — SEMESTER PLANNING ROUTE
// -----------------------------------------------------------------------------
// Accepts the student's full audit data and their chosen semester goal,
// then asks the AI to recommend 4-5 courses from their remaining requirements.
//
// Key prompt rules enforced:
//   - Never recommend in-progress or already-completed courses
//   - One course per requirement bucket (no duplicate fulfillments)
//   - Prioritize core major requirements over breadth/elective slots
// 
app.post('/plan', async (req, res) => {
  try {
    const { auditData, goal } = req.body;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an academic advisor at Marist College helping a student plan their next semester. You always respond with valid JSON only, no markdown, no backticks, no explanation.`
        },
        {
          role: 'user',
          content: `Here is the student's audit data:
${JSON.stringify(auditData, null, 2)}

Their goal for next semester: "${goal}"

Return ONLY a valid JSON array of 4-5 recommended courses like this:
[
  { "code": "CMPT 230L", "name": "Computer Organization", "credits": "3", "reason": "Required for major progression" }
]

Rules:
- Return ONLY the JSON array. No markdown, no backticks, no explanation.
- Pick courses only from their remaining_requirements.
- Consider their goal when selecting difficulty and load.
- Include a specific one-sentence reason for each course.
- Do NOT recommend any courses the student is currently taking (in_progress_classes).
- Do NOT recommend any courses already listed as completed.
- NEVER recommend courses the student is currently taking: ${JSON.stringify((auditData.in_progress_classes || []).map(c => c.code))}.
- NEVER recommend courses already in completed_classes.
- Only recommend from remaining_requirements.
- IMPORTANT: Do NOT recommend two courses that satisfy the same single remaining requirement bucket.
- If one recommended course fulfills a requirement bucket (e.g. Fine Arts, Ethics, System Elective), treat that bucket as CLOSED and do not recommend another course for it.
- Never include multiple alternatives for the same requirement in the same semester plan.
- Prefer required major/core courses first, then fill remaining slots with unmet breadth/pathway/concentration buckets.
- Return 4-5 courses total only if they satisfy distinct needs. Return fewer if fewer distinct unmet needs exist.`
        }
      ],
      temperature: 0.2,  // slightly higher than analyze for more varied recommendations
      max_tokens: 1000,
    });

    // PARSE AI RESPONSE
    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 
// START SERVER
// 
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});