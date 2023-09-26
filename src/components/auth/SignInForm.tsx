import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Link } from "~/components/Link";
import LoadingSpinner from "~/components/LoadingSpinner";
import { GoogleButton } from "~/components/auth/GoogleButton";
import { setCookie } from "cookies-next";

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const handleSignIn = async () => {
    // clear error message
    setErrorMessage(undefined);
    setLoading(true);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    const userId = data.user?.id;
    setCookie("User ID", userId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // invalidate the stored language cookie
    // this will cause a DB re-fetch of the language preference on the next request

    if (data) {
      void router.push("/");
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSignIn();
      }}
      method="POST"
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="focus:border-primary focus:ring-primary block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="text-sm">
            <Link href="/auth/forgot">Forgot password?</Link>
          </div>
        </div>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="focus:border-primary focus:ring-primary block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          {loading ? <LoadingSpinner /> : "Sign In"}
        </button>

        <GoogleButton type="signin" />
      </div>
    </form>
  );
};
