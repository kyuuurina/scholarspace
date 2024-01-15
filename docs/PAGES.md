# Pages Documentation

Welcome to the documentation for the pages. In this guide, you'll find detailed information about the various pages available in our repository.

## Table of Contents
- [Getting Started](#getting-started)
  - [Creating a new page](#creating-a-new-page)
- [Root Pages](#root-pages)
- [Auth Pages](#auth-pages)
- [Workspace Pages](#workspace-pages)

## Getting Started
### Creating a new page

1. Create a new .tsx file in the `pages` folder.
2. Import the ```NextPageWithLayout``` type from `~/pages/_app.tsx` and the ```Layout``` component from the ```layout``` component folder.

```js
import type { NextPageWithLayout } from "~/pages/_app";
import Layout from "~/components/layout/Layout";
```
3. Create a new component and export it as a NextPageWithLayout.

```js
const NewPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
};
```
4. Apply the scholarspace layout after creating the component.

```js
NewPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
```
5. Export the page at the end of the file.

```js
export default NewPage;
```
## Root Pages
These are the main pages of Scholarspace. The pages are located in the `pages/` folder. It contains three pages:

1. `index.tsx` - The home page of Scholarspace.
2. `signup.tsx` - The page for signing up.
3. `signin.tsx` - The page for logging in.
4. `profile-registration.tsx` - The page for registering the user's profile after first sign up. ***This page may be moved into a new folder in the future.***
5. `_app.tsx` - The main app component of Scholarspace. It contains the layout and the authentication logic using Supabase.

## Auth Pages
The auth pages are used for authentication results. The pages are located in the `pages/auth` folder. It contains three pages:

1. `success.tsx` - The page for successful authentication.
2. `error.tsx` - The page for failed authentication.

## Workspace Pages
The workspace pages are used for workspace management within the research management system. The pages are located in the `pages/workspace` folder. It contains three pages:

1.  `[id].tsx` - The main page for the workspace. It contains the workspace information and the workspace navigation.
2. `members.tsx` - The page for managing the workspace members.
3. `settings.tsx` - The page for managing the workspace settings.
