import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { Modal } from "~/components/Modal";
interface Post {
  id: string;
  title: string;
  document: File;
  description: string;
  author: string;
}

const ManageRWP = () => {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const handleNewPostClick = () => {
    setShowForm(true);
  };

  const handlePostSubmit = (data: Post) => {
    const newPost: Post = {
      ...data,
      id: Math.random().toString(),
    };
    setPosts([...posts, newPost]);
    setShowForm(false);
    reset();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setShowForm(false);
    reset();
  };

  const handleDelete = (post: Post) => {
    setConfirmDelete(post);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      setPosts(posts.filter((post) => post.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleNewPostClick}
      >
        New Post
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(handlePostSubmit)}>
          <label>
            Title:
            <input type="text" {...register('title')} />
          </label>
          <label>
            Upload document:
            <input type="file" {...register('document')} />
          </label>
          <label>
            Description:
            <textarea {...register('description')} />
          </label>
          <label>
            Author:
            <input type="text" {...register('author')} />
          </label>
          <button type="submit">Post</button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
      )}

      {posts.map((post) => (
        <div key={post.id} className="bg-gray-100 p-4 mb-4">
          <h3 className="text-lg font-bold">{post.title}</h3>
          <p>{post.description}</p>
          <p>Author: {post.author}</p>
          <div className="flex justify-end">
            <button onClick={() => handleEdit(post)} className="mr-2">
              Edit
            </button>
            <button onClick={() => handleDelete(post)} className="mr-2">
              Delete
            </button>
            {/* Kebab icon */}
          </div>
        </div>
      ))}

      {editingPost && (
        <form onSubmit={handleSubmit(handlePostSubmit)}>
          <label>
            Title:
            <input
              type="text"
              {...register('title')}
              defaultValue={editingPost.title}
            />
          </label>
          <label>
            Upload document:
            <input type="file" {...register('document')} />
          </label>
          <label>
            Description:
            <textarea
              {...register('description')}
              defaultValue={editingPost.description}
            />
          </label>
          <label>
            Author:
            <input
              type="text"
              {...register('author')}
              defaultValue={editingPost.author}
            />
          </label>
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
      )}

      {confirmDelete && (
        <div>
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleConfirmDelete}>Confirm</button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ManageRWP;
