## Set up
1. Run npm install to install all dependencies
2. Make sure env.local file exists

## Authentication
1. After sign up, go to prisma studio and create a profile record with the user id in the Profile table
2. User id can be obtained from the profile-registration page after you register an account

## User table in Supabase
1. A user row is created everytime a user signs up
2. Reference: https://www.youtube.com/watch?v=0N6M5BBe9AE

## Navbar layout 
1. Add import Layout from "~/components/layout/Layout"; on top of the page
2. Paste this code at the end of every page
```
Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Settings;
```
3. Replace Settings with the name of the page eg. ResearchPostsPage

## Using Supabase Auth library with Next.js
1. import { useSupabaseClient } from "@supabase/auth-helpers-react";
2. Create a supabase client instance using the useSupabaseClient hook
``` 
const supabase = useSupabaseClient();
```
3. Use the supabase client instance to call the auth methods. For instance, forget password reference here: https://supabase.com/docs/guides/auth/auth-password-reset
4. You can also use the useUser hook to get details of the current user
```
import { useUser } from "@supabase/supabase-js";
const { user } = useUser();
console.log(user);
```

# Notification using React Hot Toast
1. On terminal, run: npm install react-hot-toast
2. import on necessary pages to use:
   import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};

3. On terminal, run npm run dev
