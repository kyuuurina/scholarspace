// pages/forgot-password.tsx

import ForgotPassword from "src/components/auth/ForgotPassword";
import { type NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import { type ReactElement } from "react";

// export default ForgotPasswordPage;
const ForgotPasswordPage: NextPageWithLayout = () => {
  return <></>;
};

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head title="Main Page" />
      <Layout>{page}</Layout>
    </>
  );
};

export default ForgotPasswordPage;
