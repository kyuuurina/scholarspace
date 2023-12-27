/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */


//auth
import { getCookie } from "cookies-next";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";

//utils
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

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
import PostCard from "~/components/research-post/PostCard";
import { ResearchPostCard } from "~/components/draft/ResearchPostCard";
import UserProfileCard from "~/components/research-post/UserRecCards";
import AddNewPostButton from "~/components/research-post/AddNewPostButton";
import TestModal from "~/components/research-post/AddNewPostModal";



const FollowingPostPage: NextPageWithLayout = () => {
  const users = [
    { id: 1, name: "Ahmad Osama" },
    { id: 2, name: "Hasbullah " },
  ];

    // Customize the limit and cursor as needed
    // const { followingResearchPosts, isLoading, error } = useFetchFollowingResearchPosts();
    // if (isLoading) {
    //     return <p>Loading...</p>;
    // }

    // if (error) {
    //     return <p>Error: {error.message}</p>;
    // }


    const FollowingPostLists = useFetchFollowingResearchPosts();
    const router = useRouter();

  // Check if followingResearchPosts is an array
  if (!Array.isArray(FollowingPostLists.followingResearchPosts)) {
    // Handle the case where it's not an array (you can log an error, show a message, etc.)
    console.error("Following research posts data is not an array:", FollowingPostLists.followingResearchPosts);
    return <p>Error: Unable to fetch research posts</p>;
  }


  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
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
                  <Post post={post} />
                </li>
              ))
            )}
          </div>
        </div>
        <div className="col-span-1">
          <UserProfileCard users={users} />
        </div>
      </div>
    </div>
  );
};

FollowingPostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Home Page" />
      {page}
    </Layout>
  );
};

export default FollowingPostPage;
