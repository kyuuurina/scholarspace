import { useState } from "react";
import { supabase } from "~/utils/supabase";
import PrimaryButton from "../button/PrimaryButton";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          "https://scholarspace-kyuuurina.vercel.app/auth/reset-password",
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setError(null);
      }
    } catch (error) {
      console.error("Error resetting password:", error as Error);
      setError("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-purple-100">
      <div className="mx-auto max-w-md rounded-md bg-white p-4 shadow-md">
        <div className="mb-4">
          <img
            src="/scholarspace-forgot-password.png"
            alt="Forgot Password"
            className="mx-auto mb-4"
          />
          <h1 className="mb-4 text-3xl font-semibold">Reset Password</h1>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">
            Password reset instructions sent to your email.
          </p>
        )}
        <div className="mt-4">
          <PrimaryButton
            name="Reset Password"
            type="button"
            onClick={handleResetPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
