// import { useState } from "react";
// import { useSessionContext } from "@supabase/auth-helpers-react";

// export const ManageAccountForm: React.FC = () => {
//   const [newEmail, setNewEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState<string | undefined>();
//   const [successMessage, setSuccessMessage] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);

//   const { supabaseClient } = useSessionContext();

//   const handleUpdateAccount = async () => {
//     setErrorMessage(undefined);
//     setSuccessMessage(undefined);
//     setLoading(true);

//     try {
//       const user = supabaseClient.auth.user();
//       if (!user) {
//         throw new Error("User not authenticated");
//       }

//       if (newEmail) {
//         await supabaseClient.auth.update({
//           email: newEmail,
//         });
//       }

//       if (newPassword) {
//         await supabaseClient.auth.update({
//           password: newPassword,
//         });
//       }

//       setSuccessMessage("Account updated successfully");
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         void handleUpdateAccount();
//       }}
//       className="space-y-6"
//     >
//       <div>
//         <label
//           htmlFor="newEmail"
//           className="block text-sm font-medium text-gray-700"
//         >
//           New Email
//         </label>
//         <div className="mt-1">
//           <input
//             id="newEmail"
//             name="newEmail"
//             type="email"
//             value={newEmail}
//             onChange={(event) => setNewEmail(event.target.value)}
//             autoComplete="email"
//             className="focus:border-primary focus:ring-primary block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
//           />
//         </div>
//       </div>

//       <div className="space-y-1">
//         <label
//           htmlFor="newPassword"
//           className="block text-sm font-medium text-gray-700"
//         >
//           New Password
//         </label>
//         <div className="mt-1">
//           <input
//             id="newPassword"
//             name="newPassword"
//             type="password"
//             value={newPassword}
//             onChange={(event) => setNewPassword(event.target.value)}
//             autoComplete="new-password"
//             className="focus:border-primary focus:ring-primary block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm"
//           />
//         </div>
//       </div>

//       {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}
//       {successMessage && (
//         <p className="text-sm text-green-600 ">{successMessage}</p>
//       )}

//       <div className="space-y-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className="flex w-full justify-center rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
//         >
//           {loading ? "Updating..." : "Update Account"}
//         </button>
//       </div>
//     </form>
//   );
// };