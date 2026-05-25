---
title: How to check changed files and comments in Github Actions
pubDate: 2026-05-25
isFeatured: false
tags: ['github-actions']
description: Leverage the gh cli without the need of using external actions to get what files changed and what comments were made on a pull request
---

Recently, I had to add a step to our CI checks of our monorepo at work, which takes some time and is run at pretty much every push. But logically, there is no reason to run the tests for the backend if only the frontend has changed.

I have used external actions from the Github Actions marketplace in the past, but the recent amount of supply chain attacks left me a bit wary, so I have removed the blinders and tried to implement this myself.

## Changed files

The first thing I wanted to check is which files have changed in the PR. While thinking about this proble, I remembered that you can use the `gh` cli in the actions.

I am using `gh pr diff` sometimes for a quick check of the changed code when not reviewing a PR, after looking at the docs, I found that there is a `--name-only` flag. As the name suggests, this returns a list of file names.

```sh
gh pr diff <pr-number> --name-only
```

Now I have to figure out the number of the PR, but luckily there is a helper in the yaml github object we can use.

```yaml title="quality.yaml"
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      id: files-changed
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"
```

Next step is to figure out which files did change. There are probably better ways, but I opted to go for grepping the files list and counting the lines with `wc -l`.

```yaml title="quality.yaml" magic-move-before={1-9} magic-move-after={10-22} hide-badge
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true'
        fi
```

Trying to push this will lead to the actions throwing an error though. There needs to be a `GH_TOKEN` set, but we can use `github.token`

```yaml title="quality.yaml" magic-move-before={1-13} hide-badge magic-move-after={14-28}
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true'
        fi
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ github.token }}
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true'
        fi
```

Since we want to use this check in other jobs of this `quality.yaml` file, we have to define the output it produces. The step needs an `id` and also, we have to redirect the echoed output to `GITHUB_OUTPUT`. Lastly, we have to add the `outputs` field to the yaml structure.

```yaml title="quality.yaml" magic-move-before={1-15} hide-badge magic-move-after={16-33}
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ github.token }}
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true'
        fi
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ github.token }}
  outputs:
    frontend: ${{ steps.files-changed.outputs.frontend }}
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      id: files-changed
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true' >> $GITHUB_OUTPUT
        fi
```

In the end, this can of course be expanded to check other paths as well if necessary.

```yaml title="qualit.yaml"
files-changed:
  name: Check changed files
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ github.token }}
  outputs:
    frontend: ${{ steps.files-changed.outputs.frontend }}
    utils: ${{ steps.files-changed.outputs.utils }}
  steps:
    - uses: actions/checkout@v6

    - name: Check changed files
      id: files-changed
      run: |
        files="$(gh pr diff ${{ github.event.pull_request.number }} --name-only)"

        if [[ $(echo $files | grep -E 'apps/frontend/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'frontend=true' >> $GITHUB_OUTPUT
        fi

        if [[ $(echo $files | grep -E 'packages/utils/.*\.tsx?' | wc -l) -gt 0 ]]; then
          echo 'utils=true' >> $GITHUB_OUTPUT
        fi
```

## Checking for specific comments

Just testing for the changed files was not enough for me. Sometimes you might be pushing a work in progress PR where you already know that the CI checks will fail, so there is no reason to let them run in the first place.

How about we add a check for a specific comment like `/run-tests` and only let them run if this comment is present? And is it possible to stop the tests at any point by leaving a `/stop-tests` comment?

We can again use the `gh` cli, this time with the `view --comments --json <fields>` command. If you look at the gh docs again, you will also see that there is a `--jq` flag, allowing you to parse the given json with `jq` commands.

In the end, I ended up using the following command to get the `/run-tests` command:

```sh
gh pr view \
  --json body,comments \
  --jq '
    (([.body] + [.comments[].body])
    | reverse
    | map(select(test("/(run|stop)-tests")))
    | first) // ""
    | test("/run-tests")
  '
```

Before we go through the `jq` commands, quick word on why we need both `comments` and `body` as json fields. Github treats the intial PR comment as the PR body and since I want to be able to greenlight the tests from the very beginning of the PR, I need to include the PR body in the json.

