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
import LoadingSpinner from "~/components/LoadingSpinner";
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import PrimaryButton from "~/components/button/PrimaryButton";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";
import { ResearchPostCard } from "~/components/research-post/ResearchPostCard";
import PostCard from "~/components/draft/PostCard";
import { NewPostModal } from "~/components/draft/NewPostModal";
import UserProfileCard from "~/components/draft/UserRecCards";



const ResearchPostsPage: NextPageWithLayout = () => {

  const users = [
    {id:1 , name: "John Doe"},
    {id:2 , name: "Jane Doe"},
  ]
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Research Posts</h1>
      <div className="grid grid-cols-3 gap-4"> {/* Split into 3 columns */}
        <div className="col-span-2">
          <AllFollowingTabs /> {/* Takes up 2/3 of the width */}
        </div>
        <div className="col-span-1">
          <UserProfileCard users={users} /> {/* Takes up 1/3 of the width */}
        </div>
      </div>
    </div>
  );
};


// export ScholarSpace Layout
ResearchPostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Home Page" />
      {page}
    </Layout>
  );
}
export default ResearchPostsPage;