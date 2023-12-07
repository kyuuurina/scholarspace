//This page should be displayed when user click Home Page
//atm, it appears on localhost:3000/home-rwp

//utils
import { useFetchResearchPost } from "~/utils/researchpost";
import { useRouterId } from "~/utils/routerId";
import { useRouter } from "next/router";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

//react
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// pages
import ErrorPage from "~/pages/error-page";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import PrimaryButton from "~/components/button/PrimaryButton";
import PageLoader from "~/components/layout/PageLoader";
import Link from "next/link";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Modal from "~/components/modal/Modal";

//research post components
import AddNewPostButton from "~/components/research-post/AddNewPostButton";
import AddNewPostModal from "~/components/research-post/AddNewPostModal";
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import PostCard from "~/components/research-post/PostCard";
import { ResearchPostCard } from "~/components/draft/ResearchPostCard";
import UserRecCard from "~/components/research-post/UserRecCards";
import TestModal from "~/components/research-post/AddNewPostModal";
//import { NewPostModal } from "~/components/draft/NewPostModal";
//import NewPostForm from "~/components/draft/NewPostForm";



const Home: NextPageWithLayout = () => {

  const { category,title, author, description, isLoading, isError } = useFetchResearchPost();
  const post_id = useRouterId();
  const [modalIsOpen, setModalIsOpen] = useState(false);


  return (
    <>
    <Head title="Home Page" />
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

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Home;