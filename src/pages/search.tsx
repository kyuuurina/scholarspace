//auth
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

// search.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Post from '~/components/research-post/Post';
import MiniUserCard from "~/components/profile/MiniUserCard";
import { useFetchCombinedSearchResults } from "~/utils/search";
import BackButton from '~/components/search/BackButton';
import { useQuery } from "@tanstack/react-query";
import { FiUser, FiFileText } from 'react-icons/fi';

//layout
import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";
import Head from "~/components/layout/Head";
import type { ReactElement } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";

interface Post {
  post_id: string;
  user_id: string;
  category: string;
  title: string;
  document: string | null;
  author: string | null;
  description: string | null;
  created_at: Date;
}

interface OtherUser {
  profile_id: string;
  name: string;
  collab_status: string;
  avatar_url: string | null;
}

const SearchPage: NextPageWithLayout = () => {
  const [isProfileSectionOpen, setIsProfileSectionOpen] = useState(true);
  const [isPostSectionOpen, setIsPostSectionOpen] = useState(true);

  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const query = router.query.query as string;

  // Call the hook directly within the component body
  const { combinedResults, isLoading, error } = useFetchCombinedSearchResults(query);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // query key for refetch
  const postQueryKey = ['getPost', currentPostId]; // Assuming have a valid post ID
  const { data: updatedPostData, refetch: refetchPost } = useQuery(
    postQueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  // Render EditPostForm component
  const handleEditClick = (postId: string) => {
    setEditModalOpen(true);
    setCurrentPostId(postId);
  };

  useEffect(() => {
    // Fetch search results when the query changes
    // Avoid calling useFetchSearchResults here
  }, [query]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-screen-xl p-8">
      <BackButton> Go Back</BackButton>
      <div className="mb-4"></div>

      {/* Search Results Section */}
      <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{query}&quot;</h1>
      {error && <p>Error fetching search results</p>}

      {combinedResults.length === 0 && !isLoading && !error && (
        <p>No matching results found.</p>
      )}

      {/* Toggles Section */}
      <div className="mb-4 flex items-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className={`rounded-md p-2 cursor-pointer ${isProfileSectionOpen ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isProfileSectionOpen}
                onChange={() => setIsProfileSectionOpen(!isProfileSectionOpen)}
                className="cursor-pointer"
              />
              <span className={`text-lg ${isProfileSectionOpen ? 'text-purple-800' : 'text-gray-500'}`}>
                <FiUser size={20} />
              </span>
              <span className={`ml-2 ${isProfileSectionOpen ? 'text-purple-800' : 'text-gray-500'}`}>Profile</span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`rounded-md p-2 cursor-pointer ${isPostSectionOpen ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPostSectionOpen}
                onChange={() => setIsPostSectionOpen(!isPostSectionOpen)}
                className="cursor-pointer"
              />
              <span className={`text-lg ${isPostSectionOpen ? 'text-purple-800' : 'text-gray-500'}`}>
                <FiFileText size={20} />
              </span>
              <span className={`ml-2 ${isPostSectionOpen ? 'text-purple-800' : 'text-gray-500'}`}>Post</span>
            </label>
          </div>
        </div>
      </div>

      {combinedResults.map((result, index) => (
        <div key={index} className={`mb-12 ${index !== combinedResults.length - 1 ? 'mb-12' : ''}`}>
          {result.type === 'post' && isPostSectionOpen && (
            <Post
              post={result.data as Post}
              onEditClick={() => handleEditClick((result.data as Post).post_id)}
              refetch={refetchPost}
            />
          )}
          {result.type === 'profile' && isProfileSectionOpen && (
            <MiniUserCard otherUser={result.data as OtherUser} />
          )}
        </div>
      ))}
    </div>
  );
};

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Search Results" />
      <Layout>{page}</Layout>
    </>
  );
};

export default SearchPage;
