import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Head from "next/head";
import { api } from "~/utils/api";
import { Modal } from "~/components/Modal";
import PostCard from "~/components/PostCard";

interface FormData {
  title: string;
  author: string;
  description: string;
  file: FileList;
}

const ManageRWP = () => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<FormData[]>([]); // Array to store the posts
  const { handleSubmit, register, reset } = useForm<FormData>();
  const router = useRouter();

  const handleSave = (data: FormData) => {
    // Logic to save the form data
    console.log(data);
    setPosts((prevPosts) => [...prevPosts, data]); // Add the new post to the posts array
    setShowModal(false);
    reset(); // Reset the form after submission
  };

  const handleCancel = () => {
    setShowModal(false);
    reset(); // Reset the form on cancellation
  };

  const handleAddNewPost = () => {
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Manage RWP</title>
      </Head>
      <div>
        <h1>Manage RWP</h1>
        <button onClick={handleAddNewPost}>Add New Post</button>
      </div>

      {posts.map((post, index) => (
        <PostCard
          key={index}
          title={post.title}
          author={post.author}
          description={post.description}
        />
      ))}

      {showModal && (
        <Modal show={showModal} onClose={handleCancel}>
          <form onSubmit={handleSubmit(handleSave)}>
            <h2>Add New Post</h2>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" {...register("title")} />

            <label htmlFor="author">Author:</label>
            <input type="text" id="author" {...register("author")} />

            <label htmlFor="description">Description:</label>
            <textarea id="description" {...register("description")} />

            <label htmlFor="file">Upload File:</label>
            <input type="file" id="file" {...register("file")} />

            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ManageRWP;
