import React, { useState } from "react";

type AchievementCardProps = {
  achievement: {
    achievement_id: string;
    title: string;
    received_year: string; // Corrected property name
    description: string | null;
  };
  isLastItem?: boolean;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isLastItem = false }) => {
  return (
    <div>
      <div className={`mb-4 ${isLastItem ? '' : 'border-b border-gray-300 pb-4'}`}>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Year:</span>{" "}
          {achievement.received_year}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Title:</span> {achievement.title}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Description:</span>{" "}
          {achievement.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
