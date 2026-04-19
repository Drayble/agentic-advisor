const REQUIREMENTS = {
  "Computer Science": {
    "Software Development": {
      core: [
        { requirement: "Introduction to Programming", code: "CMPT 120L", options: [] },
        { requirement: "Software Development I", code: "CMPT 220L", options: [] },
        { requirement: "Software Development II", code: "CMPT 221L", options: [] },
        { requirement: "Software Systems and Analysis", code: "CMPT 230L", options: [] },
        { requirement: "Data Communications and Networks", code: "CMPT 306N", options: [] },
        { requirement: "Database Management", code: "CMPT 308N", options: [] },
        { requirement: "Internetworking", code: "CMPT 307N", options: [] },
        { requirement: "System Design", code: "CMPT 330L", options: [] },
        { requirement: "Computer Organization and Architecture", code: "CMPT 422N", options: [] },
        { requirement: "Algorithm Analysis and Design", code: "CMPT 435L", options: [] },
        { requirement: "Project I", code: "CMPT 475N", options: [] },
        { requirement: "Project II", code: "CMPT 476N", options: [] },
        { requirement: "Introduction to Business & Management", code: "BUS 100L", options: [] },
        { requirement: "Introduction to Statistics", code: "MATH 130L", options: [] },
        { requirement: "Calculus I", code: "MATH 241L", options: [] },
        { requirement: "Discrete Mathematics", code: "MATH 205L", options: [] },
      ],
      concentration: [
        {
          requirement: "System Elective",
          code: "",
          options: [
            { code: "CMPT 424N", name: "Operating Systems" },
            { code: "CMPT 432N", name: "Design of Compilers" },
          ]
        },
        {
          requirement: "Language Elective",
          code: "",
          options: [
            { code: "CMPT 331L", name: "Theory of Programming Languages" },
            { code: "CMPT 440L", name: "Formal Languages and Computability" },
          ]
        },
        {
          requirement: "Third Required Elective",
          code: "",
          options: [
            { code: "CMPT 333N", name: "Language Study" },
            { code: "CMPT 331L", name: "Theory of Programming Languages" },
            { code: "CMPT 335L", name: "Alternate Elective" },
            { code: "CMPT 404L", name: "Alternate Elective" },
            { code: "CMPT 412N", name: "Alternate Elective" },
            { code: "CMPT 414N", name: "Alternate Elective" },
            { code: "CMPT 415N", name: "Alternate Elective" },
            { code: "CMPT 424N", name: "Operating Systems" },
            { code: "CMPT 425N", name: "Alternate Elective" },
            { code: "CMPT 432N", name: "Design of Compilers" },
            { code: "CMPT 440L", name: "Formal Languages and Computability" },
            { code: "CMPT 446N", name: "Alternate Elective" },
            { code: "CMPT 448N", name: "Alternate Elective" },
            { code: "CMPT 467N", name: "Alternate Elective" },
          ]
        },
      ],
      distribution: [
        { requirement: "First-Year Seminar", code: "FYS 101L", options: [] },
        { requirement: "Writing for College", code: "ENG 120L", options: [] },
        { requirement: "3 credits in Philosophical Perspectives", code: "PHIL 101L", options: [] },
        {
  requirement: "3 credits in Natural Science",
  code: "",
  options: [
    { code: "ANTH 101L", name: "Introduction to Physical Anthropology" },
    { code: "BIOL 101L", name: "Topics in Biology" },
    { code: "BIOL 120L", name: "Agents of Biowarfare" },
    { code: "BIOL 214L", name: "Life on Earth" },
    { code: "BIOL 232L", name: "Sex, Evolution, and Behavior" },
    { code: "BIOL 237L", name: "Human Biology" },
    { code: "CHEM 101L", name: "Introduction to Chemistry" },
    { code: "ENSC 101L", name: "Introduction to Environmental Issues" },
    { code: "ENSC 210L", name: "Introduction to Geology" },
    { code: "ENSC 306L", name: "Environmental Health" },
    { code: "HLTH 225L", name: "Topics in Nutrition" },
    { code: "PHYS 108L", name: "Introduction to Cosmology" },
    { code: "PHYS 193L", name: "Physics of Modern Technology" },
  ]
},
        {
          requirement: "3 credits in History",
          code: "",
          options: [
            { code: "HIST_ANY_100_200", name: "Any 100- or 200-level HIST course (except HIST 209L)" },
            { code: "HIST_ANY_300", name: "Any 300-level HIST course (requires 6 prior history credits)" },
          ]
        },
        {
  requirement: "3 credits in Literature",
  code: "",
  options: [
    { code: "ENG 170L", name: "World Literature" },
    { code: "ENG 201L", name: "Introduction to Linguistics" },
    { code: "ENG 205L", name: "Modern Speculative Fiction" },
    { code: "ENG 210L", name: "American Literature I" },
    { code: "ENG 211L", name: "American Literature II" },
    { code: "ENG 214L", name: "Religious Themes in Literature" },
    { code: "ENG 220L", name: "Literature and Gender" },
    { code: "ENG 231L", name: "Literature of the Hudson River Valley" },
    { code: "ENG 232L", name: "Literature and Nature" },
    { code: "ENG 233L", name: "Law and Literature" },
    { code: "ENG 234L", name: "Graphic Narratives" },
    { code: "ENG 237L", name: "Children's and YA Literature" },
    { code: "ENG 240L", name: "American Short Fiction" },
    { code: "ENG 255L", name: "Introduction to Literature" },
    { code: "ENG 261L", name: "Spanish Literature in Translation: The Novel" },
    { code: "ENG 264L", name: "Latin American Literature in Translation" },
    { code: "ENG 270L", name: "Classics of Western Literature I" },
    { code: "ENG 271L", name: "Classics of Western Literature II" },
  ]
},
        {
  requirement: "3 credits in Math",
  code: "",
  options: [
    { code: "MATH 110L", name: "Excursions in Mathematics: Classical Models" },
    { code: "MATH 111L", name: "Excursions in Mathematics: Modern Models" },
    { code: "MATH 130L", name: "Introductory Statistics I" },
    { code: "MATH 241L", name: "Calculus" },
    { code: "MATH_ANY_200", name: "Any 200-level MATH course" },
  ]
},
        {
  requirement: "3 credits in Social Science",
  code: "",
  options: [
    { code: "ANTH 102L", name: "Introduction to Cultural Anthropology" },
    { code: "ANTH 120L", name: "An Introduction to Archaeology" },
    { code: "ANTH 230L", name: "American Culture I" },
    { code: "ANTH 231L", name: "American Culture II" },
    { code: "ANTH 232L", name: "Religion and Culture" },
    { code: "ANTH 233L", name: "Native Americans" },
    { code: "ECON 103L", name: "Principles of Microeconomics" },
    { code: "ECON 104L", name: "Principles of Macroeconomics" },
    { code: "ECON 150L", name: "Economics of Social Issues" },
    { code: "ECON 200L", name: "Economies of Gender" },
    { code: "ECON 210L", name: "Innovation in the Hudson Valley" },
    { code: "POSC 102L", name: "Introduction to Law" },
    { code: "POSC 103L", name: "Introduction to Global Issues" },
    { code: "POSC 105L", name: "Origins of the American Legal System" },
    { code: "POSC 110L", name: "American National Government" },
    { code: "POSC 111L", name: "Introduction to Comparative Politics" },
    { code: "POSC 113L", name: "International Relations" },
    { code: "POSC_ANY_200", name: "Any 200-level Political Science course" },
    { code: "PSYC 101L", name: "Introduction to Psychology" },
    { code: "PSYC 201L", name: "Personality Development" },
    { code: "PSYC 202L", name: "Abnormal Psychology" },
    { code: "PSYC 203L", name: "Theories of Personality" },
    { code: "PSYC 206L", name: "Psycho-Biological Sex Differences" },
    { code: "PSYC 207L", name: "The Exceptional Child" },
    { code: "PSYC 208L", name: "Educational Psychology" },
    { code: "PSYC 210L", name: "The Psychology of Sleep" },
    { code: "PSYC 211L", name: "Sports and Exercise Psychology" },
    { code: "PSYC 215L", name: "Psychology of Interpersonal Communication" },
    { code: "PSYC 220L", name: "Social Psychology" },
    { code: "PSYC 222L", name: "Community Psychology" },
    { code: "PSYC 301L", name: "Biopsychology and Lab" },
    { code: "PSYC 302L", name: "Neurobiology of Learning and Memory and Lab" },
    { code: "PSYC 303L", name: "Developmental Neuropsychology and Lab" },
    { code: "PSYC 304L", name: "Psychopharmacology and Lab" },
    { code: "PSYC 305L", name: "Neurobiology and Neuropsychology of Learning Disabilities and Lab" },
    { code: "PSYC 315L", name: "Human Factors Psychology" },
    { code: "PSYC 317L", name: "Child Development" },
    { code: "PSYC 318L", name: "Psychology of the Adolescent" },
    { code: "PSYC 321L", name: "Adult Development" },
    { code: "PSYC 330L", name: "Culture and Psychology" },
    { code: "PSYC 332L", name: "Fundamentals of Counseling" },
    { code: "PSYC 342L", name: "Learning and Cognition" },
    { code: "PSYC 348L", name: "Psychological Perspectives on Criminal Behavior" },
    { code: "PSYC 385L", name: "Industrial Psychology" },
    { code: "SOC 101L", name: "Introduction to Sociology" },
    { code: "SOC_ANY_200", name: "Any 200-level SOC course (SOC 101 prerequisite)" },
  ]
},
        {
  requirement: "3 credits in Fine Arts",
  code: "",
  options: [
    { code: "ART 101L", name: "Fundamentals of Art and Design (majors only)" },
    { code: "ART 110L", name: "Basic Drawing" },
    { code: "ART 125L", name: "Arts and Values" },
    { code: "ART 160L", name: "History of Western Art I" },
    { code: "ART 180L", name: "History of Western Art II" },
    { code: "ART 220L", name: "History of Photography" },
    { code: "ART 230L", name: "Greek and Roman Art" },
    { code: "ART 245L", name: "Medieval Art" },
    { code: "ART 255L", name: "Pre-Columbian Art" },
    { code: "ART 256L", name: "Chinese Art" },
    { code: "ART 265L", name: "Introduction to Renaissance Art" },
    { code: "ART 270L", name: "Russian and Soviet Art" },
    { code: "ART 280L", name: "American Art" },
    { code: "ART 281L", name: "History of Costume" },
    { code: "ART 290L", name: "Museum Studies" },
    { code: "ART 350L", name: "Contemporary Art" },
    { code: "ART 362L", name: "Art & Technology" },
    { code: "ART 365L", name: "History of 19th-Century Art" },
    { code: "ART 366L", name: "History of 20th-Century Art" },
    { code: "ART 380L", name: "Renaissance Art" },
    { code: "ENG 150L", name: "Introduction to Theatre" },
    { code: "ENG 227L", name: "Acting I" },
    { code: "ENG 280L", name: "Creative Writing" },
    { code: "ITAL 308L", name: "Italian Cinema" },
    { code: "MDIA 120L", name: "Art of Film" },
    { code: "MUS 105L", name: "Introduction to Music" },
    { code: "MUS 106L", name: "Jazz and Sound" },
    { code: "MUS 120L", name: "Theory of Music I" },
    { code: "MUS 220L", name: "Theory of Music II" },
    { code: "MUS 225L", name: "Insight into Music" },
    { code: "MUS 226L", name: "Music Cultures of the World" },
    { code: "MUS 242L", name: "Popular Music in America" },
    { code: "MUS 248L", name: "History of Motion Picture Music" },
    { code: "PHIL 237L", name: "Aesthetics" },
    { code: "PHIL 333L", name: "Philosophy and Film" },
    { code: "SPAN 330L", name: "Themes in Spanish Cinema" },
    { code: "SPAN 335L", name: "Themes in Latin American Cinema" },
  ]
},
        {
  requirement: "3 credits in Ethics / Applied Ethics / Religious Studies",
  code: "",
  options: [
    { code: "PHIL 200L", name: "Ethics" },
    { code: "PHIL 247L", name: "Contemporary Moral Problems" },
    { code: "PHIL 301L", name: "Environmental Ethics" },
    { code: "PHIL 302L", name: "Moral Cognition" },
    { code: "PHIL 346L", name: "Bioethics" },
    { code: "PHIL 348L", name: "Ethics of Food" },
    { code: "REST", name: "Any Religious Studies (REST) course" },
    { code: "CMPT 305L", name: "Technology, Ethics, & Society" },
    { code: "MDIA 316L", name: "Ethics & Gaming" },
    { code: "CRJU 310L", name: "Criminal Justice Ethics" },
    { code: "BUS 312L", name: "Ethics & Finance Regulations" },
    { code: "BUS 319N", name: "Ethical Decision Making in Business" },
  ]
},
      ],
      pathway: [
        {
          requirement: "Quantitative Studies Pathway (minimum 3 areas required)",
          code: "",
          options: [],
          note: "Must complete courses from at least 3 of 6 authorized areas. See Degree Works for full area listings."
        },
        {
          requirement: "Minimum 36 Distribution Credits",
          code: "",
          options: [],
          note: "Includes Breadth, Pathway, and Overflow courses. Double-dipped courses count as 3 credits only."
        },
        {
          requirement: "Minimum 60 Liberal Arts Credits (courses ending in L)",
          code: "",
          options: [],
          note: "Any course ending in L counts toward this requirement."
        },
      ]
    }
  }
};

