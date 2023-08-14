/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { ReactElement } from "react";
import { Head } from "~/components/layout/Head";

import Layout from "~/components/layout/Layout";
import type { NextPageWithLayout } from "~/pages/_app";

const Page: NextPageWithLayout = () => {
  return <p>Whereas disregard and contempt for human rights have resulted</p>;
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
