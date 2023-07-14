import type { NextPage } from "next";

import { AuthWrapper } from "~/components/auth/AuthWrapper";

const Verify: NextPage = () => (
  <AuthWrapper type="verify">
    Check your email and click the link in the message to activate your account.
  </AuthWrapper>
);

export default Verify;
