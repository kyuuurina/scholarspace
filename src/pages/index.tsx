import type { ReactElement } from "react";
import Head from "~/components/layout/Head";

import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";

const Page: NextPageWithLayout = () => {
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
