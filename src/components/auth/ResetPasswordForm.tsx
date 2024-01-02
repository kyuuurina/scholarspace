import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '~/utils/supabase';
import SuccessToast from '../toast/SuccessToast';
import ErrorToast from '../toast/ErrorToast';

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error updating password:', error as Error);
      setError('Error updating password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Update Password</h1>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
          New Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Password updated successfully.</p>}
      <div className="mt-4">
        <button
          onClick={handleResetPassword}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
