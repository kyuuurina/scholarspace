import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { type ZodType, z, set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";

// types
import type { ResearchPostFormData } from "~/types/researchpost";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";


import React from "react";
import { FC } from "react"; // import FC type

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const ResearchPostModal: FC<ModalProps> = ({ openModal, onClick }) => { // use FC type
  // image variables

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  //const createResearchWorkPost = api.researchpost.create.useMutation();

  return (
    // your modal component JSX here
    <div>Modal Component</div>
  );
};

  // schema for form validation


  // react-hook-form


  // handler for onSubmit form
  

      // Navigate to the newly created post
      

  // handler for onChange input for image upload
  




export default ResearchPostModal;