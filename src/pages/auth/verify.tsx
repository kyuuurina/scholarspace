import type { NextPage } from "next";
import { AuthWrapper } from "~/components/auth/AuthWrapper";
import Link from "next/link";

const Verify: NextPage = () => (
  <main className="mx-auto flex h-screen flex-col items-center justify-center bg-purple-100 px-6 py-8 lg:py-0">
    <AuthWrapper type="verify">
      <span>
        Check your email and click the link in the message to activate your
        account.
      </span>
      <Link href="/">
        <p className="py-2 text-dark-purple hover:underline">
          Proceed to Sign In page
        </p>
      </Link>
    </AuthWrapper>
  </main>
);

export default Verify;
