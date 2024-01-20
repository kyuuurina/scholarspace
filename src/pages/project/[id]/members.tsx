// utils
import { useRouterId } from "~/utils/routerId";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { FiUserPlus } from "react-icons/fi";

import { useRouter } from "next/router";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import MemberModal from "~/components/members/MemberModal";
import LoadingSpinner from "~/components/LoadingSpinner";
import MemberTable from "~/components/members/MemberTable";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";

const ProjectMember: NextPageWithLayout = () => {
  return (
    <>
      <main className="flex flex-col">
        <h1>Hello</h1>
      </main>
    </>
  );
};

ProjectMember.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProjectMember;
