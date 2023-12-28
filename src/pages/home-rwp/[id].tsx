// id.tsx
import type { ReactElement } from "react";
import Head from "~/components/layout/Head";
import { useUser } from "@supabase/auth-helpers-react";
import { setCookie } from "cookies-next";

import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";

import React from "react";

// research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import ProfileRecommendation from "~/components/profile/ProfileRecommendation";
import { useFetchRecommendedProfiles } from "~/utils/profile";

const Page: NextPageWithLayout = () => {
  const user = useUser();
  setCookie("UserID", user?.id);

  console.log("User Display:", user);

  const {
    recommendedProfiles,
    isLoadingRecommendedProfiles,
    errorRecommendedProfiles,
  } = useFetchRecommendedProfiles();

  console.log("Recommended Profiles:", recommendedProfiles);

  if (errorRecommendedProfiles) {
    return <div>Error fetching recommended profiles</div>;
  }

  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="grid grid-cols-12 gap-6 mx-auto">
        {/* All Following Tabs (2/3 width) */}
        <div className="col-span-9">
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
