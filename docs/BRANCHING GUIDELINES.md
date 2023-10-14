# Branching Guidelines

- **Main** - Production Branch
- **Develop** - Development Branch
- **Feature** - Development Branch for specific use cases

## Creating a Branch

1. Create a new branch from the `develop` branch:
   ```shell
   git checkout develop
   git pull origin develop
   git checkout -b <user-story-code>/<initials>
   ```
   Example: `git checkout -b 1-1-register-account/KH`

2. Ensure you push the newly created branch to the remote repository:
   ```shell
   git push origin <user-story-code>/<initials>
   ```

## Adding Your Feature Changes to Develop

1. Merge your feature branch into the `develop` branch:
   ```shell
   git checkout develop
   git pull origin develop
   git merge --no-ff <user-story-code>/<initials>
   ```

2. Resolve any conflicts that may arise during the merge process.

3. Push the changes to the `develop` branch:
   ```shell
   git push origin develop
   ```

4. Create a pull request from the `develop` branch to the `main` branch.

## Pushing Development to Production

1. Deployment to production is scheduled for every Wednesday to address pending pull requests.

2. If there are feature branches that are no longer needed after completing pull requests, you can delete them locally and remotely:
   - Delete locally:
     ```shell
     git branch -d <user-story-code>/<initials>
     ```
   - Delete remotely:
     ```shell
     git push -d origin <user-story-code>/<initials>
     ```
