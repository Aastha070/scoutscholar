import { useState, useRef } from "react";
import {
  GraduationCap,
  Star,
  Landmark,
  BookOpen,
  Globe,
  Calendar,
  FileCheck,
  ArrowRight,
  ChevronDown,
  TriangleAlert,
} from "lucide-react";
import { useStore } from "./store";
import ConversationScreen from "./ConversationScreen";
import landingBg from "./assets/landing-bg.png";
import scoutGreeting from "./assets/scout-greeting.png";

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

function buildTargetPrograms(selectedPrograms, otherChecked, otherText) {
  if (!otherChecked) return selectedPrograms;
  const trimmed = otherText.trim();
  return [...selectedPrograms, trimmed || "Other"];
}

const INTAKE_OPTIONS = ["Fall 2026", "Spring 2027", "Fall 2027"];

const TEST_TYPE_OPTIONS = ["IELTS", "GRE", "GMAT"];

const TEST_SCORE_RANGES = {
  IELTS: { min: 0, max: 9 },
  GRE: { min: 260, max: 340 },
  GMAT: { min: 200, max: 800 },
};

function getTestScoreRangeError(data) {
  if (data.test_score.taken !== true) return null;
  const range = TEST_SCORE_RANGES[data.test_score.type];
  if (!range) return null;
  const score = Number(data.test_score.score);
  if (Number.isNaN(score)) return null;
  if (score < range.min || score > range.max) {
    return `${data.test_score.type} scores range from ${range.min} to ${range.max}.`;
  }
  return null;
}

const INDIA_DESTINATION_NAMES = new Set(["india", "bharat"]);

function isIndiaDestination(destination) {
  if (!destination) return false;
  return INDIA_DESTINATION_NAMES.has(destination.trim().toLowerCase());
}

const GRAD_YEAR_OPTIONS = Array.from({ length: 2030 - 2018 + 1 }, (_, i) => 2018 + i);

function getIntakeYear(intake) {
  const match = intake && intake.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

const controlBase =
  "h-11 rounded-lg border border-[#D9D6E8] text-sm text-[#272728] placeholder-[#848383] bg-white/70 focus:outline-none focus:border-[#7B5CF0]";

const inputBase = `${controlBase} px-3`;
const inputWithIconBase = `${controlBase} pl-10 pr-3`;
const selectWithIconBase = `${controlBase} appearance-none pl-10 pr-10`;

const compactControlBase =
  "rounded-lg border border-[#636363] text-xs text-[#272728] placeholder-[#848383] bg-white/70 focus:outline-none focus:border-[#7B5CF0]";
const compactSelectBase = `${compactControlBase} appearance-none px-2 py-2 pr-7`;
const compactInputBase = `${compactControlBase} px-2 py-2`;

const labelBase = "flex items-center gap-1 font-['Inter'] font-medium text-sm text-[#272728]";

function RequiredAsterisk() {
  return <span className="text-[#e31111]">*</span>;
}

function IconField({ icon: Icon, iconColorClass, children }) {
  return (
    <div className="relative">
      <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColorClass}`} />
      {children}
    </div>
  );
}

function SelectField({ icon: Icon, iconColorClass, className = "", children }) {
  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <Icon
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColorClass} pointer-events-none`}
        />
      )}
      {children}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636363] pointer-events-none" />
    </div>
  );
}

