Certainly, I can format these guidelines for a Markdown file. Here's a formatted version:

```markdown
# Branching Guidelines

- **Main** - Production Branch
- **Develop** - Development Branch
- **Feature** - Development Branch for specific use cases

## Creating a Branch

1. Create a new branch from the `develop` branch:
   ```shell
   git checkout develop
   git pull origin develop
   git checkout -b feature/<initials>/<user-story-code>
   ```
   Example: `git checkout -b feature/KH/1-1-register-account`

2. Ensure you push the newly created branch to the remote repository:
   ```shell
   git push origin feature/<initials>/<user-story-code>
   ```

## Adding Your Feature Changes to Develop

1. Merge your feature branch into the `develop` branch:
   ```shell
   git checkout develop
   git pull origin develop
   git merge --no-ff feature/<initials>/<user-story-code>
   ```

2. Resolve any conflicts that may arise during the merge process.

3. Push the changes to the `develop` branch:
   ```shell
   git push origin develop
   ```

4. Create a pull request from the `develop` branch to the `main` branch.

## Pushing Development to Production

1. Deployment to production is scheduled for every Wednesday to address pending pull requests.

2. If there are feature branches that are no longer needed, you can delete them locally and remotely:
   - Delete locally:
     ```shell
     git branch -d feature/<initials>/<user-story-code>
     ```
   - Delete remotely:
     ```shell
     git push -d origin feature/<initials>/<user-story-code>
     ```

These guidelines provide a structured workflow for branching, development, and production deployment. Adjust the branching strategy as needed to fit your project's specific requirements.
```

This Markdown version should be easier to read and understand in a markdown file. Make sure to replace the Markdown code in your file, and it should render nicely when viewed in Markdown readers or repositories.
