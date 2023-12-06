// AddNewPostModal.tsx 
// to do - success toast/error toast

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

// types
import type { ResearchPostFormData } from "~/types/researchpost";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";


//huggingface-vercelai
import { HfInference } from "@huggingface/inference";
//import { summarizeText } from "~/utils/summarization";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const AddNewPostModal: React.FC<ModalProps> = ({ openModal, onClick }) => {
  // document variables
  const [documentPlaceholder, setdocumentPlaceholder] = useState<string | null>(null);
  const [documentValue, setdocumentValue] = useState<File | null | undefined>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const docpostId: string = uuidv4();


  const router = useRouter();
  // const { user } = useUser();
  const user = useUser();
  const supabase = useSupabaseClient();
  //const huggingface = new HfInference({token: process.env.HUGGING_FACE_API_TOKEN }); // Initialize Hugging Face Inference

  // hot toast for success and error message
  const createResearchPost = api.researchpost.create.useMutation(
  //   {
  //   onSuccess: () => {
  //     toast.custom(() => <SuccessToast message="Post successfully created" />);
  //     // Reload the page or perform any necessary actions after successful submission
  //   },
  //   onError: (error) => {
  //     toast.custom(() => <ErrorToast message={error.toString()} />);
  //     onClick();
  //     reset();
  //   },
  // }
  );

  // schema for form validation
  const schema: ZodType<ResearchPostFormData> = z.object({
    category: z.string(),
    title: z.string().refine((data) => !!data, {
      message: "Title is required", // Custom error message if validation fails
    }),
    // .min(2, "Title must be at least 2 characters long.")
    // .max(200, "Title must be at most 200 characters long."),
    description: z.string().nullable(),
    author: z.string().nullable(),
    // .min(2, "Author must be at least 2 characters long.")
    // .max(200, "Author must be at most 200 characters long."),
    document: z.string().nullable(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResearchPostFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      document: null,
    },
  });

  // handler for onSubmit form
  const onSubmit = async (formData: ResearchPostFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      // Upload the document to the "post-files-upload" storage bucket
      if (documentValue && user) {
        formData.document = docpostId;
        const fileUrl = `/${docpostId}`;
        const { data, error } = await supabase.storage
          .from("post-files-upload")
          .upload(fileUrl, documentValue);

        // Handle errors or log data if needed
        console.log(error);
        console.log(data);
      }

      // Read the document content
      //const documentContent = await readFileContent(documentValue);

      // Summarize the document content using Hugging Face Inference
      //const summary = await summarizeText(documentContent);

      // // Create the research post with the summary
      // const response = await createResearchPost.mutateAsync({
      //   category: formData.category as "Article" | "Conference_Paper" | "Presentation" | "Preprint" | "Research_Proposal" | "Thesis" | "Others",
      //   title: formData.title,
      //   description: formData.description,
      //   //description: summary, // Set the description to the generated summary
      //   author: formData.author,
      //   document: formData.document,
      // });

      const response = await createResearchPost.mutateAsync({
        ...formData,
      });
      // Reset form and state
      onClick();
      reset();
      setdocumentPlaceholder(null);

      // Navigate to the newly created post
      await router.push(`/home-rwp/${response.post_id}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  };

  // handler for onChange input for document upload
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const reader = new FileReader();

      // Read the document as a data URL
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const displayDocument = reader.result as string;
          setdocumentPlaceholder(displayDocument);
        };

        setdocumentValue(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // utility function to read the content of the uploaded document
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          const content = event.target.result as string;
          resolve(content);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
          reset();
          setdocumentPlaceholder(null);
        }}
        title="Add New Post"
      >
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Category
            </label>
            <input id="name" className="block w-full" {...register("category", { required: true })} />
            {errors.category && <FormErrorMessage text={errors.category.message} />}
          </div> */}

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Category
            </label>
            <select
              id="category"
              className="block w-full"
              {...register("category", { required: true })}
            >
              <option value="Article">Article</option>
              <option value="Conference Paper">Conference Paper</option>
              <option value="Presentation">Presentation</option>
              <option value="Preprint">Preprint</option>
              <option value="Research Proposal">Research Proposal</option>
              <option value="Thesis">Thesis</option>
              <option value="Idea">Idea</option>
            </select>
            {errors.category && (
              <FormErrorMessage text={errors.category.message} />
            )}
          </div>

          <div>
            <label htmlFor="research title" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>
            <input id="name" className="block w-full" {...register("title", { required: true })} />
            {errors.title && <FormErrorMessage text={errors.title.message} />}
          </div>

          <div>
            <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Author
            </label>
            <input id="author_name" className="block w-full" {...register("author", { required: true })} />
            {errors.author && <FormErrorMessage text={errors.author.message} />}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea id="description" className="block w-full" {...register("description", { required: true })} />
            {errors.description && <FormErrorMessage text={errors.description.message} />}
          </div>

          <div>
            <label htmlFor="cImage" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Upload a Research Document
            </label>
            <div className="flex w-full items-center justify-center">
              <label className="relative flex h-25 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ">
                {documentPlaceholder ? (
                  <Image src={documentPlaceholder} alt="post documents" style={{ objectFit: "contain" }} fill />
                ) : (
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.doc, or .docx (max 50mb)</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/doc, image/docx" // Define file types accepted
                  onChange={(e) => {
                    void handleOnChange(e);
                  }}
                />
              </label>
            </div>
          </div>

          <PrimaryButton name="Create New Post" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default AddNewPostModal;

function summarizeText(documentContent: string) {
  throw new Error("Function not implemented.");
}