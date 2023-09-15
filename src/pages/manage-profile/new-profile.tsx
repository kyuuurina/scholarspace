import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Select from "react-select";
import { api } from "~/utils/api";
import Modal from "~/components/modal/Modal";
import { useForm } from "react-hook-form";
import EditableDropDown from "~/components/EditableDropDown";

// next hooks
import { useRouter } from "next/router";

const NewProfilePage = () => {
  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Research Posts</h1>
    </div>
  );
};

export default NewProfilePage;
