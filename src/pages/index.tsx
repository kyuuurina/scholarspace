// id.tsx
import type { ReactElement } from "react";
import React, { useState } from "react";
import Head from "~/components/layout/Head";
import { useUser } from "@supabase/auth-helpers-react";
import { setCookie } from "cookies-next";
import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";
import router, { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

// research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import Post from "~/components/research-post/Post";
import { useFetchPostRecommendations } from "~/utils/researchpost";

// profile components
import ProfileRecommendation from "~/components/profile/ProfileRecommendation";
import { useFetchRecommendedProfiles } from "~/utils/profile";

// search components
import SearchBaq from "~/components/search/SearchBaq";

//pages
import ErrorPage from "~/pages/error-page";

const Page: NextPageWithLayout = () => {
  const user = useUser();
  // setCookie("UserID", user?.id);
  const router = useRouter();

  const userId = useRouterId();

  //get user
  const User = api.user.getByUserId.useQuery({
    id: userId,
  });

  console.log("User Display:", user);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // query key for refetch
  const postQueryKey = ["getPost", currentPostId]; // Assuming have a valid post ID
  const { data: updatedPostData, refetch: refetchPost } = useQuery(
    postQueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  // Research post recommendation
  const {
    postRecommendations,
    isLoadingPostRecommendations,
    errorPostRecommendations,
  } = useFetchPostRecommendations();

  // Profile recommendation
  const {
    recommendedProfiles,
    isLoadingRecommendedProfiles,
    errorRecommendedProfiles,
  } = useFetchRecommendedProfiles(user?.id);

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleSearch = (results: string[]) => {
    setSearchResults(results);

    // Redirect to the search results page
    void (async () => {
      // Redirect to the search results page
      await router.push({
        pathname: "/search",
        query: { results: JSON.stringify(results) },
      });
    })();
  };

  if (errorPostRecommendations) {
    return <div>Error fetching post recommendations</div>;
  }

if (errorRecommendedProfiles) {
  return <div>Error fetching recommended profiles</div>;
}


  // Render EditPostForm component
  const handleEditClick = (postId: string) => {
    setEditModalOpen(true);
    setCurrentPostId(postId);
  };

  if (isLoadingPostRecommendations) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="mx-auto grid grid-cols-12 gap-6">
        {/* All Following Tabs (2/3 width) */}
        <div className="col-span-9">
          <SearchBaq />
          <div className="mb-4"></div>
          <AllFollowingTabs />

          <div className="mt-6">
            {errorPostRecommendations ? (
              <p className="text-lg font-medium text-gray-500 text-center mt-8">
                Error Fetching Post Recommendations
              </p>
            ) : (
              postRecommendations.map((post) => (
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
        <div className="sticky top-0 col-span-3">
          <section className="mt-4 rounded border p-4">
            <h2 className="mb-4 text-xl font-bold">Suggested Profiles</h2>
            {isLoadingRecommendedProfiles ? (
              <p>Loading recommended profiles...</p>
            ) : errorRecommendedProfiles ? (
              <p>Error fetching recommended profiles</p>
            ) : (
              <ul className="list-inside list-none space-y-4">
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

console.log("Profile Recommendation:", ProfileRecommendation);

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Main Page" />
      <Layout>{page}</Layout>
    </>
  );
};

export default Page;
