/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

//auth
import { getCookie } from "cookies-next";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";

//utils
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// utils
import { useFetchFollowingResearchPosts } from "~/utils/researchpost";
import { api } from "~/utils/api";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import LoadingSpinner from "~/components/LoadingSpinner";
import Link from "next/link";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import Modal from "~/components/modal/Modal";

//research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import Post from "~/components/research-post/Post";
import UserProfileCard from "~/components/research-post/UserRecCards";
import AddNewPostButton from "~/components/research-post/AddNewPostButton";
import TestModal from "~/components/research-post/AddNewPostModal";

//profile recommendation
import { useFetchRecommendedProfiles } from "~/utils/profile";
import ProfileRecommendation from "~/components/profile/ProfileRecommendation";

//search
import SearchBaq from "~/components/search/SearchBaq";


const FollowingPostPage: NextPageWithLayout = () => {

  //fetch user id
    const userId = getCookie("UserID");

    const router = useRouter();
    const FollowingPostLists = useFetchFollowingResearchPosts();

    //
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    // query key for refetch
    const postQueryKey = ['getPost', currentPostId]; // Assuming have a valid post ID
    const { data: updatedPostData, refetch: refetchPost } = useQuery(
      postQueryKey,
      { enabled: false } // Disable automatic fetching on mount
    );

    //profile recommendation
    const {
      recommendedProfiles,
      isLoadingRecommendedProfiles,
      errorRecommendedProfiles,
    } = useFetchRecommendedProfiles();
  
    console.log("Recommended Profiles:", recommendedProfiles);
  
    if (errorRecommendedProfiles) {
      return <div>Error fetching recommended profiles</div>;
    }

  // Check if followingResearchPosts is an array
  if (!Array.isArray(FollowingPostLists.followingResearchPosts)) {
    // Handle the case where it's not an array (you can log an error, show a message, etc.)
    console.error("Following research posts data is not an array:", FollowingPostLists.followingResearchPosts);
    return <p>Error: Unable to fetch research posts</p>;
  }

  
// Render EditPostForm component
const handleEditClick = (postId: string) => {
  setEditModalOpen(true);
  setCurrentPostId(postId);
};


  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="grid grid-cols-12 gap-6 mx-auto">
        {/* All Following Tabs (3/4 width) */}
        <div className="col-span-9">
        <SearchBaq />
          <div className="mb-4"></div>
          <AllFollowingTabs />

          <div className="mt-6">
            {FollowingPostLists.isLoading ? (
              <LoadingSpinner />
            ) : FollowingPostLists.followingResearchPosts.length === 0 ? (
              <p className="text-lg font-medium text-gray-500 text-center mt-8">
                Follow other users to see their research posts!
              </p>
            ) : (
              FollowingPostLists.followingResearchPosts.map((post) => (
                <li key={post.post_id} className="mb-8" style={{ listStyle: 'none' }}>
                <Post
                  post={post}
                  onEditClick={() => handleEditClick(post.post_id)}
                  refetch={refetchPost}
                   />
                </li>
              ))
            )}
          </div>
        </div>
    
        {/* Suggested Profiles (1/4 width, Rightmost column) */}
        <div className="col-span-3 sticky top-0">
          <section className="border rounded p-4 mt-4">
            <h2 className="text-xl font-bold mb-4">Suggested Profiles</h2>
            {isLoadingRecommendedProfiles ? (
              <p>Loading recommended profiles...</p>
            ) : errorRecommendedProfiles ? (
              <p>Error fetching recommended profiles</p>
            ) : (
              <ul className="list-none list-inside space-y-4">
                {recommendedProfiles.map((profile) => (
                  <li key={profile.profile_id}>
                    <ProfileRecommendation profiles={profile} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

FollowingPostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Following" />
      {page}
    </Layout>
  );
};

export default FollowingPostPage;
