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

// research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import Tabs from "~/components/research-post/Tab";

// profile components
import ProfileRecommendation from "~/components/profile/ProfileRecommendation";
import { useFetchRecommendedProfiles } from "~/utils/profile";

// search components
import SearchBar from "~/components/search/SearchBar";
import SearchBaq from "~/components/search/SearchBaq";

const Page: NextPageWithLayout = () => {
  const user = useUser();
  setCookie("UserID", user?.id);
  const router = useRouter();

  const userId= useRouterId();

  //get user
  const User = api.user.get.useQuery({
    id: userId,
  })

  console.log("User Display:", user);

  const {
    recommendedProfiles,
    isLoadingRecommendedProfiles,
    errorRecommendedProfiles,
  } = useFetchRecommendedProfiles();

  console.log("Recommended Profiles:", recommendedProfiles);

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleSearch = (results: string[]) => {
    setSearchResults(results);

    // Redirect to the search results page
    void (async () => {
      // Redirect to the search results page
      await router.push({
        pathname: '/search',
        query: { results: JSON.stringify(results) },
      });
    })();
  };

  if (errorRecommendedProfiles) {
    return <div>Error fetching recommended profiles</div>;
  }

  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="grid grid-cols-12 gap-6 mx-auto">
        {/* All Following Tabs (2/3 width) */}
        <div className="col-span-9">
          <SearchBar onSearch={handleSearch} />
          <SearchBaq />
          <AllFollowingTabs />
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
