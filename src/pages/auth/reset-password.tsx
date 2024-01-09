

import { type NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import { type ReactElement } from "react";
import ResetPasswordForm from "~/components/auth/ResetPasswordForm";

// export default ForgotPasswordPage;
const ResetPasswordPage: NextPageWithLayout = () => {
  return (
    <ResetPasswordForm />
  );
};

export default ResetPasswordPage;
