---
title: Writing my first GitHub Action
pubDate: 2024-02-14
tags: ['typescript', 'github-actions']
isDraft: false
isFeatured: true
description: When I needed a specific action to add in my workflow, I could not find a good one. So I wrote it myself - here is how!
---

[GitHub Actions](https://github.com/features/actions) are awesome. By automating tasks such as building, testing, and deploying code, GitHub Actions streamline the development process, making it faster and more efficient. This means that teams can deliver code faster, although of course they sometimes have to wait for CI/CD checks to finish (looking at you end-to-end tests).

This simple blog for example has three different workflows:

1. _end-to-end tests_ (mostly to be able to merge dependabot updates without having to click through the blog myself)
2. _accessibility bot_ that checks issues and PR comments and looks for missing alt texts if pictures are posted
3. _code checks_ like linting and formatting to ensure good code quality

And this is just for me. At work, with a much larger project, we of course use much more workflows that outshine my workflows in complexity by orders of magnitude.

Recently we wanted to switch our release flow. To make this whole thing make sense, I have to preface this by saying that we still use Git Flow with a `main` branch for our releases, `develop` for stage and feature branches that merge into `develop`. To trigger a release, we merged `develop` into `main` and the workflow did its thing.

## Release please!

Sometimes we had to look back in the commit history to check what has been added to the `develop` branch since the last release. Switching to [release-please](https://github.com/googleapis/release-please) would help us with this issue by opening a release PR that creates the release and an update to the `CHANGELOG.md` file.

Setting up release-please was also not as straightforward as it would be with trunk-based development (using just the `main` branch and keeping it deployable at all times) - mostly because the documentation is okay but does not cover our problem.

It's now setup to look for pushes to the `develop` branch and then opening a PR to `main`.

```yaml title="release.yml"
name: Release please

on:
  push:
    branches:
      - develop

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          token: ${{ secrets.GITHUB_ACCESS_TOKEN }}
          release-type: node
          target-branch: main
```

Finding the `target-branch` option took some time.

## Hotfixes

Not all code is perfect. Not all code pushed to prod is bug free. Some bugs might need to be fixed as soon as possible, not with the next planned release.

In those cases we branched off of `main` and opened a PR against `main` - merging it would then trigger the release. This would not work with our new setup, as the release is created by `release-please` and the merging of the release PR.

So, I came up with the idea to create new branch called `hotfix` and make `release-please` check for pushes to it and a separate release PR.

## Keeping the branches up to date

But this creates another problem: `develop` and `main` can become out of sync. The easiest way would be to do it manually. But programmers don't want to spend 5 minutes to do a thing if they can spend 5 hours to automate the thing!

I looked for a GitHub Action that did just that: update the branch. I found some, but they only update one branch at a time. Of course I could call the same action twice, but that didn't seem right to me.

Therefore I did what felt necessary: write the action myself. I found a [great starting template](https://github.com/actions/typescript-action) for typescript actions and took it from there.

## How to update the branch

I did some digging in the git docs and found [`updateRef`](https://git-scm.com/docs/git-update-ref) which does exactly what I need: take the latest commit sha of main and update the ref of the branch to be that sha.

Then I had to figure out, what do I need to update the branch? Well, of course we need an access token with permissions to commit. I need the branches that should be updated. And I need to specify if the action should force-push or not.

```ts title="main.ts"
const force = core.getBooleanInput('force');

const branchesInput = core.getInput('branches');
const branches = getBranches(branchesInput);

const githubToken = core.getInput('token');
const octokit = github.getOctokit(githubToken);
const { ref, repo, sha } = github.context;
```

I thought I could simply get the branches by doing something like this:

```yaml
with:
  branches: [develop, hotfix]
```

But this does not work with `core.getInput` and there are no other `get` methods for this. Using `getMultilineInput` did not feel right, so I did not use it. But if you would wrap the brackets in quotes, it would be a string and could be read from `getInput`.

There's a downside to this approach: I have to do regex parsing. In this specific case, I had the idea to use the _one eyed fighting Kirby_ that I sometimes use in Vim to capture everything inside the brackets and remove the brackets altogether.

```ts
'[develop, hotfix]'.replace(/^\[(.*)\]$/, '$1'); // returns "develop, hotfix"
```

Now that I have a simple string that is just a comma separated list, I can just split it into an array.

At this point I started to write unit tests to check if every function I'm writing is actually doing what it should. The whole action is not too complicated, but it should be good practice to check the validity of your code as soon as you can.

## Calling the GitHub API

With every piece of the puzzle I need, it's time to write the function that actually updates the branch. After some checks like _is the branch that should be updated the same as the head?_ I had to call the GitHub API using the `octokit` variable I instantiated before. It's actually just five lines of code:

```ts title="mergeBranches.ts"
await octokit.rest.git.updateRef({
  ...repo,
  force,
  sha,
  ref: `heads/${branch}`,
});
```

Of course I checked the response statuses to display the correct information to the user which was also tested with unit tests.

## Testing the actual action

The cool thing is that it's possible to test your action within the action repo. I created a `develop` branch and checked if it updates if I push on `main`. And it does!

After publishing the action I then created a separate repo to test if works. I had some problems at first, because it could not find the correct version, but that was solvable.

Here is a config that works:

```yaml title="merge-branches.yml"
name: Merge branches

on:
  push:
    branches:
      - main

jobs:
  merge-branches:
    name: Merge main into develop
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Test Local Action
        uses: DerTimonius/merge-branches@v1.0.1
        with:
          token: ${{ secrets.GITHUB_ACCESS_TOKEN }}
          branches: develop
          force: true
```

## Conclusion

Let me be honest for a second: you probably don't need this. I wrote this action to solve a very specific problem I faced at work and might not even need outside of work.

But it was fun to write my first action! And knowing how to write them lowers the threshold of thinking about new ones. I have no ideas yet but I might come across the same situation again at some point - can't find it? Let's write it myself!
