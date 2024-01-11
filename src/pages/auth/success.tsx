import type { NextPage } from "next";

import { AuthWrapper } from "~/components/auth/AuthWrapper";
import { Link } from "~/components/Link";

const Success: NextPage = () => {
  return (
    <main className="mx-auto flex h-screen flex-col items-center justify-center bg-purple-100 px-6 py-8 lg:py-0">
      <AuthWrapper type="success">
        <Link href="/signin">Login now</Link>
      </AuthWrapper>
    </main>
  );
};

export default Success;
