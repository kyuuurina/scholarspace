import { useState } from "react";
import { useForm } from "react-hook-form"; // Import react-hook-form
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

type ResearchPostFormData = {
  title: string;
  author: string;
  file: File;
};

const NewPostForm: React.FC = () => {
  return (
   <div>

   </div>
  );
};

export default NewPostForm;