// All course codes that can fulfill each breadth area — used for cross-reference matching
const BREADTH_MATCHERS = {
  history: {
    prefixes: ["HIST"],
    excludes: ["HIST 209L"],
  },
  math: {
  codes: ["MATH 110L", "MATH 111L", "MATH 130L", "MATH 241L"],
  prefixes: ["MATH 2"],
},
  naturalScience: {
  codes: ["ANTH 101L", "BIOL 101L", "BIOL 120L", "BIOL 214L", "BIOL 232L", "BIOL 237L",
    "CHEM 101L", "ENSC 101L", "ENSC 210L", "ENSC 306L", "HLTH 225L", "PHYS 108L", "PHYS 193L"]
},
  literature: {
  codes: ["ENG 170L", "ENG 201L", "ENG 205L", "ENG 210L", "ENG 211L", "ENG 214L",
    "ENG 220L", "ENG 231L", "ENG 232L", "ENG 233L", "ENG 234L", "ENG 237L",
    "ENG 240L", "ENG 255L", "ENG 261L", "ENG 264L", "ENG 270L", "ENG 271L"]
},
  socialScience: {
  codes: ["ANTH 102L", "ANTH 120L", "ANTH 230L", "ANTH 231L", "ANTH 232L", "ANTH 233L",
    "ECON 103L", "ECON 104L", "ECON 150L", "ECON 200L", "ECON 210L",
    "POSC 102L", "POSC 103L", "POSC 105L", "POSC 110L", "POSC 111L", "POSC 113L",
    "PSYC 101L", "PSYC 201L", "PSYC 202L", "PSYC 203L", "PSYC 206L", "PSYC 207L",
    "PSYC 208L", "PSYC 210L", "PSYC 211L", "PSYC 215L", "PSYC 220L", "PSYC 222L",
    "PSYC 301L", "PSYC 302L", "PSYC 303L", "PSYC 304L", "PSYC 305L", "PSYC 315L",
    "PSYC 317L", "PSYC 318L", "PSYC 321L", "PSYC 330L", "PSYC 332L", "PSYC 342L",
    "PSYC 348L", "PSYC 385L", "SOC 101L"],
  prefixes: ["POSC 2", "SOC 2"]
},
  fineArts: {
  codes: ["ART 101L", "ART 110L", "ART 125L", "ART 160L", "ART 180L", "ART 220L",
    "ART 230L", "ART 245L", "ART 255L", "ART 256L", "ART 265L", "ART 270L",
    "ART 280L", "ART 281L", "ART 290L", "ART 350L", "ART 362L", "ART 365L",
    "ART 366L", "ART 380L", "ENG 150L", "ENG 227L", "ENG 280L", "ITAL 308L",
    "MDIA 120L", "MUS 105L", "MUS 106L", "MUS 120L", "MUS 220L", "MUS 225L",
    "MUS 226L", "MUS 242L", "MUS 248L", "PHIL 237L", "PHIL 333L", "SPAN 330L", "SPAN 335L"],
  prefixes: ["MUS 3"]
},
  ethics: {
  codes: ["PHIL 200L", "PHIL 247L", "PHIL 301L", "PHIL 302L", "PHIL 346L", "PHIL 348L",
    "CMPT 305L", "MDIA 316L", "CRJU 310L", "BUS 312L", "BUS 319N"],
  prefixes: ["REST"]
}
};

