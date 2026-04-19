require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
const PDFParser = require('pdf2json');
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
const upload = multer({ dest: 'uploads/' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.static('public'));
app.use(express.json());

app.post('/analyze', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    const extractedText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const text = pdfData.Pages.map(page =>
          page.Texts.map(t => {
            try { return decodeURIComponent(t.R.map(r => r.T).join('')); }
            catch { return t.R.map(r => r.T).join(''); }
          }).join(' ')
        ).join('\n');
        resolve(text);
      });
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.loadPDF(filePath);
    });

    fs.unlinkSync(filePath);

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
      temperature: 0.1,
      max_tokens: 4000,
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const completedCredits = parseInt(parsed.credits_completed) || 0;
const inProgressCredits = (parsed.in_progress_classes || [])
  .reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);

const projectedCredits = completedCredits + inProgressCredits;
const gpaOk = !parsed.gpa_warning && (parseFloat(parsed.gpa) || 0) >= 2.0;

// only on track if GPA is okay AND projected credits reach 120
parsed.on_track_to_graduate = gpaOk && projectedCredits >= 120;

if (parsed.on_track_to_graduate) {
  parsed.summary_message = parsed.summary_message ||
    `You appear on track to graduate if you successfully complete your current in-progress courses.`;
}

    // Cross-reference completed/in-progress against hardcoded requirements
    const major = (parsed.major || '').trim();
const concentration = (parsed.concentration || '').trim();

// 🔥 Bulletproof matching
const majorKey = Object.keys(REQUIREMENTS).find(m =>
  major.toLowerCase().includes(m.toLowerCase())
);

// allow majors with no concentration selected / returned
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


    let remaining_requirements = { core: [], distribution: [], pathway: [], concentration: [], other: [] };

    // Pass fulfilled_breadth through to client
    if (!parsed.fulfilled_breadth) parsed.fulfilled_breadth = [];


    if (majorReqs) {
    const completedCodes = (parsed.completed_classes || [])
        .filter(c => c.counts_for_credit !== false)
        .map(c => normalizeCode(c.code));

    const inProgressCodes = (parsed.in_progress_classes || [])
        .map(c => normalizeCode(c.code));

    const allDoneCodes = new Set([...completedCodes, ...inProgressCodes]);

    const allDoneArray = [...allDoneCodes];

parsed.fulfilled_breadth = (majorReqs.distribution || [])
  .filter(req => {
    if (req.requirement === "First-Year Seminar") {
      return allDoneArray.some(c => c === "FYS 101L");
    }
    if (req.requirement === "Writing for College") {
      return allDoneArray.some(c => c === "ENG 120L");
    }
    if (req.requirement === "3 credits in Philosophical Perspectives") {
      return allDoneArray.some(c => c === "PHIL 101L");
    }

    const matcherKey = REQUIREMENT_TO_MATCHER[req.requirement];
    if (matcherKey) {
      return isBreadthFulfilled(req.requirement, allDoneArray);
    }

    return false;
  })
  .map(req => req.requirement);

    const isDone = (req) => {
        // Single fixed course
        if (req.code) {
        const normalized = normalizeRequirementCode(req.code);
        // Handle AP/transfer variants — strip trailing letter suffixes for matching
        const base = normalized.replace(/L$|N$/, '');
        return allDoneCodes.has(normalized) ||
            [...allDoneCodes].some(c => c.replace(/L$|N$/, '') === base);
        }

        // Breadth requirement with discipline-based matching
        const matcherKey = REQUIREMENT_TO_MATCHER[req.requirement];
        if (matcherKey) {
        return isBreadthFulfilled(req.requirement, [...allDoneCodes]);
        }

        // Options-based dropdown requirement
        if (req.options && req.options.length > 0) {
        return req.options.some(o => {
            const normalized = normalizeRequirementCode(req.code);
            const base = normalized.replace(/L$|N$/, '');
            return allDoneCodes.has(normalized) ||
            [...allDoneCodes].some(c => c.replace(/L$|N$/, '') === base);
        });
        }

        return false;
    };

    ['core', 'distribution', 'pathway', 'concentration'].forEach(group => {
        (majorReqs[group] || []).forEach(req => {
        if (!isDone(req)) {
            remaining_requirements[group].push(req);
        }
        });
    });

    } else {
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

    parsed.remaining_requirements = remaining_requirements;
    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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
- If one recommended course fulfills a requirement bucket (for example Fine Arts, Ethics / Applied Ethics / Religious Studies, System Elective, Language Elective, or another choose-one requirement), treat that bucket as CLOSED and do not recommend another course for it.
- Never include multiple alternatives for the same requirement in the same semester plan.
- Prefer required major/core courses first, then fill remaining slots with unmet breadth/pathway/concentration buckets that are not already covered by another recommended course.
- Return 4-5 courses total only if they satisfy distinct needs. If distinct unmet needs are fewer, return fewer courses rather than duplicating the same requirement.`
                }
            ],
            temperature: 0.2,
            max_tokens: 1000,
        });

        const text = completion.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        res.json({ success: true, data: parsed });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});