import { useState } from 'react';
import router from 'next/router';
import toast from 'react-hot-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import router from 'next/router';
import toast from 'react-hot-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';

const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      toast.error('Error signing out. Please try again.');
    } else {
      toast.success('Successfully signed out.');
      void router.push('/signin');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="focus:border-primary focus:ring-primary group flex w-full rounded-lg px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
      >
        Sign Out
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md mx-auto rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Are you sure you want to sign out?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-600 hover:text-gray-800 mr-4"
              >
                Cancel
              </button>
              <button onClick={handleSignout} className="text-red-500 hover:text-red-700">
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignoutButton;


// import router from "next/router";
// import toast from "react-hot-toast";
// import { useSessionContext } from "@supabase/auth-helpers-react";

// const SignoutButton: React.FC = () => {
//   const { supabaseClient } = useSessionContext();

//   return (
//     <button
//       onClick={async () => {
//         const { error } = await supabaseClient.auth.signOut();

//         if (error) return toast.error("Error signing out. Please try again.");

//         void router.push("/signin");
//       }}
//       className="focus:border-primary focus:ring-primary group flex w-full rounded-lg px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
//     >
//       Sign Out
//     </button>
//   );
// };

// export default SignoutButton;