function EvaluationForm() {
  const formData = useStore((state) => state.formData);
  const setFormField = useStore((state) => state.setFormField);
  const setResults = useStore((state) => state.setResults);
  const setStatus = useStore((state) => state.setStatus);
  const status = useStore((state) => state.status);
  const results = useStore((state) => state.results);

  const [isMajorOther, setIsMajorOther] = useState(false);
  const [isDestinationOther, setIsDestinationOther] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [isOtherProgramChecked, setIsOtherProgramChecked] = useState(false);
  const [otherProgramText, setOtherProgramText] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [greetingFailed, setGreetingFailed] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  const abortControllerRef = useRef(null);
  const editAbortedRef = useRef(false);

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

  const handleDestinationSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsDestinationOther(true);
      setFormField("destination", "");
    } else {
      setIsDestinationOther(false);
      setFormField("destination", value);
    }
  };

  const handleProgramChipToggle = (option) => () => {
    if (option === "Other") {
      const checked = !isOtherProgramChecked;
      setIsOtherProgramChecked(checked);
      if (!checked) setOtherProgramText("");
      setFormField(
        "target_programs",
        buildTargetPrograms(selectedPrograms, checked, checked ? otherProgramText : "")
      );
      return;
    }

    const checked = !selectedPrograms.includes(option);
    const nextSelected = checked
      ? [...selectedPrograms, option]
      : selectedPrograms.filter((v) => v !== option);
    setSelectedPrograms(nextSelected);
    setFormField(
      "target_programs",
      buildTargetPrograms(nextSelected, isOtherProgramChecked, otherProgramText)
    );
  };

  const handleOtherProgramTextChange = (e) => {
    const newText = e.target.value;
    setOtherProgramText(newText);
    setFormField(
      "target_programs",
      buildTargetPrograms(selectedPrograms, isOtherProgramChecked, newText)
    );
  };

  const handleTestTakenChange = (taken) => () => {
    setFormField("test_score", { taken, type: "", score: null });
  };

  const handleTestTypeChange = (e) => {
    setFormField("test_score", { ...formData.test_score, type: e.target.value });
  };

  const handleTestScoreValueChange = (e) => {
    const value = e.target.value;
    setFormField("test_score", {
      ...formData.test_score,
      score: value === "" ? null : Number(value),
    });
  };

  const getMissingFields = (data) => {
    const missing = [];

    if (!data.degree) missing.push("Degree");
    if (!data.institution || !data.institution.trim()) missing.push("Institution");
    if (!data.major || !data.major.trim()) missing.push("Major");

    const cgpaNum = Number(data.cgpa);
    if (
      data.cgpa === "" ||
      data.cgpa === null ||
      data.cgpa === undefined ||
      Number.isNaN(cgpaNum) ||
      cgpaNum < 0 ||
      cgpaNum > 10
    ) {
      missing.push("CGPA");
    }

    if (!data.destination) missing.push("Destination");
    if (!data.target_intake) missing.push("Target Intake");

    if (
      !data.target_programs ||
      data.target_programs.length < 1 ||
      data.target_programs.length > MAX_PROGRAMS
    ) {
      missing.push("Target Programs");
    }

    if (data.test_score.taken === true) {
      const scoreNum = Number(data.test_score.score);
      const missingType = !data.test_score.type;
      const missingScore =
        data.test_score.score === null ||
        data.test_score.score === undefined ||
        data.test_score.score === "" ||
        Number.isNaN(scoreNum);
      if (missingType || missingScore) {
        missing.push("Test Score");
      }
    }

    return missing;
  };

  const submitEvaluation = async (data) => {
    setStatus("loading");

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const responseJson = await res.json();
      setResults(responseJson);
      setStatus("idle");
    } catch (error) {
      if (error.name === "AbortError" && editAbortedRef.current) {
        editAbortedRef.current = false;
        return;
      }
      if (error.name === "AbortError") {
        console.error("Request timed out after 45s", error);
      } else {
        console.error(error);
      }
      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleEdit = () => {
    editAbortedRef.current = true;
    abortControllerRef.current?.abort();
    setStatus("idle");
    setResults(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = getMissingFields(formData);
    if (missingFields.length > 0) {
      setValidationError(`Please fill in: ${missingFields.join(", ")}.`);
      return;
    }

    if (isIndiaDestination(formData.destination)) {
      setValidationError(
        "ScoutScholar helps you plan studying abroad — please choose an international destination."
      );
      return;
    }

    const rangeError = getTestScoreRangeError(formData);
    if (rangeError) {
      setValidationError(rangeError);
      return;
    }

    setValidationError(null);

    await submitEvaluation(formData);
  };

  const handleTryAgain = () => {
    submitEvaluation(formData);
  };

  const intakeYear = getIntakeYear(formData.target_intake);
  const gradYear = formData.year_of_graduation ? Number(formData.year_of_graduation) : null;
  const showTimelineWarning =
    gradYear !== null && intakeYear !== null && gradYear - intakeYear >= 2;

  return (
    <div className="relative min-h-screen bg-[#FCFCFF] font-['Inter'] overflow-hidden">
      {!bgFailed && (
        <img
          src={landingBg}
          alt=""
          aria-hidden="true"
          className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
          onError={() => setBgFailed(true)}
        />
      )}

      <div className="relative z-10 px-6 pt-5 pb-10">
        <div className="flex justify-end mb-4 max-w-[1100px] mx-auto">
          <span className="font-['Inter'] text-[24px] text-[#7B5CF0] tracking-[-1px]">
            ScoutScholar
          </span>
        </div>

        {status === "loading" || results ? (
          <ConversationScreen status={status} results={results} onEdit={handleEdit} />
        ) : (
        <div className="max-w-[1100px] mx-auto rounded-xl shadow-[0_8px_24px_rgba(26,22,37,0.1)] bg-gradient-to-br from-[rgba(244,244,244,0.38)] to-[rgba(248,247,255,0.38)] p-6">
          <div className="flex items-center gap-4 mb-4">
            {!greetingFailed ? (
              <img
                src={scoutGreeting}
                alt="Scout"
                className="w-[72px] h-[72px] rounded-full object-cover"
                onError={() => setGreetingFailed(true)}
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-[#E4DCFC] flex-shrink-0" />
            )}
            <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-3">
              <p className="text-sm text-[#454545]">
                Let's get your journey planned, we are in this together 💪
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Education Details */}
              <div className="flex flex-col h-full rounded-2xl p-4 shadow-sm bg-gradient-to-b from-[#F2F0FE] to-white">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[#C8BFF9] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#7B5CF0]" />
                  </div>
                  <h3 className="font-['Inter'] font-semibold text-xl text-[#272728]">
                    1. Education Details
                  </h3>
                </div>
                <p className="text-sm text-[#636363] mb-3">
                  Tell us about your current or more recent education
                </p>

                <div className="flex-1 flex flex-col justify-center gap-3">
                  <div>
                    <label htmlFor="degree" className={labelBase}>
                      Education Degree
                      <RequiredAsterisk />
                    </label>
                    <div className="mt-2">
                      <SelectField icon={GraduationCap} iconColorClass="text-[#7B5CF0]">
                        <select
                          id="degree"
                          value={formData.degree}
                          onChange={(e) => setFormField("degree", e.target.value)}
                          className={`w-full ${selectWithIconBase}`}
                        >
                          <option value="">Select degree</option>
                          {DEGREE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </SelectField>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="major" className={labelBase}>
                      Major/Field of Study
                      <RequiredAsterisk />
                    </label>
                    <div className="mt-2">
                      <SelectField icon={BookOpen} iconColorClass="text-[#7B5CF0]">
                        <select
                          id="major"
                          value={isMajorOther ? "Other" : formData.major}
                          onChange={handleMajorSelectChange}
                          className={`w-full ${selectWithIconBase}`}
                        >
                          <option value="">Select major</option>
                          {MAJOR_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </SelectField>
                    </div>
                    {isMajorOther && (
                      <input
                        type="text"
                        placeholder="Enter your major"
                        value={formData.major}
                        onChange={(e) => setFormField("major", e.target.value)}
                        className={`w-full ${inputBase} mt-2`}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cgpa" className={labelBase}>
                        CGPA
                        <RequiredAsterisk />
                      </label>
                      <div className="mt-2">
                        <IconField icon={Star} iconColorClass="text-[#7B5CF0]">
                          <input
                            id="cgpa"
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="e.g 8.5"
                            value={formData.cgpa}
                            onChange={(e) => setFormField("cgpa", e.target.value)}
                            className={`w-full ${inputWithIconBase}`}
                          />
                        </IconField>
                      </div>
                      <p className="text-xs text-[#636363] mt-1">
                        Enter your CGPA on a 10-point scale.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="year_of_graduation" className={labelBase}>
                        Year of Graduation
                      </label>
                      <div className="mt-2">
                        <SelectField icon={Calendar} iconColorClass="text-[#7B5CF0]">
                          <select
                            id="year_of_graduation"
                            value={formData.year_of_graduation}
                            onChange={(e) => setFormField("year_of_graduation", e.target.value)}
                            className={`w-full ${selectWithIconBase}`}
                          >
                            <option value="">Select year</option>
                            {GRAD_YEAR_OPTIONS.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </SelectField>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="institution" className={labelBase}>
                      Institution Name
                      <RequiredAsterisk />
                    </label>
                    <div className="mt-2">
                      <IconField icon={Landmark} iconColorClass="text-[#7B5CF0]">
                        <input
                          id="institution"
                          type="text"
                          value={formData.institution}
                          onChange={(e) => setFormField("institution", e.target.value)}
                          className={`w-full ${inputWithIconBase}`}
                        />
                      </IconField>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Study Abroad Goals */}
              <div className="flex flex-col h-full rounded-2xl p-4 shadow-sm bg-gradient-to-b from-[#F8F0E0] to-white">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[#F5D38F] flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-['Inter'] font-semibold text-xl text-[#272728]">
                    2. Study Abroad Goals
                  </h3>
                </div>
                <p className="text-sm text-[#636363] mb-3">
                  Share the details regarding your study abroad goal.
                </p>

                <div className="flex-1 flex flex-col justify-center gap-3">
                  <div>
                    <label htmlFor="destination" className={labelBase}>
                      Preferred Destination
                      <RequiredAsterisk />
                    </label>
                    <div className="mt-2">
                      <SelectField icon={Globe} iconColorClass="text-amber-600">
                        <select
                          id="destination"
                          value={isDestinationOther ? "Other" : formData.destination}
                          onChange={handleDestinationSelectChange}
                          className={`w-full ${selectWithIconBase}`}
                        >
                          <option value="">Select destination</option>
                          {DESTINATION_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </SelectField>
                    </div>
                    {isDestinationOther && (
                      <input
                        type="text"
                        placeholder="Enter your destination"
                        value={formData.destination}
                        onChange={(e) => setFormField("destination", e.target.value)}
                        className={`w-full ${inputBase} mt-2`}
                      />
                    )}
                  </div>

                  <fieldset>
                    <legend className={labelBase}>
                      Targeted Programs (choose 1-3)
                      <RequiredAsterisk />
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PROGRAM_OPTIONS.map((option) => {
                        const isChecked =
                          option === "Other"
                            ? isOtherProgramChecked
                            : selectedPrograms.includes(option);
                        const totalSelected =
                          selectedPrograms.length + (isOtherProgramChecked ? 1 : 0);
                        const disableUnchecked = !isChecked && totalSelected >= MAX_PROGRAMS;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={handleProgramChipToggle(option)}
                            disabled={disableUnchecked}
                            className={`rounded-full font-['Inter'] text-sm px-3.5 py-1.5 border transition-colors ${
                              isChecked
                                ? "bg-[#F48D01] text-white border-transparent"
                                : "bg-transparent text-[#494949] border-[#C5C5C5] hover:bg-[#F48D01]/10"
                            } ${disableUnchecked ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {isOtherProgramChecked && (
                      <input
                        type="text"
                        placeholder="Enter your target program"
                        value={otherProgramText}
                        onChange={handleOtherProgramTextChange}
                        className={`w-full ${inputBase} mt-2`}
                      />
                    )}
                  </fieldset>

                  <div>
                    <label htmlFor="target_intake" className={labelBase}>
                      Target Intake
                      <RequiredAsterisk />
                    </label>
                    <div className="mt-2">
                      <SelectField icon={Calendar} iconColorClass="text-amber-600">
                        <select
                          id="target_intake"
                          value={formData.target_intake}
                          onChange={(e) => setFormField("target_intake", e.target.value)}
                          className={`w-full ${selectWithIconBase}`}
                        >
                          <option value="">Select intake</option>
                          {INTAKE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </SelectField>
                    </div>
                    {showTimelineWarning && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2 text-xs text-amber-800">
                        <TriangleAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        Heads up — you'd still be mid-degree at this intake. Double-check your
                        graduation year and intake.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Scores bar + Submit button */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
              <fieldset className="flex-1 w-full rounded-xl bg-[#F2F0FE] p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
                  <legend className="flex items-center gap-2 font-['Inter'] font-semibold text-[18px] text-[#272728]">
                    <FileCheck className="w-5 h-5 text-[#7B5CF0]" />
                    Test Scores
                    <span className="font-['Inter'] text-xs text-[#4C2FB8] bg-gradient-to-br from-[#F8F7FF] to-[#A99AF4] rounded-full px-2.5 py-1">
                      Optional
                    </span>
                  </legend>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-[#272728]">
                      <input
                        type="radio"
                        name="test_score_taken"
                        checked={formData.test_score.taken === true}
                        onChange={handleTestTakenChange(true)}
                        className="accent-[#7B5CF0] w-4 h-4"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#272728]">
                      <input
                        type="radio"
                        name="test_score_taken"
                        checked={formData.test_score.taken === false}
                        onChange={handleTestTakenChange(false)}
                        className="accent-[#7B5CF0] w-4 h-4"
                      />
                      No
                    </label>
                    {formData.test_score.taken === true && (
                      <>
                        <SelectField className="max-w-[168px] w-full">
                          <select
                            value={formData.test_score.type}
                            onChange={handleTestTypeChange}
                            className={`w-full ${compactSelectBase}`}
                          >
                            <option value="">Select test</option>
                            {TEST_TYPE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </SelectField>
                        <input
                          type="number"
                          step="0.1"
                          min={TEST_SCORE_RANGES[formData.test_score.type]?.min}
                          max={TEST_SCORE_RANGES[formData.test_score.type]?.max}
                          placeholder="e.g 330 or 7.5"
                          value={formData.test_score.score ?? ""}
                          onChange={handleTestScoreValueChange}
                          className={`max-w-[94px] w-full ${compactInputBase}`}
                        />
                      </>
                    )}
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className="max-w-[239px] w-full bg-[#7B5CF0] text-white font-['Inter'] font-semibold text-2xl rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer border-none whitespace-nowrap shadow-[0_2px_4px_rgba(26,22,37,0.08)]"
              >
                Get Evaluation <ArrowRight className="w-[30px] h-[30px]" />
              </button>
            </div>

            {validationError && (
              <p
                className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600"
                role="alert"
              >
                {validationError}
              </p>
            )}
          </form>
        </div>
        )}

        <div className="max-w-[1100px] mx-auto">
          {status === "error" && (
            <div
              role="alert"
              className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-6 text-center"
            >
              <p className="text-[#454545]">
                We're having trouble evaluating your profile right now. Please
                try again in a moment.
              </p>
              <button
                type="button"
                onClick={handleTryAgain}
                className="mt-4 bg-[#7B5CF0] text-white font-['Inter'] font-semibold rounded-xl px-6 py-3 cursor-pointer border-none"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluationForm;
