//click manage account --> modal pops up --> user can change email, password, or delete account
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react"; // Import your Supabase client configuration
import { useRouter } from "next/router";
import Layout from "~/components/layout/Layout"; 

// Define the ManageAccountPage component
const ManageAccountPage = () => {
    const user = useUser();
    const router = useRouter();
  
    // Redirect to login if user is not authenticated
    if (!user) {
      router.push("/signin"); // Path to login page
      return null;
    }
  
    const handleDeleteAccount = async () => {
      const confirmation = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
  
      if (confirmation) {
        try {
          const { error } = await supabase.auth.signOut(); // Sign out the user
          if (error) {
            console.error("Error signing out:", error);
          } else {
            // Account deleted successfully, redirect the user to a sign-out page or handle it as needed.
            router.push("/account-deleted"); // Path to account deletion confirmation page
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    return (
      <Layout>
        <div className="p-4">
          <h1>Manage Account</h1>
          <p>User: {user.email}</p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </Layout>
    );
  };
  
  export default ManageAccountPage;