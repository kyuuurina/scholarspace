//utils
import React from "react";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";

const Home: NextPageWithLayout = () => {
  return <div>Hello</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Head title="Home Page" />
      {page}
    </Layout>
  );
};

export default Home;
