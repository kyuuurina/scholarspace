// NewPostForm.tsx
import { useForm } from 'react-hook-form';

type NewPostFormData = {
  title: string;
  uploadDocument: string;
  description: string;
  author: string;
};

const NewPostForm: React.FC = () => {
  const { handleSubmit, register } = useForm<NewPostFormData>();

  const onSubmit = (data: NewPostFormData) => {
    // Handle form submission, e.g., send data to server, update state, etc.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input type="text" {...register('title')} id="title" placeholder="Title" />
      </div>
      <div className="form-row">
        <label htmlFor="uploadDocument">Upload Document</label>
        <input type="text" {...register('uploadDocument')} id="uploadDocument" placeholder="Upload Document" />
      </div>
      <div className="form-row">
        <label htmlFor="description">Description</label>
        <input type="text" {...register('description')} id="description" placeholder="Description" />
      </div>
      <div className="form-row">
        <label htmlFor="author">Author</label>
        <input type="text" {...register('author')} id="author" placeholder="Author" />
      </div>
      <button type="submit">Post</button>
    </form>
  );
};

export default NewPostForm;
