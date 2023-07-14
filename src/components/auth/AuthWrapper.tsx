
import { Head } from "~/components/Head";
import { Link } from "~/components/Link";

type AuthType = "signin" | "signup" | "forgot" | "set" | "verify" | "success";

type Props = {
  type: AuthType;
  children: React.ReactNode;
};

const AlternativeLink: React.FC<{ type: AuthType }> = ({ type }) => {
  if (type === "signup") return <Link href="/signin">Sign In</Link>;
  return <Link href="/signup">Sign Up</Link>;
};

const authTypeToText = (type: AuthType): string => {
  if (type === "signin") return "SignIn";
  if (type === "signup") return "SignUp";
  if (type === "verify") return "Verify email";
  if (type === "success") return "Email verified";
  if (type === "set") return "Set new password";

  return "Forgot password";
};

export const AuthWrapper: React.FC<Props> = ({ children, type }) => {
  return (
    <>
      <Head title={authTypeToText(type)} />
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {type === "signup" && 'Sign Up'}
                {type === "signin" && 'Sign In'}
                {type === "forgot" && 'Forgot password'}
                {type === "verify" && 'Verify email'}
                {type === "success" && 'Email verified'}
                {type === "set" && 'Set new password'}
              </h2>
              {["signup", "signin"].includes(type) && (
                <p className="mt-2 text-sm">
                  or <AlternativeLink type={type} />
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
