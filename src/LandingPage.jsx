import { useState } from "react";
import { useNavigate } from "react-router-dom";
import landingBg from "./assets/landing-bg.png";
import scoutMascot from "./assets/scout-agent.png";
import badge1 from "./assets/badge01.png";
import badge2 from "./assets/badge02.png";
import badge3 from "./assets/badge03.png";

const BADGES = [
  { icon: badge1, emoji: "🎯", label: "Profile Match" },
  { icon: badge2, emoji: "💬", label: "Get Clear Answers" },
  { icon: badge3, emoji: "✨", label: "Smart Recommendations" },
];

function BadgeIcon({ icon, emoji, label }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <span className="text-xl leading-none">{emoji}</span>
  ) : (
    <img
      src={icon}
      alt={label}
      className="w-6 h-6 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [mascotFailed, setMascotFailed] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F8F7FF] overflow-hidden">
      {!bgFailed && (
        <img
          src={landingBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          onError={() => setBgFailed(true)}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="pt-8 px-6">
          <span className="font-['Inter'] text-[32px] text-[#7B5CF0] tracking-[-1.5px]">
            ScoutScholar
          </span>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex flex-col items-center gap-5">
            <h1 className="font-['Playfair_Display'] font-bold text-[40px] leading-[48px] sm:text-[64px] sm:leading-[72px] tracking-[-1px] text-[#7B5CF0] max-w-4xl">
              Dreaming about Studying Abroad?
            </h1>

            <p className="font-['Inter'] font-semibold text-[32px] text-[#7B5CF0]">
              Get Your Profile Evaluation with Scout!
            </p>
          </div>

          {!mascotFailed ? (
            <img
              src={scoutMascot}
              alt="Scout mascot"
              className="w-[180px] object-contain mt-10"
              onError={() => setMascotFailed(true)}
            />
          ) : (
            <div className="w-[180px] h-[180px] rounded-full bg-[#E4DCFC] mt-10" />
          )}

          <button
            type="button"
            onClick={() => navigate("/evaluation")}
            className="mt-10 w-[220px] p-4 rounded-[12px] flex items-center justify-center gap-2 font-['Inter'] font-semibold text-2xl text-[#F8F7FF] backdrop-blur-sm cursor-pointer border-none transition-[background] duration-300 bg-[linear-gradient(172deg,#7B5CF0_16%,#F8F7FF_192%)] hover:bg-[linear-gradient(172deg,#E4DCFC_16%,#6545E0_192%)]"
          >
            Let's talk <span aria-hidden="true">&rarr;</span>
          </button>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 p-2 rounded-[12px] bg-white/70 shadow-sm font-['Inter'] font-semibold text-xl text-[#7B5CF0]"
              >
                <BadgeIcon icon={badge.icon} emoji={badge.emoji} label={badge.label} />
                {badge.label}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
