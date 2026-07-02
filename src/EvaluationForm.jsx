import { useState } from "react";
import { useStore } from "./store";
import ResultCards from "./ResultCards";

const DEGREE_OPTIONS = ["Bachelor's", "Master's", "Diploma"];

const MAJOR_OPTIONS = [
  "CS",
  "ECE",
  "Data Science",
  "Finance",
  "Analytics",
  "Mechanical Eng",
  "Chemical Eng",
  "Electrical Eng",
  "Civil Eng",
  "Business",
  "Other",
];

const DESTINATION_OPTIONS = ["US", "UK", "Canada", "Australia", "Germany", "Other"];

const PROGRAM_OPTIONS = [
  "MS CS",
  "MS Data Science",
  "MS Finance",
  "MS Analytics",
  "MS ECE",
  "MS Mechanical Eng",
  "MS Electrical Eng",
  "MS Civil Eng",
  "MBA",
  "Other",
];

const MAX_PROGRAMS = 3;

const INTAKE_OPTIONS = ["Fall 2026", "Spring 2027", "Fall 2027"];

const TEST_SCORE_OPTIONS = [
  { label: "Haven't taken it yet", status: "not_taken", type: "" },
  { label: "Planning to take it", status: "planned", type: "" },
  { label: "GRE", status: "taken", type: "GRE" },
  { label: "GMAT", status: "taken", type: "GMAT" },
];

function EvaluationForm() {
  const formData = useStore((state) => state.formData);
  const setFormField = useStore((state) => state.setFormField);
  const setResults = useStore((state) => state.setResults);
  const setStatus = useStore((state) => state.setStatus);
  const status = useStore((state) => state.status);
  const results = useStore((state) => state.results);

  const [isMajorOther, setIsMajorOther] = useState(false);
  const [isOtherProgramChecked, setIsOtherProgramChecked] = useState(false);
  const [otherProgramText, setOtherProgramText] = useState("");

  const handleMajorSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsMajorOther(true);
      setFormField("major", "");
    } else {
      setIsMajorOther(false);
      setFormField("major", value);
    }
  };

  const handleProgramCheckboxChange = (option) => (e) => {
    const checked = e.target.checked;
    const current = formData.target_programs;

    if (option === "Other") {
      setIsOtherProgramChecked(checked);
      const otherValue = otherProgramText || "Other";
      if (checked) {
        setFormField("target_programs", [...current, otherValue]);
      } else {
        setFormField(
          "target_programs",
          current.filter((v) => v !== otherValue)
        );
        setOtherProgramText("");
      }
      return;
    }

    if (checked) {
      setFormField("target_programs", [...current, option]);
    } else {
      setFormField(
        "target_programs",
        current.filter((v) => v !== option)
      );
    }
  };

  const handleOtherProgramTextChange = (e) => {
    const newText = e.target.value;
    const previousValue = otherProgramText || "Other";
    setOtherProgramText(newText);
    setFormField(
      "target_programs",
      formData.target_programs.map((v) =>
        v === previousValue ? newText || "Other" : v
      )
    );
  };

  const handleTestScoreOptionChange = (option) => () => {
    setFormField("test_score", { type: option.type, score: null, status: option.status });
  };

  const handleTestScoreValueChange = (e) => {
    const value = e.target.value;
    setFormField("test_score", {
      ...formData.test_score,
      score: value === "" ? null : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const responseJson = await res.json();
      setResults(responseJson);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  const showTestScoreInput =
    formData.test_score.type === "GRE" || formData.test_score.type === "GMAT";

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="degree">Education Degree</label>
        <select
          id="degree"
          value={formData.degree}
          onChange={(e) => setFormField("degree", e.target.value)}
        >
          <option value="">Select degree</option>
          {DEGREE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="institution">Institution Name</label>
        <input
          id="institution"
          type="text"
          value={formData.institution}
          onChange={(e) => setFormField("institution", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="major">Major/Field of Study</label>
        <select
          id="major"
          value={isMajorOther ? "Other" : formData.major}
          onChange={handleMajorSelectChange}
        >
          <option value="">Select major</option>
          {MAJOR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {isMajorOther && (
          <input
            type="text"
            placeholder="Enter your major"
            value={formData.major}
            onChange={(e) => setFormField("major", e.target.value)}
          />
        )}
      </div>

      <div>
        <label htmlFor="cgpa">CGPA</label>
        <input
          id="cgpa"
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={formData.cgpa}
          onChange={(e) => setFormField("cgpa", e.target.value)}
        />
        <p>Enter your CGPA on a 10-point scale.</p>
      </div>

      <div>
        <label htmlFor="destination">Preferred Destination</label>
        <select
          id="destination"
          value={formData.destination}
          onChange={(e) => setFormField("destination", e.target.value)}
        >
          <option value="">Select destination</option>
          {DESTINATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend>Targeted Programs (choose 1-3)</legend>
        {PROGRAM_OPTIONS.map((option) => {
          const isChecked =
            option === "Other"
              ? isOtherProgramChecked
              : formData.target_programs.includes(option);
          const disableUnchecked =
            !isChecked && formData.target_programs.length >= MAX_PROGRAMS;

          return (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={disableUnchecked}
                  onChange={handleProgramCheckboxChange(option)}
                />
                {option}
              </label>
              {option === "Other" && isOtherProgramChecked && (
                <input
                  type="text"
                  placeholder="Enter your target program"
                  value={otherProgramText}
                  onChange={handleOtherProgramTextChange}
                />
              )}
            </div>
          );
        })}
      </fieldset>

      <div>
        <label htmlFor="target_intake">Target Intake</label>
        <select
          id="target_intake"
          value={formData.target_intake}
          onChange={(e) => setFormField("target_intake", e.target.value)}
        >
          <option value="">Select intake</option>
          {INTAKE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend>Standardized Test Score</legend>
        {TEST_SCORE_OPTIONS.map((option) => (
          <label key={option.label}>
            <input
              type="radio"
              name="test_score_option"
              checked={
                formData.test_score.status === option.status &&
                formData.test_score.type === option.type
              }
              onChange={handleTestScoreOptionChange(option)}
            />
            {option.label}
          </label>
        ))}
        {showTestScoreInput && (
          <input
            type="number"
            placeholder="Score"
            value={formData.test_score.score ?? ""}
            onChange={handleTestScoreValueChange}
          />
        )}
      </fieldset>

      <button type="submit">Get Your Evaluation</button>
      </form>

      <div>
        {status === "loading" && <p>Evaluating…</p>}
        {status === "error" && <p>Something went wrong.</p>}
        {results && <ResultCards results={results} />}
      </div>
    </>
  );
}

export default EvaluationForm;
