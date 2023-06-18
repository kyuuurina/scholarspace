import { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { NewPostModal } from "~/components/NewPostModal";
import PostCard from "~/components/PostCard";
import { useForm } from "react-hook-form";

// next hook
import { useRouter } from "next/router";

interface FormData {
  title: string;
  author: string;
  description: string;
  file: FileList;
}

const ManageRWP: NextPage = () => {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [posts, setPosts] = useState<FormData[]>([]);
  const { handleSubmit, register, reset } = useForm<FormData>();
  const router = useRouter();

  const handleSave = async (data: FormData) => {
    // Logic to save the form data
    console.log(data);
    setPosts((prevPosts) => [...prevPosts, data]);
    setShowNewPostModal(false);
    reset();

    try {
      // Add the code here to send the data to your API and create the post
      // await yourCreatePostAPI(data);

      // Display a successful message (you can customize this according to your needs)
      alert("Post created successfully!");
    } catch (error) {
      // Handle any error that occurred during the post creation
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Display a confirmation message before canceling
    const confirmCancel = window.confirm("Cancel Post?");

    if (confirmCancel) {
      setShowNewPostModal(false);
      reset();
    }
  };

  const handleEdit = () => {
    // Implement the logic to edit a post
    console.log("Edit post");
  };

  const handleDelete = () => {
    // Display a confirmation message before deleting
    const confirmDelete = window.confirm("Delete this post?");

    if (confirmDelete) {
      // Implement the logic to delete a post
      console.log("Delete post");
    }
  };

  const handleAddNewPost = () => {
    setShowNewPostModal(true);
  };

  return (
    <>
      <Head>
        <title>Manage RWP</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-4">
          <button
            className="w-full rounded-lg bg-darkviolet-900 border border-darkviolet-900 px-5 py-2.5 text-sm font-medium text-white-500 hover:bg-lightpurple-500 hover:border-lightpurple-900 hover:text-darkviolet focus:outline-none focus:ring-4 focus:ring-darkviolet-900"
            onClick={handleAddNewPost}
          >
            Add New Post
          </button>
        </div>

        <div>
          {posts.map((post, index) => (
           <PostCard
           key={index}
           title={post.title}
           author={post.author}
           description={post.description}
            onEdit={handleEdit}
           onDelete={handleDelete}
         />
          ))}
        </div>

        {showNewPostModal && (
          <NewPostModal show={showNewPostModal} onClose={handleCancel}>
            <form onSubmit={handleSubmit(handleSave)}>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" {...register("title")} />

              <label htmlFor="author">Author:</label>
              <input type="text" id="author" {...register("author")} />

              <label htmlFor="description">Description:</label>
              <textarea id="description" {...register("description")} />

              <label htmlFor="file">File:</label>
              <input type="file" id="file" {...register("file")} />

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </NewPostModal>
        )}
      </div>
    </>
  );
};

export default ManageRWP;
