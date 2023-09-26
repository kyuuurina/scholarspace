import type { ReactElement } from "react";
import Head from "~/components/layout/Head";
import { useUser } from "@supabase/auth-helpers-react";
import { setCookie } from "cookies-next";

import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";

const Page: NextPageWithLayout = () => {
  const user = useUser();
  setCookie("User ID", user?.id);
  return <></>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Main Page" />
      <Layout>{page}</Layout>
    </>
  );
};

export default Page;
