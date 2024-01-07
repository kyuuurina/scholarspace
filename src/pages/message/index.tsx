import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSessionContext } from "@supabase/auth-helpers-react";

//types
import type { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

//components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import FormErrorMessage from "~/components/FormErrorMessage";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorPage from "~/pages/error-page";

//chat components
import EmptyState from "~/components/chat/EmptyState";
import { ChatBubs } from "~/components/chat/ChatBubs";

//utils

const MessagePage: NextPageWithLayout = () => {
    useSessionContext();
    const userId = getCookie("UserID");
    const { register, handleSubmit, reset } = useForm();

    console.log("userId", userId)

    return(
        <>
        <Head title="Chat Message" />
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
        </>

    )
};

MessagePage.getLayout = function getLayout(page: ReactElement) {
    return (
      <>
        <Layout>{page}</Layout>
      </>
    );
  };
  
  export default MessagePage;