// Maps requirement names to their breadth matcher key
const REQUIREMENT_TO_MATCHER = {
  "3 credits in History": "history",
  "3 credits in Math": "math",
  "3 credits in Natural Science": "naturalScience",
  "3 credits in Literature": "literature",
  "3 credits in Social Science": "socialScience",
  "3 credits in Fine Arts": "fineArts",
  "3 credits in Ethics / Applied Ethics / Religious Studies": "ethics"
};

function normalizeCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, ' ');
}

function normalizeRequirementCode(code) {
  const normalized = normalizeCode(code);

  // If already ends in L or N, keep it exactly as-is
  if (/[LN]$/.test(normalized)) return normalized;

  // If course code has digits and no suffix, default it to L
  if (/\d$/.test(normalized)) return normalized + 'L';

  return normalized;
}

function matchesBreadth(completedCode, matcherKey) {
  const matcher = BREADTH_MATCHERS[matcherKey];
  if (!matcher) return false;
  const code = normalizeCode(completedCode);

  if (matcher.codes && matcher.codes.some(c => normalizeCode(c) === code)) return true;
  if (matcher.excludes && matcher.excludes.some(e => normalizeCode(e) === code)) return false;
  if (matcher.prefixes && matcher.prefixes.some(p => code.startsWith(p.toUpperCase()))) return true;
  return false;
}

