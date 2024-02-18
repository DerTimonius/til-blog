---
title: Uncovering valuable insight with git log
pubDate: 2023-10-23
tags: ['open-source', 'git']
isDraft: false
description: Working on a large codebase for the first time can be intimidating. If only there is a way to quickly scan the most important files...
---

Contributing to open source projects is a great way to learn about new technologies, explore different coding styles and strengthen your problem solving skills. But to get into it can be quite intimidating: you don't want to break things, you don't know where to start and where even is the file that will be the most important one to me right now?

Well, the most important file is for sure the `Contributing.md` file (or something similar) where you can find all the necessary information on how to setup your dev environment.

But the question of _what are the most important files in this codebase_ is something you will ask yourself often throughout your career as you will have to work with large projects and a lot of different files and subdirectories.

## Getting a quick overview

I recently started to work on a very large codebase. So large in fact, that the first thing I checked was how many files are in this codebase. A bit of shell magic helped me with that:

```sh
find . -type d -name "node_modules" -prune -o -type f | wc -l
```

Well, would you look at that! But how does it work?

- `find .` is a search command for the directory I'm currently in
- `-type d -name "node_modules" -prune` excludes the _node_modules_ from the counting of files
  - `-type d` defines the file type we want, in this case directory
  - `-name "node_modules"` defines the name of the wanted directory
  - `-prune` tells the `find` command to exclude the given directory
- `-o` allows to combine different search conditions
- `-type f` again defines the file type, in this case files
- `wc -l` counts the number of lines in the output, which corresponds to the number of files

After I ran the command, it showed me a staggering >2,800 files in a single directory. Okay, that's a lot to unpack, but where do I start? What are the files that have been changed most often and will likely be the most important ones?

## Leveraging `git log`

When learning `git`, one of the first commands you will learn (other than `add`, `commit`, `push` and `pull`) will probably be `git log`. It is used to check commit history, see commit hashes and much more. But you probably will not use it to its fullest potential, when it's combined with other powerful command-line tools.

You can use the following to get the most changed files in the commit history:

```sh
git log --pretty=format: --name-only | grep -Ev 'package\.json|yarn\.lock|package-lock\.json|\.test\.(t|j)s$' | sort | uniq -c | awk '$1 >= 100' | sort -rg
```

It's so long, that it doesn't even fit into the box here... Let's break it into smaller chunks where it is piped:

```sh
# git log --pretty=format: --name-only
# grep -Ev 'package\.json|yarn\.lock|package-lock\.json|\.test\.(t|j)s$'
# sort
# uniq -c
# awk '$1 >= 100'
# sort -rg

```

What does each part of this command do exactly?

- `git log`, as described before, is used to review the commit history
  - `--pretty=format:` defines the format of the output. In this case, it will be empty!
  - adding `--name-only` then only shows the file names that were affected with each commit
- `grep` can be used to search text using regex
  - `-E` or `--extended-regexp` is used to enable extended regex
  - `-v` or `--invert-match` then selects non-matching lines
  - `'package\.json|yarn\.lock|package-lock\.json|\.test\.(t|j)s$'` is the regex to filter the files: I'm not interested in the `package.json`, lockfiles like `yarn.lock` or `package-lock.json` and test files. I wasn't sure if the files were Javascript or Typescript, so I added the file ending for both
- `sort` well, sorts the output alphabetically
- `uniq` removes the duplicate lines of the output
  - `-c` or `--count` counts the occurences and prefixes each line with that number
- `awk` is a tool for pattern scanning and processing
  - `$1` refers to the first field of each line, in our case the number of occurences
  - `$1 >= 100` selects the lines where the occurences are greater or equal to 100 (an arbitrary number, I had to start somewhere)
- `sort` again
  - `-r` or `--reverse` sorts in reverse order
  - `-g` or `--general-numeric-sort` tells the function to treat the numbers as integers, not as strings

Using this, I was able to gain insights into the parts of the codebase that will impact my work with it.

## Sorting twice

You may have noticed that we are sorting the output twice. Why is that?

You could omit it, it wouldn't really change anything of the outcome. But building this command, you might think about it in this way:

> Okay, I got a lot of files now, that are unordered. Can I sort this is any way to count them up?

For the computer, it makes no difference if they are sorted alphabetically or not when it gets to the `uniq -c` part, but for you as a programmer it could help understand what to do next!

## Using `head` instead of `awk`

If you're not interested in all files that have been changed at least a certain amount of times but want to get a fixed number of files, you can easily do that by removing the `awk` command and replacing it with `head -10` or any number that you like.

## Conclusion

This trick helped me a lot when diving into a large codebase for the first time - getting a quick overview of what's important. Hopefully, you will now also start using this command! And if not, maybe you will start to build you own unwieldy commands to check for various things. You will certainly learn a lot!
