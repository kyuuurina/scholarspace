import React, { useState } from 'react';
import Select from 'react-select'

const ProfilePage = () => {
const [profilePicture, setProfilePicture] = useState<string | undefined>('');
const [username, setUsername] = useState<string | undefined>('');
const [collaborationStatus, setCollaborationStatus] = useState<string | undefined>('');
const [aboutMe, setAboutMe] = useState<string | undefined>('');
const [skills, setSkills] = useState<string[]>([]);
const [education, setEducation] = useState<{ year: string; place: string }[]>([]);
const [achievements, setAchievements] = useState<{ year: string; name: string; issuer: string }[]>([]);
const [researchInterests, setResearchInterests] = useState<string[]>([]);
const [researchHistory, setResearchHistory] = useState<{ year: string; title: string; author: string }[]>([]);
const [isEditing, setIsEditing] = useState(false);

  
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setProfilePicture(file.name);
    }
  };

    const handleSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSkills((prevSkills) => [...prevSkills, value]);
  };

  const handleEducationChange = (index: number, field: 'year' | 'place', value: string) => {
    setEducation((prevEducation) =>
      prevEducation.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  const handleAchievementChange = (index: number, field: 'year' | 'name' | 'issuer', value: string) => {
    setAchievements((prevAchievements) =>
      prevAchievements.map((achievement, i) => (i === index ? { ...achievement, [field]: value } : achievement))
    );
  };

  const handleResearchHistoryChange = (index: number, field: 'year' | 'title' | 'author', value: string) => {
    setResearchHistory((prevResearchHistory) =>
      prevResearchHistory.map((history, i) => (i === index ? { ...history, [field]: value } : history))
    );
  };

  const handleSaveChanges = () => {
    // Handle saving changes here
    setIsEditing(false);
  };

  const handleCancelChanges = () => {
    // Reset the state to cancel changes
    setIsEditing(false);
    // Reset all the fields to their initial values
    setProfilePicture('');
    setUsername('');
    setCollaborationStatus('');
    setAboutMe('');
    setSkills([]);
    setEducation([]);
    setAchievements([]);
    setResearchInterests([]);
    setResearchHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="max-w-lg">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="profilePicture" className="block mb-2 font-bold text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              onChange={handleProfilePictureChange}
              className="border-gray-300 rounded-md px-4 py-2 w-64"
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
              onChange={(event) => setUsername(event.target.value)}
              className="border-gray-300 rounded-md px-4 py-2 w-64"
              disabled={!isEditing}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="collaborationStatus" className="block mb-2 font-bold text-gray-700">
              Collaboration Status
            </label>
            <input
              type="text"
              id="collaborationStatus"
              value={collaborationStatus}
              onChange={(event) => setCollaborationStatus(event.target.value)}
              className="border-gray-300 rounded-md px-4 py-2 w-64"
              disabled={!isEditing}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="aboutMe" className="block mb-2 font-bold text-gray-700">
              About Me
            </label>
            <textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(event) => setAboutMe(event.target.value)}
              className="border-gray-300 rounded-md px-4 py-2 w-64 h-32"
              disabled={!isEditing}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Skills</label>
            <div className="flex space-x-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
            {isEditing && (
              <input
                type="text"
                placeholder="Add skill"
                onChange={handleSkillChange}
                className="border-gray-300 rounded-md px-4 py-2 w-64 mt-2"
              />
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Education</label>
            {education.map((edu, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(event) => handleEducationChange(index, 'year', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-24"
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  placeholder="Instituition Name"
                  value={edu.place}
                  onChange={(event) => handleEducationChange(index, 'place', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-64"
                  disabled={!isEditing}
                />
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => setEducation([...education, { year: '', place: '' }])}
                className="text-blue-500 underline"
              >
                + Add Education
              </button>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Achievements</label>
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Year"
                  value={achievement.year}
                  onChange={(event) => handleAchievementChange(index, 'year', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-24"
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  placeholder="Achievement Name"
                  value={achievement.name}
                  onChange={(event) => handleAchievementChange(index, 'name', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-64"
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={achievement.issuer}
                  onChange={(event) => handleAchievementChange(index, 'issuer', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-64"
                  disabled={!isEditing}
                />
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => setAchievements([...achievements, { year: '', name: '', issuer: '' }])}
                className="text-blue-500 underline"
              >
                + Add Achievement
              </button>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Research Interests</label>
            <div className="flex space-x-2">
              {researchInterests.map((interest, index) => (
                <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
            {isEditing && (
              <input
                type="text"
                placeholder="Add research interest"
                onChange={(event) => setResearchInterests([...researchInterests, event.target.value])}
                className="border-gray-300 rounded-md px-4 py-2 w-64 mt-2"
              />
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold text-gray-700">Research History</label>
            {researchHistory.map((history, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Year"
                  value={history.year}
                  onChange={(event) => handleResearchHistoryChange(index, 'year', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-24"
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  placeholder="Research Title"
                  value={history.title}
                  onChange={(event) => handleResearchHistoryChange(index, 'title', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-64"
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={history.author}
                  onChange={(event) => handleResearchHistoryChange(index, 'author', event.target.value)}
                  className="border-gray-300 rounded-md px-4 py-2 w-64"
                  disabled={!isEditing}
                />
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => setResearchHistory([...researchHistory, { year: '', title: '', author: '' }])}
                className="text-blue-500 underline"
              >
                + Add Research History
              </button>
            )}
          </div>

          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
              Edit Profile
            </button>
          )}

          {isEditing && (
            <>
              <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                Save
              </button>
              <button onClick={handleCancelChanges} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
