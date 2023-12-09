import React from 'react';
import { useFetchMyResearchPosts } from '~/utils/researchpost';

import { useState } from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from '~/utils/routerId';

// types
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '~/pages/_app';

import ErrorPage from '~/pages/error-page';
//local components
import Layout from '~/components/layout/Layout';
import PageLoader from '~/components/layout/PageLoader';
import LoadingSpinner from '~/components/LoadingSpinner';
import { FaEdit, FaExclamationCircle } from 'react-icons/fa';

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import Post from '~/components/research-post/Post';
import Head from 'next/head';

const MyPost: NextPageWithLayout = () => {
  const myPostLists = useFetchMyResearchPosts();
  const router = useRouterId();

  console.log("MyPost.tsx page router:", router)

  return (
    <>
      <Head>
        <title>Your Posts</title>
      </Head>
      <ProfileTabs />

      <div className="container mx-auto mt-8">
        {myPostLists.isLoading && <LoadingSpinner />}
        {myPostLists.error && (
          <div className="flex flex-col items-center justify-center h-50vh">
            <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
            <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
              Oops! Something went wrong.
            </p>
          </div>
        )}

        {/* if post exist */}
        {myPostLists.myResearchPosts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8">
            {myPostLists.myResearchPosts.map((post) => (
              <li key={post.post_id} className="mb-8">
                <Post post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-50vh">
            <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
            <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
              Uh-oh, you havent created any posts yet.
            </p>
            <p className="font-medium text-base text-gray-500 leading-1.5 text-center max-w-md">
              Navigate to the Home Page to add a new post and share your research!
            </p>
          </div>
        )}
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


{/* <div>
{myPostLists.myResearchPosts.length > 0 && (
  <ul>
    {myPostLists.myResearchPosts.map((post) => (
      <li key={post.post_id}>
        <h2 style={{ fontWeight: '600', fontSize: '28px', marginBottom: '8px' }}>{post.title}</h2>
        <p style={{ fontWeight: '500', fontSize: '18px', lineHeight: '1.5', marginBottom: '16px' }}>
          {post.description}
        </p>
        {/* Add more fields as needed */}
//       </li>
//     ))}
//   </ul>
// )}
// </div> */}