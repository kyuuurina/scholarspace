

import { type NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import { type ReactElement } from "react";
import ResetPasswordForm from "~/components/auth/ForgotPasswordForm";
import ForgotPasswordForm from "~/components/auth/ForgotPasswordForm";

// export default ForgotPasswordPage;
const ForgotPasswordPage: NextPageWithLayout = () => {
  return (

    <ForgotPasswordForm/>
  );
};

// ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <>
//       <Head title="Reset Password" />
//       <Layout>{page}</Layout>
//     </>
//   );
// };

export default ForgotPasswordPage;
