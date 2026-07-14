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
];

function hasAllKeys(obj) {
  return REQUIRED_KEYS.every((key) => Object.prototype.hasOwnProperty.call(obj, key));
}

async function runProfile({ label, payload }) {
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
    console.log("Result: FAIL");
    return false;
  }

  let parsed;
  let validJson = true;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    validJson = false;
  }
  console.log(`Valid JSON: ${validJson}`);

  let allKeysPresent = false;
  if (validJson) {
    allKeysPresent = hasAllKeys(parsed);
  }
  console.log(`All required keys present: ${allKeysPresent}`);

  const pass = validJson && allKeysPresent;
  console.log(`Result: ${pass ? "PASS" : "FAIL"}`);

  console.log("Response:");
  if (validJson) {
    console.log(JSON.stringify(parsed, null, 2));
  } else {
    console.log(responseText);
  }

  return pass;
}

async function main() {
  let passCount = 0;

  for (const profile of profiles) {
    const pass = await runProfile(profile);
    if (pass) passCount++;
  }

  console.log("\n" + "=".repeat(80));
  console.log(`${passCount}/${profiles.length} passed`);
  console.log("=".repeat(80));
}

main();
