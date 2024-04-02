---
title: Mental Health, Open Source and the xz backdoor
pubDate: 2024-04-02
tags: ['open-source', 'mental-health']
isDraft: false
description: Open source maintainers are under a lot of stress. The xz backdoor and its social engineering to execute it showed us the possible repercussions.
---

Last week, the discovery of the [xz backdoor](https://www.openwall.com/lists/oss-security/2024/03/29/4) was the story in the world of open source development. While it is actually fascinating with a lot of opportunities to learn new things about compression and shell scripting, I don't want to talk about the technical details of this exploit, there are many [better](https://www.youtube.com/watch?v=LaRKIwpGPTU) [sources](https://gynvael.coldwind.pl/?lang=en&id=782) [for this](https://gist.github.com/thesamesam/223949d5a074ebc3dce9ee78baad9e27#faq-on-the-xz-utils-backdoor).

I want to focus more on the human side of the story. How the attacker (or attackers?) used social engineering strategies to exploit a vulnerable maintainer of a popular package to gain access to the repo. How the maintainer was left alone with his struggles. And how we as a community can help maintainers of open source packages.

![relevant xkcd comic: large tower of small blocks, with a singular smaller block in the bottom right annotated with "a project some random person in Nebraska has been thanklessly maintaining since 2003"](https://imgs.xkcd.com/comics/dependency.png)

## A maintainer struggles

It all started with a comment that a lot of devs might have seen before in some open source packages on GitHub:

> Is XZ for Java still maintained? I asked a question here a week ago and have not heard back.

Taken at face value, it might seem innocuous - here's a user of your package and they want to know if the package is still maintained. Of course if you find a bug in the code you want to know if it's still worked on.

But this was not the only xz package that received comments like this. The original author, Lasse Collin, wrote back and stated that he's aware of the backlog and that he struggles with mental health issues (among other things).

And still, multiple people kept going at him, telling him to step down or at least get another maintainer to either of his xz packages. Lasse did the latter and reminded others of a crucial thing:

> It’s also good to keep in mind that this is an unpaid hobby project.

Sadly, as much as this is true, the "community" keeps forgetting this. Especially if you need the package for work-related projects, a bug might be very important to you if it's holding you back. But your problem does not justify harassing the maintainers, who could have issues on their plate unbeknownst to you. They do not owe you anything, they provided their work to you for free.

I might not part of the open source community for a long time nor do I maintain a popular package, but I am no stranger to doing stressful work. Working 25h shifts and dealing with unruly coworkers is still a thankless job situation, even if the job itself is highly regarded.

So, what did the new maintainer do? They helped Lasse. They started in 2022 and became a maintainer in early 2023. And in the last few weeks, with Lasse on vacation, they decided to pull the trigger on one of the best obfuscated exploits of the last years that was only discovered by coincidence.

## Mental health struggles

The big problem of successful open source project is that the number of users quickly outgrows the number of maintainers. Anthony Fu recently [wrote a great article](https://antfu.me/posts/mental-health-oss#capacity) where he described how he underestimated the amount of work it takes to maintain a big project. This certainly is also the case if the maintainer is not a full-time open source dev like Anthony or Sindre Sorhus. Juggling work projects and your open source projects can be stressful.

I can imagine that if you accept money through sponsorships on GitHub or OpenCollective or polar.sh or Patreon or anywhere else, you tend to feel obligated to fulfill the needs of _your_ community. Some might even feel this way without any sponsors. Having additional financial issues only contribute to the stress of doing "unpaid" work.

In an [article he published a few months ago](https://www.joshuakgoldberg.com/blog/2023-in-review/#living-wage-in-open-source), Josh Goldberg shared his income in 2023 as a full-time open source dev. As an active maintainer of a lot of ESLint related packages (among other things, he's doing an awesome job!), he most certainly makes more money doing OSS than other full-time open source devs. But in an interview with the [DevTools.fm podcast](https://www.devtools.fm/episode/66?view=SHOW%20NOTES), even he mentioned the stress he's under doing open source full-time.

## Care for your maintainers

The upside of the xz backdoor is, at least in my opinion, that the open source community now knows about this attack vector. Hopefully comments and issues like _Is this package still maintained?_ will happen less often and even be discouraged by other community members.

Maybe it's time to ban behavior like this more rigorously and put it into the Code of Conduct. You want to use this package? Great, here ya go, but don't expect maintainers to answer all of your issues in your desired period of time.

More people might also now be incentivized to sponsor more maintainers of packages they use. When you're part of the community, you will recognize some names being around everywhere. Why not throw some bucks at them? Successful companies, in my opinion, should also be required to pay maintainers of open source packages they use. It's very unlikely that they build everything in house, so they do rely on the package. It's just fair to compensate devs that indirectly paved the way to your success.

But money isn't the only issue - maintainers also desperately need better support structures. We should look at setting up mental health services, mentorship programs, collaborative code review processes - anything to help diffuse some of the intense pressure they face. Nobody should have to burn themselves out just to keep vital software alive.

At the end of the day, open source belongs to all of us. We can't just leave this life's-blood of software to a handful of overworked heroes. Rethinking how we fund, secure, and maintain these public resources needs to become a top priority, before more disasters strike.

I want to share a quote with to end this post. It is coined by Dylan Marron in his great (but sadly discontinued) podcast [Conversations with people who hate me](https://www.dylanmarron.com/podcast).

> Remember there's a person on the other side of the screen!
