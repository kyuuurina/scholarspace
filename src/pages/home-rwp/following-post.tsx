/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

//This page should be displayed when user click Home Page
//atm, it appears on localhost:3000/home-rwp/index

//utils
import { useRouterId } from "~/utils/routerId";
import React from "react";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components

import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import PrimaryButton from "~/components/button/PrimaryButton";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Link from "next/link";
import { ResearchPostCard } from "~/components/draft/ResearchPostCard";
import PostCard from "~/components/research-post/PostCard";
//import { NewPostModal } from "~/components/draft/NewPostModal";
import UserProfileCard from "~/components/draft/UserRecCards";
import NewPostForm from "~/components/draft/NewPostForm";
import Modal from "~/components/modal/Modal";


const FollowingPostPage: NextPageWithLayout = () => {
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ];

  const posts = [
    {
      title: "Post 1",
      author: "John Doe",
      description: "This is the first post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 26, 2023",
    },
    {
      title: "Post 2",
      author: "Jane Doe",
      description: "This is the second post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 27, 2023",
    },
  ];

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      {/* <h1 className="mb-4 text-3xl font-bold">Research Posts</h1> */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AllFollowingTabs />
          <div className="mt-6">
            {/* Render post cards here */}
            {posts.map((post, index) => (
              <PostCard
                key={index}
                title={post.title}
                author={post.author}
                description={post.description}
                timestamp={post.timestamp}
              />
            ))}
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
