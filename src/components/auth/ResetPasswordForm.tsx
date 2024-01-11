import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '~/utils/supabase';
import SuccessToast from '../toast/SuccessToast';
import ErrorToast from '../toast/ErrorToast';
import PrimaryButton from '../button/PrimaryButton';

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
        // Redirect to /signin after successful password update
        await router.push('/signin');
      }
    } catch (error) {
      console.error('Error updating password:', error as Error);
      setError('Error updating password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-purple-100">
      <div className="max-w-xl p-8 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold mb-6">Update Password</h1>
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
        <div className="mb-6">
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
        <div className="mt-8">
          <PrimaryButton
            name="Update Password"
            onClick={handleResetPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
