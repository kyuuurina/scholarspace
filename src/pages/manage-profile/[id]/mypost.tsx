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

// types
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '~/pages/_app';

import ErrorPage from '~/pages/error-page';

//local components
import Layout from '~/components/layout/Layout';
import PageLoader from '~/components/layout/PageLoader';
import LoadingSpinner from '~/components/LoadingSpinner';
import { FaEdit, FaExclamationCircle } from 'react-icons/fa';
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import ConfirmationDialog from '~/components/ConfirmationDialog';

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import Post from '~/components/research-post/Post';
import Head from 'next/head';
import EditPostForm from '~/components/research-post/EditPostForm';

import toast from 'react-hot-toast';

const MyPost: NextPageWithLayout = () => {
  const profile_id = useRouterId(); 
  console.log("Front call",profile_id)
  const myPostLists = useFetchMyResearchPosts(profile_id);
  const router = useRouter();
  

  console.log("MyPost.tsx page router:", router)

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); 


//handleDelete
const deleteMyPost = api.researchpost.delete.useMutation({
  onSuccess: () => {
    toast.custom(() => <SuccessToast message="Post successfully deleted" />);
  },
});

  const handleDeleteMyPost = (post_id: string) => {
    deleteMyPost
      .mutateAsync({
        post_id: post_id,
      })
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error("Failed to delete post:", error);

        toast.custom(() => <ErrorToast message="Failed to delete post" />);
      });
  };



  return (
    <>
      <Head>
        <title>Your Posts</title>
      </Head>
      <ProfileTabs />
  
      <div className="container mx-auto mt-8">
        <AddNewPostButton className="mb-4" />
        {/* if loading */}
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
              <li key={post.post_id} className="mb-4">
                {/* Add left and right padding to the Post component */}
                <div className="p-4 rounded-md">
                  <Post post={post} />
                  { true && <>
                    <button onClick={() => handleDeleteMyPost(post.post_id)}>Delete</button>
                    <button onClick={() => { setEditModalOpen(true); setCurrentPostId(post.post_id); }}>Edit</button>
                  </>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-50vh">
            <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
            <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
              Uh-oh, you have not created any posts yet. Create one by clicking on the button above!
            </p>
            <p className="font-medium text-base text-gray-500 leading-1.5 text-center max-w-md">
              Navigate to the Home Page to add a new post and share your research!
            </p>
          </div>
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