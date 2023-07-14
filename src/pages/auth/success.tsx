import type { NextPage } from "next";

import { AuthWrapper } from "~/components/auth/AuthWrapper";
import { Link } from "~/components/Link";

const Success: NextPage = () => {
  return (
    <AuthWrapper type="success">
      <Link href="/signin">Login now</Link>
    </AuthWrapper>
  );
};

export default Success;
