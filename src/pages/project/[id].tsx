// utils
import { useRouterId } from "~/utils/routerId";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages

// components
import Layout from "~/components/layout/Layout";
import Image from "next/image";
import Link from "next/link";

const Project: NextPageWithLayout = () => {
  return (
    <>
      <main className="flex flex-col">{/* Project header */}</main>
    </>
  );
};

Project.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Project;
