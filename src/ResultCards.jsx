import { useState } from "react";
import scoutThankful from "./assets/scout-thankfull.png";
import scoutGreeting from "./assets/scout-greeting.png";
import iconProfile from "./assets/icon-profile.png";
import iconSchools from "./assets/icon-schools.png";
import iconGaps from "./assets/icon-gaps.png";
import iconWhatNext from "./assets/icon-whatnext.png";

const LEVEL_BADGE_CLASSES = {
  Strong: "bg-green-100 text-green-800",
  Competitive: "bg-yellow-100 text-yellow-800",
  "Needs Work": "bg-orange-100 text-orange-800",
};

const TIER_BADGE_CLASSES = {
  Safety: "bg-[#2758E7] text-white",
  Target: "bg-[#16A34A] text-white",
  Reach: "bg-[#7B5CF0] text-white",
};

const TIER_BADGE_LABELS = {
  Safety: "Safe",
};

function splitSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const LEAD_IN_MAX_CHARS = 80;

function splitLeadIn(text) {
  if (!text) return { lead: "", rest: "" };
  const match = text.match(/^.*?[.!?—]/);
  if (!match || match[0].length > LEAD_IN_MAX_CHARS) {
    return { lead: "", rest: text };
  }
  return { lead: match[0], rest: text.slice(match[0].length).trim() };
}

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

function CardIcon({ src, emoji }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-xl flex-shrink-0">
      {emoji}
    </div>
  ) : (
    <img
      src={src}
      alt=""
      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function BulletRow({ markerClassName, children }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full border-2 bg-transparent ${markerClassName}`}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ResultCards({ results }) {
  const { candidacy_assessment, school_recommendations, gaps, recommendations, next_step_outline } =
    results;
  const hasGaps = Array.isArray(gaps) && gaps.length > 0;

  const levelBadgeClasses =
    LEVEL_BADGE_CLASSES[candidacy_assessment.level] || "bg-gray-100 text-gray-800";

  return (
    <>
      {/* Scout intro bubble */}
      <div className="flex items-center gap-4 mb-6">
        <AvatarImage src={scoutThankful} alt="Scout" />
        <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-3">
          <p className="text-sm text-[#454545]">
            <span className="font-semibold">Alright!</span> I have gone through your profile, here
            is my first impression.
          </p>
        </div>
      </div>

      {/* Result cards */}
      <div className="bg-[#F7F4FE] rounded-[27px] p-4 shadow-[0_8px_24px_rgba(26,22,37,0.1)] flex flex-col gap-6">
        {/* Card 1: Profile */}
        <div className="rounded-2xl p-3 shadow-[0_2px_4px_rgba(26,22,37,0.08)] bg-[#EAFAF5]">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <CardIcon src={iconProfile} emoji="⭐" />
            <h3 className="font-['Inter'] font-semibold text-[18px] leading-[20px] text-[#272728]">Profile</h3>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelBadgeClasses}`}
            >
              {candidacy_assessment.level}
            </span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {splitSentences(candidacy_assessment.reasoning).map((sentence, index) => (
              <BulletRow key={index} markerClassName="border-[#16A34A]">
                <p className="font-['Inter'] text-base text-[#272728]">{sentence}</p>
              </BulletRow>
            ))}
          </div>
        </div>

        {/* Card 2: Schools */}
        <div className="rounded-2xl p-3 shadow-[0_2px_4px_rgba(26,22,37,0.08)] bg-[#D6DEF7]">
          <div className="flex items-center gap-3 mb-2">
            <CardIcon src={iconSchools} emoji="🏫" />
            <h3 className="font-['Inter'] font-semibold text-[18px] leading-[20px] text-[#272728]">
              Schools That Match Your Profile
            </h3>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {school_recommendations.map((school, index) => {
              const tierBadgeClasses =
                TIER_BADGE_CLASSES[school.tier] || "bg-gray-100 text-gray-800";
              return (
                <BulletRow key={index} markerClassName="border-[#2758E7]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Inter'] text-base text-[#2758E7]">{school.name}</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${tierBadgeClasses}`}
                    >
                      {TIER_BADGE_LABELS[school.tier] || school.tier}
                    </span>
                  </div>
                  <p className="font-['Inter'] text-base text-[#272728] mt-1">{school.reasoning}</p>
                </BulletRow>
              );
            })}
          </div>
        </div>

        {/* Card 3: Gaps */}
        {hasGaps && (
          <div className="rounded-2xl p-3 shadow-[0_2px_4px_rgba(26,22,37,0.08)] bg-[#E4DCFC]">
            <div className="flex items-center gap-3 mb-2">
              <CardIcon src={iconGaps} emoji="🎯" />
              <h3 className="font-['Inter'] font-semibold text-[18px] leading-[20px] text-[#272728]">
                Gaps to Address
              </h3>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {gaps.map((gap, index) => (
                <BulletRow key={index} markerClassName="border-[#4C2FB8]">
                  <p className="font-['Inter'] text-base text-[#4C2FB8]">{gap.type}</p>
                  <p className="font-['Inter'] text-base text-[#272728] mt-1">{gap.description}</p>
                </BulletRow>
              ))}
            </div>
          </div>
        )}

        {/* Card 4: What to Do Next */}
        <div className="rounded-2xl p-3 shadow-[0_2px_4px_rgba(26,22,37,0.08)] bg-[#F8F0E0]">
          <div className="flex items-center gap-3 mb-2">
            <CardIcon src={iconWhatNext} emoji="📋" />
            <h3 className="font-['Inter'] font-semibold text-[18px] leading-[20px] text-[#272728]">
              What to Do Next
            </h3>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {recommendations.map((item, index) => {
              const { lead, rest } = splitLeadIn(item);
              return (
                <BulletRow key={index} markerClassName="border-[#BA700C]">
                  <p className="font-['Inter'] text-base">
                    {lead ? (
                      <>
                        <span className="text-[#BA700C]">{lead}</span>
                        {rest && <span className="text-[#272728]"> {rest}</span>}
                      </>
                    ) : (
                      <span className="text-[#272728]">{item}</span>
                    )}
                  </p>
                </BulletRow>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scout closing bubble */}
      {next_step_outline && (
        <div className="flex items-center gap-4 mt-6">
          <AvatarImage src={scoutGreeting} alt="Scout" />
          <div className="bg-white border border-[#7B5CF0] rounded-xl shadow-sm p-3">
            <p className="text-sm text-[#454545]">{next_step_outline}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ResultCards;
