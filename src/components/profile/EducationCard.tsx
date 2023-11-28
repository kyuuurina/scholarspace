// EducationCard.tsx

import React from 'react';

type Education = {
  education_id: string;
  school_name: string;
  start_date: Date;
  end_date: Date;
};

type EducationCardProps = {
  educations: Education[];
};

const EducationCard: React.FC<EducationCardProps> = ({ educations }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Education</div>
        {educations.map((education, index) => (
          <div key={education.education_id}>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              <div className="font-semibold">{education.school_name}</div>
            </div>
            <div className="text-gray-600">
              {`${education.start_date.toLocaleDateString()} - ${education.end_date.toLocaleDateString()}`}
            </div>
            {index < educations.length - 1 && (
              <div className="border-b border-gray-300 my-3"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationCard;
