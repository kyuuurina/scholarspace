import type { ReactElement } from "react";
import Head from "~/components/layout/Head";
import { useUser } from "@supabase/auth-helpers-react";
import { setCookie } from "cookies-next";

import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";

import React from "react";

//research post components
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";

//profile recommendation
import { useFetchRecommendedProfiles } from "~/utils/profile";
import ProfileRecommendation from "~/components/profile/ProfileRecommendation";

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

  // const recommendation = useFetchRecommendedProfiles();

  if (errorRecommendedProfiles) {
    return <div>Error fetching recommended profiles</div>;
  }

  return (
    <div className="w-full max-w-screen-xl p-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AllFollowingTabs />
        </div>
        <div className="flex space-x-4">
          {recommendedProfiles.map((profiles) => (
            <li key={profiles.profile_id} className="mb-8">
              <ProfileRecommendation profiles={profiles} />
            </li>
          ))}
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
