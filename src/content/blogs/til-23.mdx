---
title: Tagging e2e tests to reduce wait time
pubDate: 2024-03-12
tags: ['testing', 'web-dev']
isDraft: false
description: While testing your code is a great thing, useless end-to-end testing can be cumbersome. Here's how I leveraged tags to only run certain tests in PRs!
---

In the world of software development, there will always be two kinds of people: light mode vs. dark mode. Hating JavaScript vs. using JavaScript anywhere you can. TDD vs. YOLO.
Especially discussions between the last duo can become pretty heated: do you test all of your code or do you just hope for the best (and test manually, let's be fair)?

Technically, I'm very much a fan of TDD (test driven development), but more often than not, I don't test my code with unit tests. I am on the other hand much more of a fan of integration or end-to-end (_e2e_) tests.
Knowing that certain features of the application I'm working on are not breaking when changing things is pretty great.

## The downside of e2e tests

But there's an issue. Running a lot of tests takes a long time - locally and in the CI checks for PRs. Of course they will finish much faster locally as the test-runner in the CI has to spin up first, dependencies have to be installed, servers have to start and so on.

But at work running all tests results in 20 minutes of waiting until the tests are finished. And because we try to add a new e2e test for every new feature we build, the times accumulate.

Not only is it pretty annoying to have to wait for so long to check if the tests are passing in the CI, but also we have to take the externalized costs of how much CO2 are we emitting for these tests into consideration. Especially if there are opportunities to reduce some of those emissions and your changes have no chance to break certain features or tests because they did not touch any of the related code.

## Playwright tags

With the release of `v1.42.0` [Playwright](https://playwright.dev) introduced the concept of adding **tags** to your tests and then filtering them in the command.

```ts title="navigation.spec.ts"
test('simple navigation test', { tags: '@navigation' }, async ({ page }) => {
  // ...
});
```

If you now want to test only the tests with the `@navigation` tag, you run the following command:

```sh
pnpm exec playwright test --grep @navigation
```

Using `--grep-inverse` does the exact opposite of `--grep`, running only the tests without the specified tag. Of course it's possible to add more than one tag to a test and to the command itself. But leveraging this will give you flexibility to only run certain tests and saving time in the process.

## Adding tags to the CI

To also reduce the waiting time in the PRs for the tests to finish, I added a specific tag to certain, most important tests on essential functionalities that should never fail. In the code that handles the Github workflow, I added the correct command that only runs in PRs. I also added a different command that runs all tests, but only on merge to the main branch.

But what happens if you want to run the other tests as well? After spending some time in the Github docs, I noticed that the labelling of PRs also triggers workflows. I could use this and then run a specific subset of the tests. But how?

I came up with a great idea: _what if the tests run only when certain labels are used on the PR?_ So I created labels that look like `tests: @navigation` and many more. Now I had to figure out how I could actually use the information in the label.

It took some time, but then I was able to write the following lines of code:

```yaml
     - name: Get label name
        id: get_label_name
        run: |
          label_name="${{ github.event.label.name }}"
          tag="@${label_name##*@}"
          echo "tag=$tag" >> $GITHUB_OUTPUT
```

As the `run` command is just bash, you can write a small bash script for this. So, what does this code do?

- First the name of the label that has been added is saved in the variable `label_name`
- Next, I parsed the label with `"@${label_name##*@}"` which takes all characters of the string saved in `label_name` up to and including the `@`. But I also need that, so I readd it in the front of the tag
- Lastly I save `tag=$tag` to the Github output, this way I can use it later

This code only runs if the added label starts with `tests:`. After other code that starts the server, I use the tag with the following code:

```yaml
- name: Run tagged tests
  run: pnpm exec playwright test --grep ${{ steps.get_label_name.outputs.tag }}
```

Now only the tagged tests run and the average wait time for the tests to finished has been reduced by 50%!

## Isn't that unsafe?

One could make the argument that reducing the number of running tests will also reduce the test-coverage of your code/features. And I agree. But what's the purpose of aimlessly running the tests for our chat feature that take 2 minutes, when the changed code only changes elements in the homepage and does not touch the chat at all?

If you make changes to specific features, you simply add a label to the PR and the tests will run. And all tests will always run when the PR is merged (which does not trigger an automatic release), so a failing test would be caught in this moment.

But because I personally try to run the tests locally before opening the PR, I don't really see this as an issue. You should prioritize testing by focusing on essential functionalities that must be tested every time, while addressing secondary scenarios only as needed. Or in simpler terms:

> Test what you must every time. Test what you should when you need to.