Let's talk about the [jq commands](https://jqlang.org):

- `([.body] + [.comments[].body])`: this transforms the given json to only include the body of the comment with out metadata
- `reverse`: as the name suggests, this flips the array of comments
- `map(select(test("/(run|stop)-tests")))`: this filters the comments to only return ones with either `/run-tests` or `/stop-tests`
- `first`: this only takes the first comment in the list
  - you can see that the four commands are actually wrapped in parentheses with a `// ""` at the end. this is necessary in case there is no comment with `/run-tests` or `/stop-tests` in the body, as the next command would fail and jq would exit with a 1 status code.
- `test("/run-tests")`: returns a simple boolean if the last comment allowed the tests to be run

Now let's put this into our `quality.yaml` and see how that works correctly.

```yaml title="quality.yaml"
run-tests:
  name: Check for test comment
  runs-on: ubuntu-latest
  outputs:
    result: ${{ steps.check-comment.outputs.result }}
  env:
    GH_TOKEN: ${{ github.token }}
  permissions:
    contents: read
    pull-requests: read
  steps:
    - uses: actions/checkout@v6

    - name: Check comment
      id: check-comment
      run: |
        result=$(
          gh pr view ${{ github.event.pull_request.number }} \
            --json body,comments \
            --jq '
              (([.body] + [.comments[].body])
              | reverse
              | map(select(test("/(run|stop)-tests")))
              | first) // ""
              | test("/run-tests") 
            '
        )
        echo "result=$result" >> $GITHUB_OUTPUT
```

When compared to the other action, there is one thing you need to consider here: we need to specify the permissions that this action has, otherwise it will fail due to not being able to read the PR comments.

## Consuming the outputs

With everything returning the correct output, it's time to put them to use. Let's say we have the following job:

```yaml title="quality.yaml"
e2e-test:
  name: End to end tests
  runs-on: ubuntu-latest

  steps:
    - uses: actions/checkout@v6

    - name: Set up Node
      uses: actions/setup-node@v6
      with:
        node-version-file: '.node-version'

    - name: Setup pnpm
      uses: pnpm/action-setup@v6
      with:
        cache: true

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Setup containers
      run: pnpm db:up

    - name: Reset database
      run: pnpm db:reset:ci

    - name: Install browser
      run: pnpm exec playwright install chromium

    - name: Run servers
      run: pnpm dev & sleep 5

    - name: Run e2e tests
      run: pnpm test:e2e
```

Depending on the number of e2e tests, this can take 10 minutes or longer, and we are not even testing against a production build (as the docs suggest).

By adding both jobs to the `needs` section, we can use them in an `if` statement so that the tests only run if the frontend (or the utils package) has changed and if the `/run-tests` comment has been added somewhere.

```yaml title="quality.yaml"
e2e-test:
  needs: [run-tests, files-changed]
  if: ${{ needs.run-tests.outputs.result == 'true' &&
    (needs.files-changed.frontend.quicksource == 'true' || needs.files-changed.outputs.utils == 'true') }}
  name: End to end tests
  runs-on: ubuntu-latest

  steps:
    - uses: actions/checkout@v6

    - name: Set up Node
      uses: actions/setup-node@v6
      with:
        node-version-file: '.node-version'

    - name: Setup pnpm
      uses: pnpm/action-setup@v6
      with:
        cache: true

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Setup containers
      run: pnpm db:up

    - name: Reset database
      run: pnpm db:reset:ci

    - name: Install browser
      run: pnpm exec playwright install chromium

    - name: Run servers
      run: pnpm dev & sleep 5

    - name: Run e2e tests
      run: pnpm test:e2e
```

## Conclusion

With a few simple `gh` commands and a bit of bash/jq, we can now define which file changes trigger any subsequent job and that we have to leave a `/run-tests` comment to greenlight the tests.
We can also stop the tests again with a `/stop-tests` comment, which can be useful for stacked PRs where you might have to restack the whole thing and you don't want to run the tests in the middle of the stack.

One thing to mention is that after you leave a `/run-tests` comment, the tests will only run on the pushes afterwards, leaving the comment will not trigger the workflow by itself with this configuration.
