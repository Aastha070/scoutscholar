import { useEffect, useMemo, useState } from "react";
import {
  User,
  Globe,
  GraduationCap,
  Star,
  Landmark,
  BookOpen,
  Calendar,
  FileCheck,
  Brain,
  ChevronRight,
} from "lucide-react";
import { useStore } from "./store";
import scoutGreeting from "./assets/scout-greeting.png";
import scoutThankful from "./assets/scout-thankfull.png";
import scoutThinking from "./assets/scout-thinking.png";

const MESSAGE_CYCLE_MS = 3500;
const FADE_MS = 300;

function AvatarImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <div className="w-[72px] h-[72px] rounded-full bg-[#E4DCFC] flex-shrink-0" />
  ) : (
    <img
      src={src}
      alt={alt}
      className="w-[72px] h-[72px] rounded-full object-cover flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function ValuePill({ children, colorClass = "bg-[#7B5CF0]" }) {
  return (
    <div
      className={`w-full ${colorClass} text-white font-['Inter'] text-sm rounded-lg p-2 truncate`}
    >
      {children || "—"}
    </div>
  );
}

function FieldLabel({ icon: Icon, iconColorClass, children }) {
  return (
    <div className={`flex items-center gap-1 font-['Inter'] font-medium text-sm text-[#272728] mb-2`}>
      {Icon && <Icon className={`w-4 h-4 ${iconColorClass}`} />}
      {children}
    </div>
  );
}

function buildMessages(formData) {
  const firstProgram = formData.target_programs?.[0];

  return [
    "Reading through your profile...",
    "Comparing your CGPA with university requirements...",
    formData.destination
      ? `Scanning universities in ${formData.destination}...`
      : "Scanning universities that match your goals...",
    firstProgram
      ? `Evaluating fit for ${firstProgram}...`
      : "Evaluating fit for your target programs...",
    formData.target_intake
      ? `Checking admission trends for ${formData.target_intake}...`
      : "Checking admission trends...",
    "Weighing safety, target, and reach options...",
    "Putting together your recommendations...",
  ];
}

function AnticipationScreen() {
  const formData = useStore((state) => state.formData);

  const messages = useMemo(() => buildMessages(formData), [formData]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, FADE_MS);
    }, MESSAGE_CYCLE_MS);
    return () => clearInterval(interval);
  }, [messages.length]);

  const hasProgramSelections = formData.target_programs && formData.target_programs.length > 0;

  return (
    <div className="max-w-[1100px] mx-auto rounded-xl shadow-[0_8px_24px_rgba(26,22,37,0.1)] bg-gradient-to-br from-[rgba(244,244,244,0.38)] to-[rgba(248,247,255,0.38)] p-8">
      {/* Scout greeting */}
      <div className="flex items-center gap-4 mb-8">
        <AvatarImage src={scoutGreeting} alt="Scout" />
        <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-3">
          <p className="text-sm text-[#454545]">
            Let's get your journey planned, we are in this together 💪
          </p>
        </div>
      </div>

      {/* Context card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col h-full rounded-lg border border-[#6545E0] bg-white/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-[#C8BFF9] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#7B5CF0]" />
            </div>
            {formData.year_of_graduation && (
              <div className="flex items-center gap-1 text-[#7B5CF0]">
                <Calendar className="w-4 h-4" />
                <span className="font-['Inter'] text-base">{formData.year_of_graduation}</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={GraduationCap} iconColorClass="text-[#7B5CF0]">
                  Degree
                </FieldLabel>
                <ValuePill>{formData.degree}</ValuePill>
              </div>
              <div>
                <FieldLabel icon={BookOpen} iconColorClass="text-[#7B5CF0]">
                  Major
                </FieldLabel>
                <ValuePill>{formData.major}</ValuePill>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={Star} iconColorClass="text-[#7B5CF0]">
                  CGPA
                </FieldLabel>
                <ValuePill>{formData.cgpa}</ValuePill>
              </div>
              <div>
                <FieldLabel icon={Landmark} iconColorClass="text-[#7B5CF0]">
                  Institution
                </FieldLabel>
                <ValuePill>{formData.institution}</ValuePill>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full rounded-lg border border-[#F48D01] bg-white/50 backdrop-blur-sm p-4">
          <div className="mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F5D38F] flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3">
            <div>
              <FieldLabel icon={Globe} iconColorClass="text-amber-600">
                Destination
              </FieldLabel>
              <ValuePill colorClass="bg-[#F48D01]">{formData.destination}</ValuePill>
            </div>

            <div>
              <div className="font-['Inter'] font-medium text-sm text-[#272728] mb-2">
                Targeted Program
              </div>
              <div className="flex flex-wrap gap-2">
                {hasProgramSelections ? (
                  formData.target_programs.map((program) => (
                    <span
                      key={program}
                      className="rounded-full bg-[#F48D01] text-white font-['Inter'] text-sm px-3.5 py-1.5"
                    >
                      {program}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#636363]">—</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="font-['Inter'] font-medium text-sm text-[#272728]">
                Target Intake
              </span>
              <span className="font-['Inter'] text-sm text-[#F48D01]">
                {formData.target_intake || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test scores strip */}
      <div className="mt-4 rounded-lg bg-[#F2F0FE] p-3 flex items-center gap-3">
        <FileCheck className="w-5 h-5 text-[#7B5CF0] flex-shrink-0" />
        {formData.test_score.taken === true ? (
          <div className="flex items-center gap-3">
            <span className="font-['Inter'] font-semibold text-xl text-[#6545E0]">
              {formData.test_score.type}
            </span>
            <span className="font-['Inter'] font-semibold text-xl text-white bg-[#7B5CF0] rounded-lg px-3 py-1 max-w-[94px] truncate text-center">
              {formData.test_score.score}
            </span>
          </div>
        ) : (
          <span className="text-sm text-[#636363]">No test scores yet</span>
        )}
      </div>

      {/* Scout thanks bubble */}
      <div className="flex items-center gap-4 mt-8">
        <AvatarImage src={scoutThankful} alt="Scout" />
        <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-3">
          <p className="text-sm text-[#454545]">
            Thanks, <span className="font-medium">let me analyze your profile</span> now
          </p>
        </div>
      </div>

      {/* Scout is thinking */}
      <div className="flex items-center gap-4 mt-8">
        <AvatarImage src={scoutThinking} alt="Scout" />
        <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-4 flex-1">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#7B5CF0] animate-pulse" />
            <span className="font-['Inter'] font-semibold text-xl text-[#7B5CF0]">
              Scout is thinking
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <p
              className={`font-['Inter'] text-sm text-[#454545] transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {messages[messageIndex]}
            </p>
            <ChevronRight className="w-4 h-4 text-[#454545] flex-shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex justify-center mt-8" aria-hidden="true">
        <div
          className="w-[71px] h-[71px] rounded-full flex items-center justify-center animate-pulse"
          style={{ background: "linear-gradient(135deg, #F8F7FF, #A99AF4)" }}
        >
          <div className="w-5 h-5 rounded-md bg-[#6545E0]" />
        </div>
      </div>
    </div>
  );
}

export default AnticipationScreen;
