// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { type ZodType, z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
// import { api } from "~/utils/api";

// // types
// import { ResearchPostFormData } from "~/types/researchpost";

// // local components
// import FormErrorMessage from "../FormErrorMessage";
// import Modal from "../modal/Modal";
// import PrimaryButton from "../button/PrimaryButton";

// type EditPostModalProps = {
//   openModal: boolean;
//   onClick: () => void;
//   post: ResearchPostFormData; // The post data to be edited
//   onUpdate: (post: ResearchPostFormData) => void; // Callback to update the post
// };

// const EditPostModal: React.FC<EditPostModalProps> = ({
//   openModal,
//   onClick,
//   post,
//   onUpdate,
// }) => {
//   // Similar to AddNewPostModal, you can reuse most of the code here with modifications as needed.

//   // React Hook Form
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setValue, // Use setValue to pre-fill the form fields with the post data.
//   } = useForm<ResearchPostFormData>({
//     resolver: zodResolver(schema),
//     defaultValues: post, // Pre-fill the form with the provided post data.
//   });

//   useEffect(() => {
//     setValue("document", null); // Clear the document field, as it should not be pre-filled.
//   }, [post]);

//   // Handler for onSubmit form
//   const onSubmit = async (formData: ResearchPostFormData) => {
//     if (isSubmitting) return;
//     try {
//       // Update the post with new data here.
//       onUpdate(formData);
//       onClick();
//     } catch (error) {
//       // Handle any errors
//       console.error(error);
//     }
//   };

//   // Rest of the component remains the same as AddNewPostModal.

//   return (
//     <div>
//       <Modal
//         show={openModal}
//         onClose={() => {
//           onClick();
//           reset();
//           setdocumentPlaceholder(null);
//         }}
//         title="Edit Post"
//       >
//         <form
//           autoComplete="off"
//           className="flex flex-col gap-4"
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           {/* Fields and form elements for editing the post */}
//           {/* ... Similar to AddNewPostModal ... */}

//           <PrimaryButton name="Update Post" type="submit" />
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default EditPostModal;
