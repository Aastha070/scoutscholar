import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import landingBg from "./assets/landing-bg.png";
import scoutMascot from "./assets/scout-agent.png";
import scoutLottie from "./assets/scout.lottie";
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
  const [dotLottie, setDotLottie] = useState(null);
  const [lottieFailed, setLottieFailed] = useState(false);
  const [mascotFailed, setMascotFailed] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  useEffect(() => {
    if (!dotLottie) return;
    const handleLoadError = () => setLottieFailed(true);
    dotLottie.addEventListener("loadError", handleLoadError);
    return () => dotLottie.removeEventListener("loadError", handleLoadError);
  }, [dotLottie]);

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
        <nav className="pt-5 px-6">
          <span className="font-['Inter'] text-[24px] text-[#7B5CF0] tracking-[-1px]">
            ScoutScholar
          </span>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-['Playfair_Display'] font-bold text-[36px] leading-[44px] md:text-[44px] md:leading-[52px] tracking-[-1px] text-[#7B5CF0] max-w-4xl">
              Dreaming about Studying Abroad?
            </h1>

            <p className="font-['Inter'] font-semibold text-[20px] text-[#7B5CF0]">
              Get Your Profile Evaluation with Scout!
            </p>
          </div>

          {!lottieFailed ? (
            <DotLottieReact
              src={scoutLottie}
              loop
              autoplay
              dotLottieRefCallback={setDotLottie}
              className="w-[180px] h-[180px]"
            />
          ) : !mascotFailed ? (
            <img
              src={scoutMascot}
              alt="Scout mascot"
              className="w-[180px] object-contain"
              onError={() => setMascotFailed(true)}
            />
          ) : (
            <div className="w-[180px] h-[180px] rounded-full bg-[#E4DCFC]" />
          )}

          <button
            type="button"
            onClick={() => navigate("/evaluation")}
            className="group relative w-[220px] p-4 rounded-xl flex items-center justify-center gap-2 font-['Inter'] font-semibold text-2xl text-[#F8F7FF] backdrop-blur-sm cursor-pointer border-none overflow-hidden shadow-[0_2px_8px_rgba(26,22,37,0.08)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl"
              style={{ background: "linear-gradient(172deg, #7B5CF0 16%, #F8F7FF 192%)" }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
              style={{ background: "linear-gradient(172deg, #E4DCFC 0%, #6545E0 100%)" }}
            />
            <span className="relative flex items-center gap-2">
              Let's talk <span aria-hidden="true">&rarr;</span>
            </span>
          </button>

          <div className="flex flex-col sm:flex-row gap-4">
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
