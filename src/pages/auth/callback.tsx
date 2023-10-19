// import { use, useEffect } from 'react';
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
// import {useRouter} from 'next/router';


// const CallbackPage = () => {
//     const handleCallback = async () => {
//         const url = new URL (window.location.href);
//         const code = url.searchParams.get('code');
//         const next = url.searchParams.get('next');

//         if (code) {
//             //Exchange code for a session
//             await supabase.auth.exchangeCodeforSession(code);

//             //Redirect to password reset page
//             window.location.href = next || '/reset-password'; //Set the correct reset password page URL
//         }
//         else{
//             //Handle case where code is missing or invalid
//             //Display error message or redirect to an error page
//             console.error('Invalid code or missing parameter');
//         }
//     };

//     useEffect(() => {
//         handleCallback();
//     }, []);

//     return (
//         <div>
//             <p>Processing password reset</p>
//         </div>
//     );
// };
// export default CallbackPage;