function isBreadthFulfilled(requirementName, completedCodes) {
  const matcherKey = REQUIREMENT_TO_MATCHER[requirementName];
  if (!matcherKey) return false;
  return completedCodes.some(code => matchesBreadth(code, matcherKey));
}

const PATHWAYS = {
  "Quantitative Studies": {
    description: "Requires courses from at least 3 of 6 authorized areas.",
    areas: [
      {
        area: 1,
        name: "Music Theory",
        courses: [
  { code: "MUS 106L", name: "Jazz and Sound" },
  { code: "MUS 120L", name: "Theory of Music I" },
  { code: "MUS 220L", name: "Theory of Music II" },
]
      },
      {
        area: 2,
        name: "Mathematics",
        courses: [
  { code: "MATH 130L", name: "Introductory Statistics I" },
  { code: "MATH 205L", name: "Discrete Mathematics" },
  { code: "MATH 210L", name: "Calculus II" },
  { code: "MATH 241L", name: "Calculus I" },
  { code: "MATH 242L", name: "Calculus II" },
]
      },
      {
        area: 3,
        name: "Natural Sciences",
        courses: [
  { code: "CHEM 101L", name: "Introduction to Chemistry" },
  { code: "CHEM 112L", name: "General Chemistry I" },
  { code: "ENSC 305L", name: "Environmental Science" },
  { code: "PHYS 108L", name: "Introduction to Cosmology" },
  { code: "PHYS 201L", name: "General Physics I" },
  { code: "PHYS 202L", name: "General Physics II" },
  { code: "PHYS 211L", name: "University Physics I" },
  { code: "PHYS 212L", name: "University Physics II" },
  { code: "PHYS 221L", name: "Physics for Engineers" },
]
      },
      {
        area: 4,
        name: "Philosophy of Logic",
        courses: [
  { code: "PHIL 203L", name: "Logic" },
  { code: "PHIL 235L", name: "Philosophy of Science" },
  { code: "PHIL 310L", name: "Philosophy of Mathematics" },
]
      },
      {
        area: 5,
        name: "Social Sciences (Quantitative)",
        courses: [
  { code: "ECON 104L", name: "Principles of Macroeconomics" },
  { code: "ECON 150L", name: "Economics of Social Issues" },
  { code: "ECON 305L", name: "Econometrics" },
  { code: "POSC 121L", name: "Introduction to Political Research" },
  { code: "POSC 122L", name: "Introduction to Political Theory" },
  { code: "POSC 124L", name: "Campaigns and Elections" },
  { code: "POSC 235L", name: "Public Opinion" },
  { code: "POSC 289L", name: "Politics and Media" },
  { code: "POSC 325L", name: "Political Parties" },
  { code: "POSC 342L", name: "Legislative Politics" },
  { code: "PSYC 350L", name: "Research Methods in Psychology" },
  { code: "SOCW 383N", name: "Social Work Research Methods" },
]
      },
      {
        area: 6,
        name: "Computing & Data (Non-Breadth)",
        note: "Only ONE course allowed from this group. Does not count toward 36 distribution credits.",
        courses: [
  { code: "COM 200L", name: "Communication Research Methods" },
  { code: "CMPT 120L", name: "Introduction to Programming" },
  { code: "CRJU 374L", name: "Research Methods in Criminal Justice" },
  { code: "ENG 222L", name: "Technical Writing" },
  { code: "DATA 220L", name: "Introduction to Data Science" },
  { code: "FASH 304N", name: "Fashion Research Methods" },
]
      }
    ],
    minAreas: 3
  }
};

const ALL_PATHWAYS = ["Quantitative Studies", "Humanistic Studies", "Social Justice", "Creative Expression", "Global Studies", "Sustainability"];

module.exports = {
  REQUIREMENTS,
  isBreadthFulfilled,
  normalizeCode,
  normalizeRequirementCode,
  REQUIREMENT_TO_MATCHER,
  PATHWAYS,
  ALL_PATHWAYS
};