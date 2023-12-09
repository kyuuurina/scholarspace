import React from 'react';
import { useFetchMyResearchPosts } from '~/utils/mypost';

import { useState } from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from '~/utils/routerId';
import { useFetchResearchPost } from '~/utils/researchpost';

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
import Head from 'next/head';

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <FaExclamationCircle style={{ fontSize: '48px', color: 'gray' }} />
          <p style={{ fontWeight: '600', fontSize: '20px', marginTop: '16px', color: 'gray', lineHeight: '1.5' }}>
            Uh-oh, you haven&apos;t created any posts yet.
          </p>
          <p style={{ fontWeight: '500', fontSize: '18px', textAlign: 'center', maxWidth: '400px', color: 'gray', lineHeight: '1.5' }}>
            Navigate to the Home Page to add a new post and share your research!
          </p>
        </div>

        <div>
          {userResearchPosts.myResearchPosts.length > 0 && (
            <ul>
              {userResearchPosts.myResearchPosts.map((post) => (
                <li key={post.post_id}>
                  <h2 style={{ fontWeight: '600', fontSize: '28px', marginBottom: '8px' }}>{post.title}</h2>
                  <p style={{ fontWeight: '500', fontSize: '18px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {post.description}
                  </p>
                  {/* Add more fields as needed */}
                </li>
              ))}
            </ul>
          )}
        </div>
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
