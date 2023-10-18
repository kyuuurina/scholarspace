//ni tunggu dulu, All tu nanti ada dkt [id].tsx

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

//components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";

const Posts: NextPageWithLayout = () => {
  return <></>;
};

Posts.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Main Page" />
      <Layout>{page}</Layout>
    </>
  );
};

export default Posts;
