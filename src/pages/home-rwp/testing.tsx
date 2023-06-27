import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResearchPost {
  id: string;
  title: string;
  description: string;
  author: string;
  document: File;
  comments: string[];
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
      comments: [],
    };
    setResearchPosts([...researchPosts, newPost]);
    setIsModalOpen(false);
    reset();
  };

  const handleDeletePost = (id: string) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this post?');
    if (shouldDelete) {
      const updatedPosts: ResearchPost[] = researchPosts.filter((post) => post.id !== id);
      setResearchPosts(updatedPosts);
    }
  };

  const getFileIcon = (fileType: string) => {
    // Map file types to corresponding icons
    const fileIcons: Record<string, string> = {
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'application/pdf': '📄',
      'text/plain': '📄',
      // Add more file types and icons as needed
    };

    return fileIcons[fileType] || '📂'; // Default icon for unknown file types
  };

  const handleAddComment = (postId: string, comment: string) => {
    const updatedPosts: ResearchPost[] = researchPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
        };
      }
      return post;
    });
    setResearchPosts(updatedPosts);
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
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
              <div key={post.id} className="bg-white p-4 rounded shadow w-3/4 mx-auto">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-500 mb-2">{post.description}</p>
                <p className="text-gray-500 mb-2">Author: {post.author}</p>
                <div className="flex items-center mb-2">
                  {getFileIcon(post.document.type)}
                  <span className="ml-2">{post.document.name}</span>
                </div>
                <hr className="my-4" />
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Comments:</h3>
                  {post.comments.length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    <ul className="list-disc pl-4">
                      {post.comments.map((comment, index) => (
                        <li key={index} className="mb-2">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                    rows={4}
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
        </div>
      )}
    </div>
  );
};

export default ResearchPostsPage;
