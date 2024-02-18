---
title: Using git bisect to find the one bad commit
pubDate: 2023-10-26
tags: ['git']
isDraft: false
isFeatured: true
description: Commits may break things. But you might not notice it right away and push more commits. With git bisect you'll find the bad commit in no time.
---

_Move fast and break things_. The official motto of Facebook until 2014 (it's now _move fast with stable infrastructure_). While developers try a lot locally, we tend to not commit a change if there are some obvious errors. But not all errors are obvious, which is a point where tests come in handy. And tests and test-driven development is great, but some errors still may slip through.

Let's imagine: you're working on a large project, with separate teams of at least 5 devs, and suddenly production is down. The problem: the last commits were made pretty much simultaneously and there is no obvious way of telling which commit broke everything.

Now it's up to you to play detective and find out where the error is coming from.

## Using the tools you're familiar with

`git` is a very powerful tool, pretty much like a swiss army knife. And just like a typical swiss army knife, you will most likely use the same set of available tools and leave others aside without thinking about them too much.

So, your first instinct may be to find the one file that caused the error. But (just for the fun of it) let's say the codebase is huge with over 10k files and although you are able to narrow it down to a certain section, there are still too many files to check manually.

Maybe `git log` and/or `git blame` are great tools that could help. Especially if you have an idea of what the commit message might have been, `git log -S <string>` can go a long way.

So, you spend a lot of time going through every file of every commit, look at all the changes that were made to track down the introduced error. In large projects, this will probably take a very long time.

## Binary search

Before we get to the fastest way to find the culprit, we have to take a quick detour and talk about `binary search` with the typical use case when explaining this algorithm: finding the index of a certain value in a sorted array.

The "standard" way of finding the index would be to start looking at the start of the array and traverse it one by one until you find the correct number or until you reach the end. This works, but with a asymptotic notation of `O(n)` it could take a very long time for very large arrays.

A better way is `binary search`: check the middle value and compare it against the search value. If it's correct, great, you found it! If it's larger: repeat with the array now ending at the middle value. And if it's smaller, the array now starts at the middle value.

```ts
const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const target = 13;
```

In this example, the first search would check against the number `11` and then continue in the right half of the array. It will keep going until it either finds the correct value (where it would return the index) or if the starting index is the same or larger than the ending index (where it would return `-1`).

Here is a recursive implementation of the `binarySearch` in Typescript that works in `O(log n)`:

```ts
function binarySearch(
  arr: number[],
  val: number,
  low: number,
  high: number,
): number {
  if (low >= high) {
    return -1;
  }

  const middle = Math.floor(low + (high - low) / 2);
  const middleVal = arr[middle];

  if (middleVal === val) {
    return middle;
  } else if (middleVal > val) {
    return binarySearch(arr, val, low, middle);
  } else {
    return binarySearch(arr, val, middle + 1, high);
  }
}
```

## `git bisect`

You might wonder, why this little detour? The commit history in git is not unlike a typical array ([JS array, that is](/blog/til-2)). You can now perform a binary search on the array with the last known "good" commit and the latest commit as a bad commit.

And this is exactly what [`git bisect`](https://git-scm.com/docs/git-bisect) does: by defining a bad and a good commit, it narrows down the breaking commit by halving the array in every step.

Let's try this:

1. Create a playground directory with git initialized:

```sh
mkdir git-playground
cd git-playground
git init
```

2. Run the following commands to add the first numbers of the fibonacci sequence to text file and commit after every number:

```sh
echo fibonacci >> main.txt
git add main.txt && git commit -m "Start with fibonacci sequence"
echo 1 >> main.txt
git add main.txt && git commit -m "add 1"
echo 1 >> main.txt
git add main.txt && git commit -m "add next 1"
echo 2 >> main.txt
git add main.txt && git commit -m "add 2"
echo 3 >> main.txt
git add main.txt && git commit -m "add 3"
echo 5 >> main.txt
git add main.txt && git commit -m "add 5"
echo 9 >> main.txt
git add main.txt && git commit -m "add 9"
echo 13 >> main.txt
git add main.txt && git commit -m "add 13"
echo 21 >> main.txt
git add main.txt && git commit -m "add 21"
echo 34 >> main.txt
git add main.txt && git commit -m "add 34"
echo 55 >> main.txt
git add main.txt && git commit -m "add 55"
echo 89 >> main.txt
git add main.txt && git commit -m "add 89"
```

3. Take a look at the file and see that there is a mistake (it should be `8` instead of `9`):

```sh
cat main.txt
# fibonacci
# 1
# 1
# 2
# 3
# 5
# 9
# 13
# 21
# 34
# 55
# 89
```

4. Start the bisect session with `git bisect start`
5. Since we know that the current version is wrong, call `git bisect bad`. This sets the current commit as the the end of the test array.
6. To set the start of the array, call `git bisect good <commit>`, you'll have to get the commit hash with `git log` before.
7. Now we get to the commit in the middle of the array. Call `cat main.txt` again and check if the output is correct:

```sh
cat main.txt
# fibonacci
# 1
# 1
# 2
# 3
# 5
```

8. Looks good, tell git by calling `git bisect good`. Check the outcome:

```sh
cat main.txt
# fibonacci
# 1
# 1
# 2
# 3
# 5
# 9
# 13
# 21
```

9. There's an error, so `git bisect bad`.
10. Repeat until git find the first bad commit. You'll end up with something like this:

```sh
git bisect bad
# 0b294c5b5e0cff6ea078133a03b961c9c13b31e8 is the first bad commit
# commit 0b294c5b5e0cff6ea078133a03b961c9c13b31e8
```

11. You need to end the session with `git bisect reset`.

## Conclusion

You now found the first bad commit! It's up to you what you will do with that information, but you saved a lot of time by following this approach. You could even start the session with one command if you follow the examples in the [git bisect docs](https://git-scm.com/docs/git-bisect#_examples).

Owning a swiss army knife is great. Knowing how to use it is better. And now you know how to use a very useful tool in the swiss army knife that is git!
