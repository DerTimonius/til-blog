---
title: What I learned in 2024
pubDate: 2024-12-29
isFeatured: false
tags: ['misc']
description: It's time to look back at the last 12 months and check what I have learned
bskyPostId: 3legtq3k5zs24
---

export const prerender = false

2024 is over. Well, almost, in two days and one of the most challenging years for me is done.

But while it was challenging, I still learned a lot and across various fields. So, let's look back, shall we?

## Covid still sucks

I know that the topic is getting old, we are living with this disease for pretty much 5 years now, but for me, it has been more present than ever.

Last year in December, I got Covid for the second time and I had a pretty bad bronchitis. It lasted about one and a half weeks, but then it got better and I thought I would be done with it. Boy, was I wrong...

New Year's Eve I spent in the hospital because I was really short of breath and feared that I had a pulmonary embolism. I didn't thankfully, but it was a subtle foreshadowing for the year.

The next weeks I struggled a lot with being able to keep focusing on stuff, be it work, books, TV shows or whatever. And to add a cherry on top I was tired and fatigued all the time. There were still moments where I was short of breath for no apparent reason, so I pretty much had to stop doing any physical activity.

I tried going for my routine walks (3.7km, I normally took that route at least 3 times per week), but I just crashed and took a week to recover.

After some time I was diagnosed with Long Covid and the symptoms came and went in waves, but overall it plateaued and even worsened somewhat. Most noticable for me was not only the fatigue, but also the brainfog.

Man, the brainfog. I never really understood what I would actually be, even after learning about it in university I still only had a vague idea of what it feels like. And let me tell you, it is bad. I have always felt pride about being a quick thinker and being able to grasp difficult concepts faster than other people.

But with the brainfog, at its worst, I could not dissect the logic of certain conditionals when it has more than two checks. It just was not possible for me, it was as if my brain hit a brick wall which I could not pass, no matter how hard I tried.

And trying to learn new things was very, very difficult for me. Understanding why certain things work the way they do took longer and multiple learning iterations.

So, this year was tough. I had to learn to tone down my expectations in myself as it was just possible for me to do things the same way I did last year.

But, there is a silver lining:

