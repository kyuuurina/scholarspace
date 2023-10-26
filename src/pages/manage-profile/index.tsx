import React, { useState } from 'react';
// utils
import { useRouterId } from "~/utils/routerId";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import Card from "~/components/Card";
import Header from "~/components/workspace/Header";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Link from "next/link";

const ProfilePage: NextPageWithLayout = () => {
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>('');
  const [username, setUsername] = useState('');
  const [collaborationStatus, setCollaborationStatus] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [education, setEducation] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [researchInterests, setResearchInterests] = useState<string[]>([]);
  const [researchHistory, setResearchHistory] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      if (value) {
        setSkills((prevSkills) => [...prevSkills, value]);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleResearchInterestChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      if (value) {
        setResearchInterests((prevInterest) => [...prevInterest, value]);
        (e.target as HTMLInputElement).value = '';
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
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 flex-shrink-0">
              <img src={profilePicture as string} alt="Profile" className="rounded-full w-full h-full" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{username}</h2>
              <div className="flex mt-2">
              <span className="mr-2 text-gray-700" style={{ fontWeight: "bold" }}>1.1K Followers | </span>
              <span className="mr-2 text-gray-700" style={{ fontWeight: "bold" }}>250 Following</span>

              </div>
            </div>
          </div>
          <hr className="mb-6" />
          <div className="mb-6">
  <label htmlFor="profilePicture" className="block mb-2 font-bold text-gray-700">
  </label>
  {isEditing && (
    <input
      type="file"
      id="profilePicture"
      onChange={handleProfilePictureChange}
      className="border-gray-300 rounded-md px-4 py-2 w-full"
    />
  )}
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
              disabled={!isEditing}
              className="border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="collaborationStatus" className="block mb-2 font-bold text-gray-700">
              Collaboration Status
            </label>
            <select
              id="collaborationStatus"
              value={collaborationStatus}
              onChange={(e) => setCollaborationStatus(e.target.value)}
              disabled={!isEditing}
              className="border-gray-300 rounded-md px-4 py-2 w-full"
            >
              <option value="">Select collaboration status</option>
              <option value="Open For Collaboration">Open For Collaboration</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="aboutMe" className="block mb-2 font-bold text-gray-700">
              About Me
            </label>
            <textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              disabled={!isEditing}
              className="border-gray-300 rounded-md px-4 py-2 w-full"
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="skills" className="block mb-2 font-bold text-gray-700">
              Skills
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="skills"
                placeholder="Add Your Skills"
                onKeyDown={handleSkillChange}
                disabled={!isEditing}
                className="border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <ul className="ml-2">
                {skills.map((skill, index) => (
                  <li key={index} className="mb-2">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="researchInterest" className="block mb-2 font-bold text-gray-700">
              Research Interests
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="skills"
                placeholder="Add Your Research Interests"
                onKeyDown={handleResearchInterestChange}
                disabled={!isEditing}
                className="border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <ul className="ml-2">
                {skills.map((skill, index) => (
                  <li key={index} className="mb-2">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
         
          {/* Render other profile fields (e.g., education, achievements, research) */}
          {/* ... */}
          <div className="flex justify-end">
            {!isEditing && (
              <button
              onClick={handleEdit}
              className="rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none"
            >
              Edit
            </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelChanges}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export ScholarSpace Layout
ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Profile" />
      {page}
    </Layout>
  );
}

export default ProfilePage;
