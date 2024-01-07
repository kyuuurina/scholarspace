// AddNewPostModal.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchMyResearchPosts } from "~/utils/researchpost";

// types
import type { ResearchPostFormData } from "~/types/researchpost";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ModalProps = {
    openModal: boolean;
    onClick: () => void;
    postIdToEdit: string;
  };

  const EditPostForm: React.FC<ModalProps> = ({ openModal, onClick, postIdToEdit }) => {

    //const
    const router = useRouter();
    const user = useUser();
    const profile_id = useRouterId();
    // const  profile_id  = router.query;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const userId = getCookie("UserID");
  
    //populate form fields 
    const { myResearchPosts, isLoading, error } = useFetchMyResearchPosts();
    const { post_id, category, title, author, description, document } = myResearchPosts[0] || {};

    const [documentPlaceholder, setdocumentPlaceholder] = useState<string | null>(null);
    const [documentValue, setDocumentValue] = useState<File | null | undefined>(null);
    const docpostId: string = uuidv4();
  
  
  //schema for form validation
  const schema: ZodType<ResearchPostFormData> = z.object({
    category: z.string(),
    title: z.string().refine((data) => !!data, {
      message: "Title is required",
    }),
    description: z.string().nullable(),
    author: z.string().nullable(),
    document: z.string().nullable(),
  });
  
    //react-hook-form
      const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
      } = useForm<ResearchPostFormData>({
        resolver: zodResolver(schema),
        defaultValues :{
          category: category,
          title: title,
          description: description,
          author: author,
          document: document,
        }
      });
  
      useEffect(() => {
        if (!isLoading) {
          const postToEdit = myResearchPosts.find((post) => post.post_id === postIdToEdit);
      
          if (postToEdit) {
            setValue("category", postToEdit.category || "");
            setValue("title", postToEdit.title || "");
            setValue("description", postToEdit.description || "");
            setValue("author", postToEdit.author || "");
            setValue("document", postToEdit.document || "");
            setdocumentPlaceholder(postToEdit.document || null);
          }
        }
      }, [isLoading, setValue, postIdToEdit, myResearchPosts]);

      useEffect(() => {
        if (document) {
          // Assuming document is the URL of the existing document
          setdocumentPlaceholder(document);
        }
      }, [document]);

      
      
  
    //toast
    const updatePost = api.researchpost.update.useMutation({
      onSuccess: () => {
        toast.custom(() => <SuccessToast message="Post successfully updated" />);
        router.reload();
      },
      onError: () => {
        toast.custom(() => <ErrorToast message="Error updating post" />);
      },
    });
  
    //handlers
    const handleUpdatePost = async (formData: ResearchPostFormData) => {
        try {
          if (post_id) {
            await updatePost.mutateAsync({
              post_id,
              ...formData,
            });
            console.log(formData);
          } else {
            // Handle the case where post_id is undefined
            console.error("post_id is undefined");
          }
        } catch (error) {
          // Handle any errors
          console.error(error);
        }
      };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
          if (!e.target.files) return;
          const file = e.target.files[0];
          const reader = new FileReader();
    
          if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              const displayDocument = reader.result as string;
              setdocumentPlaceholder(displayDocument);
            };
    
            setDocumentValue(file);
          }
        } catch (error) {
          console.log(error);
        }
      };
  
    // handle cancel
    const handleCancel = () => {
      reset({
        category: category || "",
        title: title || "",
        description: description || "",
        document: document || "",
      });
    };
  
    const handleEditClick = () => {setIsEditModalOpen(true);};
  
    return (
        <div>
          <Modal
            show={openModal}
            onClose={() => {
              onClick();
              reset();
              setdocumentPlaceholder(null);
            }}
            title="Edit Post"
          >
            <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdatePost)}>
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Category
                </label>
                <select id="category" className="block w-full" {...register("category", { required: true })}>
                  <option value="Article">Article</option>
                  <option value="Conference Paper">Conference Paper</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Preprint">Preprint</option>
                  <option value="Research Proposal">Research Proposal</option>
                  <option value="Thesis">Thesis</option>
                  <option value="Idea">Idea</option>
                </select>
                {errors.category && <FormErrorMessage text={errors.category.message} />}
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
                      accept="image/doc, image/docx, image/pdf"
                      onChange={(e) => {
                        void handleOnChange(e);
                      }}
                    />
                  </label>
                </div>
              </div>
                {/* Buttons container with justify-end */}
                <div className="flex justify-end gap-4">
                {/* Save button */}
                <PrimaryButton name="Save" type="submit" />

                {/* Cancel button */}
                <button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center"
                    onClick={() => {
                    onClick();
                    handleCancel();
                    }}
                >
                    Cancel
                </button>
                </div>
            </form>
          </Modal>
        </div>
      );
  };
  
  export default EditPostForm;