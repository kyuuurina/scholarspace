import React from 'react';
import { useFetchMyResearchPosts } from '~/utils/researchpost';

import { useState } from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import AddNewPostButton from '~/components/research-post/AddNewPostButton';
import router, { useRouter } from 'next/router';

//utils
import { useRouterId } from '~/utils/routerId';
import { useFetchProfile } from '~/utils/profile';
import { useQuery } from '@tanstack/react-query';

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
import EditPostForm from '~/components/research-post/EditPostForm';


const MyPost: NextPageWithLayout = () => {
  const profile_id = useRouterId();
  console.log("Front call", profile_id);
  const myPostLists = useFetchMyResearchPosts(profile_id);
  const router = useRouter();

  const { name, isLoading } = useFetchProfile(); //To print in head

  console.log("MyPost.tsx page router:", router);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // query key for refetch
  const postQueryKey = ['getPost', currentPostId]; // Assuming have a valid post ID
  const { data: updatedPostData, refetch: refetchPost } = useQuery(
    postQueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  // Render EditPostForm component
  const handleEditClick = (postId: string) => {
    setEditModalOpen(true);
    setCurrentPostId(postId);
  };

  if (myPostLists.isLoading) {
    return <LoadingSpinner />;
  }

  //no posts message
  const noPostsMessage = (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <FaExclamationCircle className="text-gray-500 text-5xl mb-4" /> */}
      <p className="font-semibold text-2xl text-gray-500 leading-1.5 text-center max-w-md">
        Uh-oh, no research posts have been created yet!
      </p>
    </div>
  );

  return (
    <>
      <Head>
        <title>{`${name ?? 'User'}'s Posts`}</title>
      </Head>
      <ProfileTabs />

      <div className="container mx-auto mt-8">
        <AddNewPostButton className="mb-4" />
        {/* if error*/}
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
              <li key={post.post_id} className="mb-4">
                {/* Add left and right padding to the Post component */}
                <div className="p-4 rounded-md">
                  <Post
                    post={post}
                    onEditClick={() => handleEditClick(post.post_id)}
                    refetch={refetchPost}
                  />
                  {/* <Post post={post} /> */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          noPostsMessage
        )}

        {/* Render EditPostForm component */}
        {editModalOpen && (
        <EditPostForm
          openModal={editModalOpen}
          onClick={() => setEditModalOpen(false)}
          postIdToEdit={currentPostId || ''}
        />
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