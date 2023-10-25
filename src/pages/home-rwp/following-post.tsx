//This page displays all following users' post

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

//components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import AllFollowingTabs from "~/components/research-post/AllFollowingTabs";
import { NewPostModal } from "~/components/draft/NewPostModal";

const FollowingPosts: NextPageWithLayout = () => {
    return (
        <div className="mx-auto max-w-screen-xl p-8">
          <h1 className="mb-4 text-2xl font-bold">Research Posts</h1>
          <div className="grid grid-cols-3 gap-4"> {/* Split into 3 columns */}
            <div className="col-span-2">
              <AllFollowingTabs /> {/* Takes up 2/3 of the width */}
            </div>
            <div>
            </div>
          </div>
        </div>
      );
    };


FollowingPosts.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Following Posts" />
      <Layout>{page}</Layout>
    </>
  );
};

export default FollowingPosts;
