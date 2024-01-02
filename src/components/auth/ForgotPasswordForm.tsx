import { useState } from 'react';
import { supabase } from '~/utils/supabase';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/auth/reset-password',
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error resetting password:', error as Error);
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Reset Password</h1>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Password reset instructions sent to your email.</p>}
      <div className="mt-4">
        <button
          onClick={handleResetPassword}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
