---
title: Digging deep into CLI tools
pubDate: 2024-07-16
tags: ['cli', 'tools']
isDraft: false
isFeatured: false
description: How getting familiar with various CLI tools helped me feel at home in the terminal
---

In the last couple of months I have switched my editor from VS Code to Neovim (yes, really, my [blog post](/blog/til-26) was the actual representation of my feelings during that process) and have switched to try to do pretty much everything in the terminal.

I have also spent a lot of time finding various CLI tools that helped me with this transition and also boosted my productivity quite a bit.

In this post, I want to share some of those tools and how I use them.

## Warp vs. Alacritty

Let's start with the terminal emulator. As the built in terminal emulator on Mac is not great, one of the first things to do is to find an alternative.

For me, I have found two different options that make sense: [Warp](https://warp.dev) and [Alacritty](https://alacritty.org). Both have their strengths and weaknesses and depending on my mood I can be found using one more than the other.

### Pros of Warp

Warp is very batteries included: it allows for the creation of multiple tabs and panes, has built-in autocompletion and suggestions (similar to [Fig](https://fig.io) (rip Fig)).

But the feature that I was pretty surprised by is the Warp AI. I normally don't care about built-in AI features, but I think it's pretty nice: I can describe what command I am looking for (e.g. get a sorted list of authors of the git commits) and it suggests a command.

Of course you have to be careful when running commands without knowing what it does, but when I am unsure what the correct command is it is actually pretty useful.

Another thing that I like more than I should is the option to click into a command before running and editing it quicker than with arrow navigation.

There are also other features like workflows or knowledge sharing that I haven't explored.

### Pros of Alacritty

Alacritty is pretty much the opposite: no batteries included at all, but extremely customizable with one of the greatest configuration languages, TOML.

I feel that Alacritty is a bit faster than Warp in the start-up time and uses less resources, so that's always a nice thing to have.

But since Alacritty is pretty bare-bones at the beginning, I had to extend it in some way.

## zellij

The first thing I needed was some sort of a terminal multiplexer. While Warp can do it without problems, it's not so easy with Alacritty.

I did look into the og multiplexer, [tmux](https://github.com/tmux/tmux), but I did not really want to learn new keybindings, especially while learning vim bindings.

So after some research I stumbled upon [zellij](https://zellij-org.github.io) which achieves similar things and seems to be a bit easier to get started with.

The configuration is done in `.kdl` files and you can pretty simply easily define different layouts that you can use. For example, here is what I am currently using as a standard:

```
layout {
    pane size=1 borderless=true {
        plugin location="tab-bar"
    }
    pane split_direction="vertical" {
        pane size="80%"
        pane split_direction="horizontal" {
            pane
            pane
        }
    }
    pane size=2 borderless=true {
        plugin location="status-bar"
    }
}

```

This opens a single tab with three different panes, the left will be for nvim, the right ones will be for the server and for tests or running other commands.

Switching between the panes, creating new ones, resizing and creating new tabs is also pretty straight-forward. I sometimes forget to lock the interface while coding and am wondering why `<C-n>` is not working correctly as zellij switches to the resize mode, but that will get better from time to time.

While I could also use zellij in Warp, I think I will only use it in Alacritty for the foreseeable future. But since I actually think that the keybindings in Warp kind of unintuitive, I might prefer zellij in the long run.

## atuin

[atuin](https://atuin.sh) is an interactive shell history tool that extends the functionality of the up arrow in the terminal.

You can search the history interactively and either run it directly or just paste it to the terminal and edit the command if necessary. It also provides interesting insights like overall stats (which commands are you using the most) or individual stats (what's the typical status code, when do you run it most often, how long is it running etc.)

I haven't been using it for long, but I am pretty sure that it will become a tool I don't to miss after a very short period of time.

A downside is that it does not work in Warp, which has a similar concept where you can start typing a command, press up and the command history is filtered to only those commands that start with what you typed so far.

## zoxide

[zoxide](https://github.com/ajeetdsouza/zoxide) is the better `cd` command. It stores the directories you have visited in the path and matches your input to the latest entry, regardless of your current working directory.

In my coding directory, I have three different subfolders for example, to keep things separate and more clear:

- `projects/`
- `job/`
- `opensource/`

Now if I finish my day job and want to do something different like writing this blog post, I can simply run `z til-blog` and I can get started. And I could even run `z til` and zoxide would still know where to go.

After some time (meaning a day or so) I added an alias to my `.zshrc` and mapped `cd` to `z`, a great addition to my toolset.

## lsd

Similar to zoxide, [lsd](https://github.com/lsd-rs/lsd) aims to improve an existing command: `ls`. Don't get me wrong, `ls` is great, but `lsd` takes it a step further.

It adds icons to the output, visually distinguish between normal files/directories and symlinks, has integrated `--tree` support.

I have grown accustomed to its output so fast that I'm actually missing it when I have to ssh into a live server.

## fzf + fd = ❤️

[fzf](https://github.com/junegunn/fzf) is a wonderful tool for fuzzy finding basically everything you want. The basic `fzf` command runs `find` in the current working directory and you can interactively search for entries. Because it's returning the path of said file, you can than use the output and pipe it to a different command.

I created an alias that allows me to search for a specific file in my coding directories and then opens them in nvim:

```sh copy
alias inv='nvim $(fzf --preview="bat --color=always {}")'
```

In combination with bat I can see the content of the file while typing the file name with syntax highlighting using `bat`.

But the usage of fzf is not bound to files, you can pipe whatever you want to fzf. Let's say you have a lot of git branches and you're not quite sure what branch you are looking for. You can simply leverage the following command (and maybe creating a new alias for it):

```sh copy
git switch $(git branch | fzf)
```

fzf is quite customizable, can also be used as a fuzzy finder of your shell commands (if you don't want to use something like atuin).

I also combined it with [fd](https://github.com/sharkdp/fd), which is a more extensible `find` that automatically ignores all gitignored files (if there is a .gitignore in the directory you are searching), so that the default fzf command finds files in my coding directories no matter in which directory I am currently in.

It is also used in a lot of neovim distros alongside telescope to quickly switch between files.

## lazygit

I like git. I also never wanted to grow accustomed to the built-in git UI in VS Code, so I always run all commands in the terminal.

Well, almost. There are a few things that VS Code does impeccably good: nice diffing and a really great merge conflict editor. Of course, smaller merge conflicts are not too bad to do without, but the editor can really speed up the conflict resolve.

The problem is that the git CLI, while very powerful, has some downsides. `git diff` can easily become unreadable, viewing your stash can be cumbersome.

Enter [lazygit](https://github.com/jesseduffield/lazygit). I actually found it when getting started with LazyVim as it was one of the suggested tools to use (alongside `fzf`).

Lazygit describes itself as the git UI for lazy people - and it does take a lot of memorizing git commands of your shoulders. But to be honest, what sold it for me was not the ease of adding files to the staging area, or committing the files or simply pushing to remote from within the UI.

What actually sold it for me were two things: the resolving of merge conflicts is pretty intuitive. And you can quickly view what you have added to your stash.

The fact that it has a great nvim integration is just the cherry on top.

## Honourable mentions

There are so many tools that I could write about, but I have to stop somewhere. Nonetheless I would be amiss to not mention the other tools I have grown to like in the last few weeks.

- [git-delta](https://github.com/dandavison/delta): syntax highlighting and a more comprehensive layout for `git diff`
- [bat](https://github.com/sharkdp/bat): the nicer `cat`
- [lazydocker](https://github.com/jesseduffield/lazydocker): it's lazygit, but for docker
- [ohmyposh](https://ohmyposh.dev/): a theme engine for the prompt (my powerlevel10k substitute)

Using the terminal for pretty much everything I do did slow me down in the beginning. But it did not take long until I felt comfortable enough to speed up in using all of those tools to get quicker and more productive. Can't wait to find more great tools. Or maybe I have some ideas myself to create a new tool, who knows!
