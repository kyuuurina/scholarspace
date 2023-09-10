# Utils Documentation

Welcome to the documentation for the utils. In this guide, you'll find detailed information about the various utils available in our repository.

## Table of Contents
- [Getting Started](#getting-started)
  - [When to create a new util](#when-to-create-a-new-util)
- [`api.ts`](#apits)
    - [Making an API call on the frontend](#making-an-api-call-on-the-frontend)
- [`serverUser.ts`](#serveruserts)
- [`userWorkspaces.ts`](#userworkspacests)
    - [Using the `userWorkspaces` util](#using-the-userworkspaces-util)

## Getting Started

### When to create a new util

Create a new utility function that may be reused in multiple pages. The utils are located in the `utils/` folder. 


## `api.ts`
This file contains the API calls to the TrPC server. It uses the `trpc` package to make the API calls. Do not make changes to this file. 

### Making an API call on the frontend
To make an API call, import the `api` object from `~/utils/api.ts`. Then, call the API function you want to use. For example, to call the `get` function from the `workspace` API, you would do the following:

```js
import { api } from "~/utils/api";
...
const workspaces = await api.workspace.get.useQuery
```

## `serverUser.ts`
This util is used to get the current authenticated user from the TrPC server. Do not make changes to this file.

## `userWorkspaces.ts`
This util is used to get the workspaces of the current authenticated user. It returns two objects: 

1. `workspacesData` - The `workspacesData` object contains the raw data of workspace objects from the TrPC server.
2. `workspaceListings`.  The `workspaceListings` object contains the workspace objects with the `name`, `description`, and `cover_img` properties.

### Using the `userWorkspaces` util
To use the `userWorkspaces` util, import the `fetchUserWorkspaces` function from `~/utils/userWorkspaces.ts`. Then, call the function to get the `workspacesData` and `workspaceListings` objects. For example:

```js
import { userWorkspaces } from "~/utils/userWorkspaces";
...
const { workspaceListings } = fetchUserWorkspaces();
```
