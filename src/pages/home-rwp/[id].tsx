//This page should be displayed when user click Home Page
//atm, it appears on localhost:3000/home-rwp

//auth
import { getCookie } from "cookies-next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
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
//import { NewPostModal } from "~/components/draft/NewPostModal";
//import NewPostForm from "~/components/draft/NewPostForm";


const ResearchPostsPage: NextPageWithLayout = () => {

    const router = useRouter();
    const user = useUser();
    const supabase = useSupabaseClient();
    const userId = getCookie("User ID");

 //when user is authenticated
  if (user) {
  }

    console.log("User home-rwp:", user);
    console.log("User ID:", userId);

return (
      <div className="w-full max-w-screen-xl p-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AllFollowingTabs />
          </div>
        </div>
      </div>
  )
};

ResearchPostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Home Page" />
      {page}
    </Layout>
  );
};

export default ResearchPostsPage;
