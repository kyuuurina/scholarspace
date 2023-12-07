//This page should be displayed when user click Home Page
//atm, it appears on localhost:3000/home-rwp

//utils
import React, { ChangeEvent, SetStateAction, useState, useEffect } from "react";
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

//search 
import SearchBar from "~/components/profile/SearchBar";

//research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import PostCard from "~/components/research-post/PostCard";
import { ResearchPostCard } from "~/components/draft/ResearchPostCard";
import UserProfileCard from "~/components/research-post/UserRecCards";
import AddNewPostButton from "~/components/research-post/AddNewPostButton";
import TestModal from "~/components/research-post/AddNewPostModal";
//import { NewPostModal } from "~/components/draft/NewPostModal";
//import NewPostForm from "~/components/draft/NewPostForm";


const ResearchPostsPage: NextPageWithLayout = () => {
  const users = [
    { id: 1, name: "Ahmad Osama" },
    { id: 2, name: "Hasbullah " },
  ];

  const posts = [
    {
      title: "Taxonomy in Design Patterns",
      category: "Conference Paper",
      author: "Dr. Ismail",
      description: "This is the first post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "November 1, 2023",
    },
    {
      title: "Design Patterns in Software Engineering",
      category: "Journal Article",
      author: "Nur Athirah",
      description: "This is the second post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 27, 2023",
    },
    {
      title: "Impact of school funding on student achievement",
      category: "Conference Paper",
      author: "Dr. Isma Zaini",
      description: "This is the second post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 27, 2023",
    },
    {
      title: "The effects of social and emotional learning on student well-being",
      category: "Journal Article",
      author: "Dr. Ismail",
      description: "This is the first post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "October 20, 2023",
    },

  ];
  
    const router = useRouter();
    // Define state for searchQuery
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Handler for search query change
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    };
  
    // Handler for search form submission
    const handleSearchSubmit = () => {
      // Perform the search with the current searchQuery value
      // You may want to navigate to the search results page or update the content based on the searchQuery
      console.log("Search submitted:", searchQuery);
    };

    return (
      <div className="mx-auto max-w-screen-xl p-8">
        <div className="mb-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />
        </div>
        <div className="mb-4">
            <AddNewPostButton />
          </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AllFollowingTabs />
            <div className="mt-6">
              {/* Render post cards here */}
              {posts.map((post, index) => (
                <PostCard
                  key={index}
                  title={post.title}
                  category={post.category}
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

ResearchPostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Home Page" />
      {page}
    </Layout>
  );
};

export default ResearchPostsPage;
