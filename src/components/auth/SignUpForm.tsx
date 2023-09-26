/* eslint-disable @typescript-eslint/no-floating-promises */
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { setCookie } from "cookies-next";

import { GoogleButton } from "~/components/auth/GoogleButton";
import LoadingSpinner from "~/components/LoadingSpinner";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { supabaseClient } = useSessionContext();

  const router = useRouter();

  let NEXT_PUBLIC_APP_URL: string;
  if (process.env.NEXT_PUBLIC_APP_URL)
    NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

  const handleSignUp = async () => {
    // clear error message
    setErrorMessage(undefined);
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: NEXT_PUBLIC_APP_URL.concat("/auth/success"),
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // if there is a session it means that we do not need to verify the email beforehand
    if (session) {
      setCookie("session", JSON.stringify(session));
      router.push("/");
    } else {
      router.push("/auth/verify");
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignUp();
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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
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
          {loading ? <LoadingSpinner /> : "Sign Up"}
        </button>

        <GoogleButton type="signup" />
      </div>
    </form>
  );
};

export default SignUpForm;
