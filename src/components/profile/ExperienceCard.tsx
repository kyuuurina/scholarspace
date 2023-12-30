import React, { useState } from "react";

type ExperienceCardProps = {
  experience: {
    experience_id: string;
    title: string;
    start_year: string;
    end_year: string;
    description: string | null;
  };
  isLastItem?: boolean; // New prop to indicate if it's the last item
};

const EducationCard: React.FC<ExperienceCardProps> = ({ experience, isLastItem = false }) => {
  return (
    <div>
      <div className={`mb-4 ${isLastItem ? '' : 'border-b border-gray-300 pb-4'}`}>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Year:</span>{" "}
          {`${experience.start_year} - ${experience.end_year}`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Title:</span> {experience.title}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Description:</span>{" "}
          {experience.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default EducationCard;