/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

//This page should be displayed when user click Home Page
//atm, it appears on localhost:3000/home-rwp

//utils
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Link from "next/link";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Modal from "~/components/modal/Modal";

//research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import PostCard from "~/components/research-post/PostCard";
import { ResearchPostCard } from "~/components/draft/ResearchPostCard";
import UserProfileCard from "~/components/research-post/UserRecCards";
import AddNewPostButton from "~/components/research-post/AddNewPostButton";
import TestModal from "~/components/research-post/AddNewPostModal";
//import { NewPostModal } from "~/components/draft/NewPostModal";
//import NewPostForm from "~/components/draft/NewPostForm";



const FollowingPostPage: NextPageWithLayout = () => {

  const posts = [
    {
      title: "Effects of parental involvement on student behaviour",
      category: "Conference Paper",
      author: "National Institutes of Health",
      description: "This riveting study delves into the intriguing realm of parental involvement and its curious influence on the behavior of young scholars. Join us on an adventure through the labyrinthine corridors of academia as we unravel the enigmatic connection.",
      timestamp: "November 9, 2023",
    },
    {
      title: "Design Patterns in Software Engineering",
      category: "Journal Article",
      author: "Nur Athirah",
      description: "Due to the increasing research information, knowledge production, development of information technology, and its impact on access to knowledge, the taxonomy of knowledge and information is necessary to manage and use them in the development of science",
      timestamp: "October 27, 2023",
    },
    {
      title: "Impact of school funding on student achievement",
      category: "Conference Paper",
      author: "Dr. Isma Zaini",
      description: "This is the second post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 27, 2023",
    },

  ];

  return (
    <>
    <Head title="Following Page" />
    <div className="mx-auto max-w-screen-xl p-8">
      <AddNewPostButton />
      {/* <h1 className="mb-4 text-3xl font-bold">Research Posts</h1> */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AllFollowingTabs />
          <div className="mt-6">
            {/* Render post cards here */}

          </div>
        </div>
        {/* <div className="col-span-1">
          <UserRecCard users={users} />
        </div> */}
      </div>
    </div>
    </>
  );
};

FollowingPostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default FollowingPostPage;
