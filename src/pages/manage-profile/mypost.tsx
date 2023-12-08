import React from 'react';
import { useFetchMyResearchPosts } from '~/utils/mypost';

import {useState} from 'react';
import {api} from "~/utils/api";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchResearchPost} from '~/utils/researchpost';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

import ErrorPage from "~/pages/error-page";
//local components
import Layout from "~/components/layout/Layout";
import PageLoader from "~/components/layout/PageLoader";
import LoadingSpinner from "~/components/LoadingSpinner";
import { FaEdit } from 'react-icons/fa';

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import Head from 'next/head';

// ... (other imports)

const MyPost: NextPageWithLayout = () => {
  const userResearchPosts = useFetchMyResearchPosts();
  const router = useRouterId();

  return (
    <>
      <Head>
        <title>Your Posts</title>
      </Head>
      <ProfileTabs />

      <div>
        {/* {userResearchPosts.isLoading && <LoadingSpinner />}
        {userResearchPosts.error && <ErrorPage error={userResearchPosts.error.message} />} */}
        {/* {!userResearchPosts.isLoading && !userResearchPosts.error && ( */}
          <div>
            {userResearchPosts.myResearchPosts.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50vh',
                }}
              >
                <p style={{ fontWeight: '600', fontSize: '18px' }}>
                  You have not created any posts yet.
                </p>
              </div>
            ) : (
              <ul>
                {userResearchPosts.myResearchPosts.map((post) => (
                  <li key={post.post_id}>
                    <h2 style={{ fontWeight: '600', fontSize: '24px' }}>{post.title}</h2>
                    <p style={{ fontWeight: '500', fontSize: '16px' }}>{post.description}</p>
                    {/* Add more fields as needed */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        {/* // )} */}
      </div>
    </>
  );
};

MyPost.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default MyPost;
