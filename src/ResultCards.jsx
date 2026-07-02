const LEVEL_BADGE_CLASSES = {
  Strong: "bg-green-100 text-green-800",
  Competitive: "bg-yellow-100 text-yellow-800",
  "Needs Work": "bg-orange-100 text-orange-800",
};

const TIER_BADGE_CLASSES = {
  Safety: "bg-blue-100 text-blue-800",
  Target: "bg-green-100 text-green-800",
  Reach: "bg-purple-100 text-purple-800",
};

const TIER_BADGE_LABELS = {
  Safety: "Safe",
};

function ResultCards({ results }) {
  const { candidacy_assessment, school_recommendations, gaps, recommendations } = results;
  const hasGaps = Array.isArray(gaps) && gaps.length > 0;

  const badgeClasses =
    LEVEL_BADGE_CLASSES[candidacy_assessment.level] || "bg-gray-100 text-gray-800";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badgeClasses}`}>
          {candidacy_assessment.level}
        </span>
        <p className="mt-3 text-gray-700">{candidacy_assessment.reasoning}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Schools That Match Your Profile</h3>
        <ul className="space-y-4">
          {school_recommendations.map((school, index) => {
            const tierBadgeClasses =
              TIER_BADGE_CLASSES[school.tier] || "bg-gray-100 text-gray-800";
            return (
              <li key={index}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{school.name}</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${tierBadgeClasses}`}
                  >
                    {TIER_BADGE_LABELS[school.tier] || school.tier}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{school.reasoning}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {hasGaps && (
        <div className="bg-amber-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Gaps to Address</h3>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            {gaps.map((gap, index) => (
              <li key={index}>
                <span className="font-bold">{gap.type}</span>
                <p className="mt-1 ml-4">{gap.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">What to Do Next</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ResultCards;
