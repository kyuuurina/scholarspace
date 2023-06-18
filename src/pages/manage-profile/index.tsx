import React, { useState } from 'react';

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [collaborationStatus, setCollaborationStatus] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState<{ yearStart: string; yearEnd: string; institutionName: string }[]>([]);
  const [achievements, setAchievements] = useState<{ year: string; institutionName: string }[]>([]);
  const [researchInterests, setResearchInterests] = useState<string[]>([]);
  const [researchHistory, setResearchHistory] = useState<{ year: string; author: string; title: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      if (value) {
        setSkills((prevSkills) => [...prevSkills, value]);
        e.currentTarget.value = '';
      }
    }
  };

  const handleSaveChanges = () => {
    // Save changes to the database or API
    setIsEditing(false);
  };

  const handleCancelChanges = () => {
    // Revert changes back to the initial state
    setProfilePicture('');
    setUsername('');
    setCollaborationStatus('');
    setAboutMe('');
    setSkills([]);
    setEducation([]);
    setAchievements([]);
    setResearchInterests([]);
    setResearchHistory([]);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="profilePicture" className="block mb-2 font-bold text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              onChange={handleProfilePictureChange}
              className="border-gray-300 rounded-md px-4 py-2 w-72"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 font-bold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-300 rounded-md px-4 py-2 w-full"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="collaborationStatus" className="block mb-2 font-bold text-gray-700">
              Collaboration Status
            </label>
            {isEditing ? (
              <select
                id="collaborationStatus"
                value={collaborationStatus}
                onChange={(e) => setCollaborationStatus(e.target.value)}
                className="border-gray-300 rounded-md px-4 py-2 w-full"
              >
                <option value="">Select an option</option>
                <option value="Open For Collaboration">Open For Collaboration</option>
              </select>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {collaborationStatus}
              </span>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="aboutMe" className="block mb-2 font-bold text-gray-700">
              About Me
            </label>
            <textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="border-gray-300 rounded-md px-4 py-2 w-full"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="skills" className="block mb-2 font-bold text-gray-700">
              Skills
            </label>
            {isEditing ? (
              <div className="flex mb-2">
                <input
                  type="text"
                  id="skills"
                  onKeyUp={(e) => e.key === 'Enter' && handleSkillChange(e)}
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            ) : (
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Add/Edit Achievements */}
          {isEditing ? (
            <>
              <div className="mb-6">
                <label htmlFor="achievementYear" className="block mb-2 font-bold text-gray-700">
                  Achievement Year
                </label>
                <input
                  type="text"
                  id="achievementYear"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="achievementInstitution" className="block mb-2 font-bold text-gray-700">
                  Achievement Institution
                </label>
                <input
                  type="text"
                  id="achievementInstitution"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Achievements</h3>
              {achievements.map((achievement, index) => (
                <p key={index}>
                  {achievement.year} - {achievement.institutionName}
                </p>
              ))}
            </div>
          )}
          {/* Add/Edit Education Background */}
          {isEditing ? (
            <>
              <div className="mb-6">
                <label htmlFor="educationYearStart" className="block mb-2 font-bold text-gray-700">
                  Education Year Start
                </label>
                <input
                  type="text"
                  id="educationYearStart"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="educationYearEnd" className="block mb-2 font-bold text-gray-700">
                  Education Year End
                </label>
                <input
                  type="text"
                  id="educationYearEnd"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="educationInstitution" className="block mb-2 font-bold text-gray-700">
                  Education Institution
                </label>
                <input
                  type="text"
                  id="educationInstitution"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Education Background</h3>
              {education.map((edu, index) => (
                <p key={index}>
                  {edu.yearStart} - {edu.yearEnd} : {edu.institutionName}
                </p>
              ))}
            </div>
          )}
          {/* Add/Edit Research History */}
          {isEditing ? (
            <>
              <div className="mb-6">
                <label htmlFor="researchYear" className="block mb-2 font-bold text-gray-700">
                  Research Year
                </label>
                <input
                  type="text"
                  id="researchYear"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="researchAuthor" className="block mb-2 font-bold text-gray-700">
                  Research Author
                </label>
                <input
                  type="text"
                  id="researchAuthor"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="researchTitle" className="block mb-2 font-bold text-gray-700">
                  Research Title
                </label>
                <input
                  type="text"
                  id="researchTitle"
                  className="border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Research History</h3>
              {researchHistory.map((research, index) => (
                <p key={index}>
                  {research.year} - {research.title} by {research.author}
                </p>
              ))}
            </div>
          )}
          {/* Rest of the code... */}
          {isEditing ? (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCancelChanges}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
