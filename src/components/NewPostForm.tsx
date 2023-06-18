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
      <input type="text" {...register('title')} placeholder="Title" />
      <input type="text" {...register('uploadDocument')} placeholder="Upload Document" />
      <input type="text" {...register('description')} placeholder="Description" />
      <input type="text" {...register('author')} placeholder="Author" />
      <button type="submit">Post</button>
    </form>
  );
};

export default NewPostForm;