1. in September/October, I was able to attend a 6-week rehab for Long Covid and while I am of course nowhere near to the old me, I can now go for shorter walks (which are still 2.6km) and I am pretty certain that the brainfog is gone. Just gone. I cannot exactly pinpoint the moment it left, but at some point I realized that certain logic is no longer a problem for me!
2. My boss is amazing. After telling him the issue at hand, there was no pressure from his side to deliver with the same pace as I did last year. Especially with me [having more responsibilities](#getting-up-the-ranks) this year, I am really grateful.

While this year has been tough, with the improvements of the last few weeks I am optimistic that next year things will improve. Be it my physical condition or me being able to focus for longer once again.

## Using Neovim as my main IDE

Last year, while switching jobs for a very short stint, I decided to learn Vim. The reason mostly was the necessity of being able to check and possibly change code in a production server where I could not use VSCode.

And of course it was more difficult than I had expected. I thought that it would pretty straightforward, but no. It took actually some training to not only get better and fast at using Vim, but to just be somewhat productive.

After some time, I tried Zed as my IDE with Vim mode enabled, but it didn't really click for me. So I spent some time looking into configuring Neovim to my liking. The good thing is that even though society praises individualism, we are all pretty similar. Using a popular distro as a starting point, with sane defaults and plugins that make sense, was a good idea.

With that, I was able to find other plugins that are not part of [LazyVim](https://lazyvim.org) and add them to my config.

And even if it took months to get faster than before, spending time to not only learn Vim but also taking the time to learn the configuration aspect of Neovim did certainly pay off in terms of productivity. Hell, there was a day in November, where I was able to hit 1700 lines of code in a workday.

There is still one thing and one thing only for which I still use VSCode: their merge editor. I have tried a few things like LazyGit (which is awesome), Fugitive, other diff tools or just in the raw file annotations, but to solve actual merge conflicts nothing worked for me the same way. If it were just `option A vs. option B`, those solutions would certainly work for me. But as a full-stack dev who works a lot with frontends, there are a lot of situations where the correct merging would be `some of A and some of B`. And this is where the merge editor of VSCode shines.

## Focusing more on the terminal

I think this was not really intentional and more a by-product of switching to Neovim, but I have spent a lot of time in the terminal this year. And with this I have also spent a lot of time looking for [awesome tools](/posts/til-28) that could boost my productivity.

I started by switching the terminal emulators. Started with [Warp](https://warp.dev) last year, switched to [Alacritty](https://alacritty.org), got to [Wezterm](https://wezfurlong.org/wezterm/index.html). What mostly drew me to these were the support for the Kitty protocol which makes it possible to render images in the terminal, which is pretty neat. I stuck with `Wezterm` as the configuration is written in Lua and Lua is pretty neat.

But this may change, I am testing [Ghostty](https://ghostty.org), the new cool kid in town. Maybe I'll switch, maybe I won't, we'll see.

I also started using terminal multiplexers: [Zellij](https://zellij.dev). The main reason I picked Zellij over tmux is that it appears to be easier to learn for beginners with the status bar at the bottom. Also there are sane defaults with some features that are missing in tmux.

There are also other tools that helped me a lot like `zoxide`, `fzf`, `atuin`, `lazygit` and many more, but since I [have already written about them](/posts/til-28), I will stop now.

## Getting up the ranks

Due to some circumstances like our senior developer going on educational leave and another colleague leaving, my list of responsibilities grew a lot this year. I had to start two different apps (a learning platform and an admin dashboard) with vastly different tech-stacks and started being responsible for the DevOps/infrastructure side.

And the DevOps side was most certainly where I have learned most from a technical point of view. Going from `I think I understand what this terraform/pulumi code does` to having to write the code yourself, from small adjustments to Github action workflows to complete overhauls and ending in the consolidation of an unnecessary microservice structure to a semi monolith (let's call it an `oligolith`), my skills in this domain have grown a lot.

I also had no chance but to get better at designing UIs. This has always been (and honestly still is) a big blind spot for me, but with my colleague who was the frontend dev of the team leaving, I had to level up my skills.

I am not necessarily where I would want to be, designing great UIs from scratch is still a bit of a daunting task for me, but I have gotten much better with CSS/tailwind to more quickly solve UI issues that already exist or to build a UI based on a given design.

Getting more responsibilities also means trying to find better solutions for specific problems: be it better data structures, alternatives for outdated packages and many more.

The fact that I met the expectations of my boss in this regard even with my Long Covid diagnosis does fill me with a sense of pride.

## Planning is key

In the last months, I started working as a freelancer after my full time job. While this is a great opportunity to learn more about other tech-stacks (for example Bun and Elysia (I love Elysia, especially in combination with Drizzle)), it takes some planning to fit everything in a workday.

This is of course not the only aspect that needs planning. At work, I have started multiple different projects that required me to come up with a good plan. Plan the database structure, the timeline, the smaller tasks necessary to finish the larger tasks.

And I want to be honest here: I was not really used to plan like this. Of course, back when I was working in the hospital, I did not really have to plan long-term, I just had to plan for the patient and the surgery at hand.

So spending a whole day doing nothing but thinking and drawing out a viable path to get a project done was not something I had done a lot, if at all. But after the last couple of months, I think I can safely claim to have more talent for it than I had previously expected.

## Building small CLI tools just for myself

When there were small productivity issues I felt like accumulating lots and lots of [dead git branches](/posts/til-32), I normally would have looked for an existing tool which could help me with this. But at a certain point I thought to myself `what if I just build it myself?`

Are those tools helpful for other people? Probably not. Did this stop me? No. And I think I will keep doing that in the next year.

## Wrap up

This year was tough. There is no way to deny that. But after writing done the other things I have done and the achievements of this year, I can be proud of myself.
