import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { ProjectFormData } from "~/types/project";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import FormErrorMessage from "~/components/FormErrorMessage";
import DeleteProjectModal from "~/components/project/DeleteProjectModal";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";
import LeaveProjectModal from "~/components/project/LeaveProjectModal";
import PageLoader from "~/components/layout/PageLoader";

// utils
import { useRouterId } from "~/utils/routerId";

const ProjectSettings: NextPageWithLayout = () => {
  return (
    <>
      <h1>Hello</h1>
    </>
  );
};

ProjectSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProjectSettings;
