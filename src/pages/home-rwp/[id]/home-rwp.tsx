import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResearchPost {
  id: string;
  title: string;
  description: string;
  author: string;
  document: string;
}

const ResearchPostsPage = () => {
  const [researchPosts, setResearchPosts] = useState<ResearchPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ResearchPost>();

  const handleAddPost = (data: ResearchPost) => {
    const newPost: ResearchPost = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      author: data.author,
      document: data.document,
    };
    setResearchPosts([...researchPosts, newPost]);
    setIsModalOpen(false);
    reset();
  };

  const handleDeletePost = (id: string) => {
    const updatedPosts = researchPosts.filter((post) => post.id !== id);
    setResearchPosts(updatedPosts);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Research Posts</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Post
      </button>

      {researchPosts.length === 0 ? (
        <p>No research posts available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {researchPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-500 mb-2">{post.description}</p>
              <p className="text-gray-500 mb-2">Author: {post.author}</p>
              <p className="text-gray-500 mb-2">Document: {post.document}</p>

              <div className="flex justify-end">
                <button
                  className="text-red-500"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white ml-2"
                  // Add logic to view more details of the post
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 w-1/2 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
            <form onSubmit={handleSubmit(handleAddPost)}>
              <div className="mb-4">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  className="border border-gray-300 px-4 py-2 w-full rounded"
                  {...register('title', { required: true })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  className="border border-gray-300 px-4 py-2 w-full rounded"
                  {...register('description', { required: true })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  id="author"
                  className="border border-gray-300 px-4 py-2 w-full rounded"
                  {...register('author', { required: true })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="document">Upload File:</label>
                <input
                  type="file"
                  id="document"
                  className="border border-gray-300 px-4 py-2 w-full rounded"
                  {...register('document', { required: true })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPostsPage;
