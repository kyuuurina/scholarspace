// //Query all post created by user, if null, display "You have not created any post yet"

// import React from 'react';
// import {useEffect, useState} from 'react';
// import {api} from "~/utils/api";
// import Image from 'next/image';
// import Link from 'next/link';

// //utils
// import { useRouterId } from "~/utils/routerId";
// import { useFetchProfile } from "~/utils/profile";

// // types
// import type { ReactElement } from "react";
// import type { NextPageWithLayout } from "~/pages/_app";

// import ErrorPage from "~/pages/error-page";
// //local components
// import Layout from "~/components/layout/Layout";
// import PageLoader from "~/components/layout/PageLoader";
// import LoadingSpinner from "~/components/LoadingSpinner";
// import PrimaryButton from "~/components/button/PrimaryButton";
// import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
// import { FaEdit } from 'react-icons/fa';

// //profile components
// import ProfileTabs from '~/components/profile/ProfileTabs';
// import Head from 'next/head';

// import { useRouter } from 'next/router';
// import { useFetchResearchPost } from '~/utils/researchpost';
// import { useFetchLikedPost } from '~/utils/postlike';
// import { FaExclamationCircle } from 'react-icons/fa';
// import Post from '~/components/research-post/Post';


// const LikedPost: NextPageWithLayout = () => {
//   const likedPostLists = useFetchLikedPost();
//   const router = useRouter();
//   const [likedPostsDetails, setLikedPostDetails] = useState([]);

//   const fetchLikedPostsDetails = async () => {
//     if (likedPostLists.myLikedPosts.length > 0) {
//       const likedPostsDetailsArray = await Promise.all(
//         likedPostLists.myLikedPosts.map(async (likedPost) => {
//           // Fetch research post details for each liked post
//           const researchPostDetails = await useFetchResearchPost(likedPost.post_id);
//           return { ...likedPost, researchPostDetails };
//         })
//       );
//       setLikedPostsDetails(likedPostsDetailsArray);
//     }
//   };

//   useEffect(() => {
//     fetchLikedPostsDetails();
//   }, [likedPostLists.myLikedPosts]);  

//   console.log("MyPost.tsx page router:", router)
//   console.log("MyPost.tsx page likedPostLists:", likedPostLists)

//   return (
//     <>
//     <Head>
//         <title>Liked Posts</title>
//     </Head>
//     <ProfileTabs />
//       <div className="container mx-auto mt-8">
//           {likedPostLists.isLoading && <LoadingSpinner />}
//           {likedPostLists.error && (
//               <div className="flex flex-col items-center justify-center h-50vh">
//                   <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
//                   <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
//                       Oops! Something went wrong.
//                   </p>
//               </div>
//           )}

//         {/* if liked post exist */}
//           {likedPostLists.myLikedPosts.length > 0 ? (
//               <ul className="grid grid-cols-1 gap-8">
//                   {likedPostLists.myLikedPosts.map((post_likes) => (
//                       <li key={post_likes.post_id} className="mb-8">
//                           {/* Render your liked post component here */}
//                           {/* <Post post_likes = {post_likes} /> */}
//                       </li>
//                   ))}
//               </ul>
//           ) : (
//               <div className="flex flex-col items-center justify-center h-50vh">
//                   <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
//                   <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
//                       Uh-oh, you havet liked any posts yet.
//                   </p>
//                   <p className="font-medium text-base text-gray-500 leading-1.5 text-center max-w-md">
//                       Explore posts and click the like button to add posts to your liked list.
//                   </p>
//               </div>
//           )}
//       </div>
//       </>
//   );
// };

// LikedPost.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <>
//       <Layout>{page}</Layout>
//     </>
//   );
// };

// export default LikedPost;
