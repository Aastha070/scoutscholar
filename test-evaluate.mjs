// Standalone test client for POST /api/evaluate. Read-only — does not touch api/evaluate.js.
// Usage: with `vercel dev` running, run `node test-evaluate.mjs`

const ENDPOINT = "http://localhost:3000/api/evaluate";

const REQUIRED_KEYS = [
  "candidacy_assessment",
  "school_recommendations",
  "gaps",
  "recommendations",
  "next_step_outline",
];

function hasAllKeys(obj) {
  return REQUIRED_KEYS.every((key) => Object.prototype.hasOwnProperty.call(obj, key));
}

const profiles = [
  {
    label: "High CGPA, IIT, GRE 335, targeting US MS CS",
    payload: {
      degree: "B.Tech",
      institution: "IIT Bombay",
      major: "Computer Science",
      cgpa: 9.1,
      year_of_graduation: 2026,
      destination: "US",
      target_programs: ["MS Computer Science"],
      target_intake: "Fall 2027",
      test_score: { taken: true, type: "GRE", score: 335 },
    },
  },
  {
    label: "Mid CGPA, tier-2 college, no test yet, targeting US MS CS + MS Data Science",
    payload: {
      degree: "B.Tech",
      institution: "Tier-2 Engineering College",
      major: "Information Technology",
      cgpa: 7.2,
      year_of_graduation: 2025,
      destination: "US",
      target_programs: ["MS Computer Science", "MS Data Science"],
      target_intake: "Fall 2027",
      test_score: { taken: false, type: "", score: null },
    },
  },
  {
    label: "Low CGPA, targeting UK MS Analytics, IELTS 7.5",
    payload: {
      degree: "B.Sc",
      institution: "State University",
      major: "Statistics",
      cgpa: 6.0,
      destination: "UK",
      target_programs: ["MS Analytics"],
      target_intake: "Fall 2027",
      test_score: { taken: true, type: "IELTS", score: 7.5 },
    },
  },
  {
    label: '"Other" major (Bioinformatics) and "Other" target program (MS Computational Biology)',
    payload: {
      degree: "B.Sc",
      institution: "Regional University",
      major: "Other",
      major_other: "Bioinformatics",
      cgpa: 8.0,
      destination: "US",
      target_programs: ["Other"],
      target_programs_other: "MS Computational Biology",
      target_intake: "Fall 2027",
      test_score: { taken: null, type: "", score: null },
    },
  },
  {
    label: "GMAT taker (700) targeting MBA in Canada",
    payload: {
      degree: "B.Com",
      institution: "Delhi University",
      major: "Business Administration",
      cgpa: 8.4,
      year_of_graduation: 2022,
      destination: "Canada",
      target_programs: ["MBA"],
      target_intake: "Fall 2027",
      test_score: { taken: true, type: "GMAT", score: 700 },
    },
  },
  {
    // The frontend blocks an "India" destination outright, so this exercises the
    // backend's input_review logic directly, bypassing the form. Saurashtra
    // University is the exact example the system prompt uses for inferring an
    // institution's country, so this should reliably trip the "warning" rule for
    // institution/destination country overlap.
    label: 'India destination + Indian institution (backend direct) — expect input_review.status "warning"',
    payload: {
      degree: "B.Sc",
      institution: "Saurashtra University",
      major: "CS",
      cgpa: 7.5,
      year_of_graduation: 2026,
      destination: "India",
      target_programs: ["MS CS"],
      target_intake: "Fall 2027",
      test_score: { taken: false, type: "", score: null },
    },
    extraChecks: [
      {
        name: "input_review present",
        fn: (p) => p && typeof p.input_review === "object" && p.input_review !== null,
      },
      {
        name: 'input_review.status === "warning"',
        fn: (p) => p?.input_review?.status === "warning",
      },
    ],
  },
  {
    label: 'Abusive institution field — expect input_review.status "rejected"',
    payload: {
      degree: "B.Tech",
      institution: "Screw you, you worthless piece of garbage. Go f*** yourself.",
      major: "CS",
      cgpa: 7.0,
      destination: "US",
      target_programs: ["MS CS"],
      target_intake: "Fall 2027",
      test_score: { taken: false, type: "", score: null },
    },
    extraChecks: [
      {
        name: 'input_review.status === "rejected"',
        fn: (p) => p?.input_review?.status === "rejected",
      },
      {
        name: "no real school recommendations",
        fn: (p) => !Array.isArray(p?.school_recommendations) || p.school_recommendations.length <= 1,
      },
    ],
  },
  {
    label: 'Normal control profile — expect input_review.status "ok"',
    payload: {
      degree: "B.Tech",
      institution: "National Institute of Technology Trichy",
      major: "Mechanical Eng",
      cgpa: 8.2,
      year_of_graduation: 2026,
      destination: "Germany",
      target_programs: ["MS Mechanical Eng"],
      target_intake: "Fall 2027",
      test_score: { taken: false, type: "", score: null },
    },
    extraChecks: [
      {
        name: 'input_review.status === "ok"',
        fn: (p) => p?.input_review?.status === "ok",
      },
    ],
  },
];

async function runProfile({ label, payload, extraChecks = [] }) {
  const totalChecks = 1 + extraChecks.length;

  console.log("\n" + "=".repeat(80));
  console.log(`Profile: ${label}`);
  console.log("=".repeat(80));

  let responseText;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    responseText = await res.text();

    if (!res.ok) {
      console.log(`HTTP status: ${res.status} (not OK)`);
    }
  } catch (err) {
    console.log(`Request failed: ${err.message}`);
    console.log("Check [schema valid]: FAIL");
    for (const check of extraChecks) {
      console.log(`Check [${check.name}]: FAIL`);
    }
    return { passCount: 0, totalChecks };
  }

  let parsed;
  let validJson = true;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    validJson = false;
  }
  console.log(`Valid JSON: ${validJson}`);

  const allKeysPresent = validJson && hasAllKeys(parsed);
  console.log(`All required keys present: ${allKeysPresent}`);

  const schemaPass = validJson && allKeysPresent;
  console.log(`Check [schema valid]: ${schemaPass ? "PASS" : "FAIL"}`);

  let passCount = schemaPass ? 1 : 0;

  for (const check of extraChecks) {
    let checkPass = false;
    if (validJson) {
      try {
        checkPass = Boolean(check.fn(parsed));
      } catch {
        checkPass = false;
      }
    }
    console.log(`Check [${check.name}]: ${checkPass ? "PASS" : "FAIL"}`);
    if (checkPass) passCount++;
  }

  console.log("Response:");
  if (validJson) {
    console.log(JSON.stringify(parsed, null, 2));
  } else {
    console.log(responseText);
  }

  return { passCount, totalChecks };
}

async function main() {
  let totalPass = 0;
  let totalChecks = 0;

  for (const profile of profiles) {
    const result = await runProfile(profile);
    totalPass += result.passCount;
    totalChecks += result.totalChecks;
  }

  console.log("\n" + "=".repeat(80));
  console.log(`${totalPass}/${totalChecks} checks passed`);
  console.log("=".repeat(80));
}

main();
