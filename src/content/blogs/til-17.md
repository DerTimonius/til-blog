---
title: Advent of Code Week 2 - getting familiar with nom
pubDate: 2023-12-10
tags: ['advent-of-code', 'rust']
isDraft: false
relatedPosts: ['til-15']
description: Solving more Advent of Code puzzles, but most importantly getting to know how to parse string with nom
---

In my [last post](/posts/til-15) I wrote down the learning from the first three days of Advent of Code. The most important lesson I felt was to start using more external packages and especially to use `nom` for the parsing of the input.

## nom

[`nom`](https://crates.io/crates/nom) is a great tool to take a `&str`, split it up into separate parts and then do something with it. It provides a lot of different methods that can be used to achieve this like `separated-pair` that takes a separator and a parser for the two sides.

I don't want to write about nom long here, but I want to share a bit of code I used in day 4:

```rust title="main.rs"
fn parse_numbers(input: &str) -> IResult<&str, Vec<u32>> {
  let (input, numbers) = separated_list1(multispace0, parse_u32)(input)?;
  Ok((input, numbers))
}

fn card(input: &str) -> IResult<&str, Card> {
  let (input, id) = preceded(pair(tag("Card"), multispace1), digit1)(input)?;

  let (input, (winning_numbers, betting_numbers)) = preceded(pair(tag(":"), multispace1),separated_pair(parse_numbers, pair(tag(" | "), multispace0), parse_numbers))(input)?;

  let id = id.parse::<usize>().expect("should be a number");
  Ok((input, Card {id, winning_numbers, betting_numbers}))
}

fn parse_game(input: &str) -> IResult<&str, Vec<Card>>  {
  let (input, cards) = separated_list1(line_ending, card)(input)?;

  Ok((input, cards))
}
```

This code turns a line like `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53` into `Card {id: 1, winning_numbers: [41, 48, 83, 86, 17,], betting_numbers: [83, 86, 6, 31, 17, 9, 48, 53]}` which for me is pretty useable to do some logic with.

I used nom for every day now, even if it was not really necessary, just to strengthen my knowledge of it. The first time I used it, of course it took a long time to get where I wanted to. But each day the time I spent getting to a data structure I feel comfortable working with was less and less.

## Day 04

The first day I used an external package to parse the input. I want to be honest with you here: it took me two hours to just write the parser. But what I learned on this day was that once the parser is written, it's not really necessary to change the parser in some way. You just need to change the logic to get to the correct answer.

Part 1 was simple from a logic perspective - get the number of points for each card. I know that the calculation of points has to do with powers of two. But I did hardcode the points in comparison to the intersection of numbers because I had to start cooking. Life happens.

Part 2 was weirder for me because I did not understand what the puzzle wanted after reading it the first time. Maybe my brain was just like "what do you mean you do not get points for a scratchcard but only copies?" and refused to believe that this was the actual change. The adaptation of the logic was not too hard in the end.

## Day 05

I cheated on day 5. I had some ideas how to do this, was able to write the parser correctly, but I got stuck at some point. I grew frustrated more and more as time passed until I finally caved in and searched for solutions online. I learned things along the way, but the perfectionist in me was of course frustrated.

## Day 06

After the frustration of day 5, this was a charm. A simple parser, simple logic. I was happy to find a great solution to calculate the distance depending on the length of time the button is pressed.

Also, the change for part 2 was just a change of the parser (technically it wasn't even necessary to use nom here). Nothing to complain about here!

## Day 07

Another day of unnecessarily using nom, but it's just too much fun to use! Getting the sorting correct took me some time, but after a lot of trial error I ran out of incorrect ways and was able to find the solution!

## Day 08

My solution is very inefficient. I'm not good at working with graphs, I did not really had to get good at it before.

I decided to create Nodes with a `name` and `direction: {left, right}` field and combine the nodes in a Vector. Yes, a Vector. It was no problem for the first part, because it was going from one node to an end node.

But when I started with part 2 I quickly realized that this approach would not work. So I rewrote the logic to turn the Vector into a HashMap with the `name` field as the key and the `direction` as the values. This was much faster, but getting from the starting nodes (all nodes that end with an A) to the end (if every node we currently visit end with Z) takes a lot of steps. Like a lot a lot.

It takes so many steps that a `u32` to save the steps is too small! I did not expect that!

At some point I realized, that the brute force method is not the way to go. The best approach is to find the number of the smallest cycle per starting position and then calculate the least common multiple. Yeah, school maths was a long time ago, this idea did take some time...

## Day 09

This was pretty straight forward, after figuring out the initial parsing the only change in logic necessary was to find the first number instead of the last number of the sequence. The second part took me a bit longer than expected, at some point I noticed that I did the calculation in the wrong order (top to bottom instead of bottom to top).

## Day 10

I said it before, I'm not good at working with graphs. I'm also not very good at two-dimensional arrays.

And this was the worst possible combination for me. A 2D array with special characters to find a loop and calculate the farthest point. I was able to get the solutions for the basic cases, but was unable to find the solutions for the puzzle input. I did not have much time for refactoring, but I plan to do it later (when I'll find some time, probably next year).

## Learnings of the week

1. Switching to do better parsing with `nom` has paid dividends already. Once the parser is done, it's mostly not necessary to change it between part 1 and part 2. And even if it is necessary, changing the parser does not take a long time once you know how nom works.

2. I need to get better at working with two-dimensional arrays. Two of 10 puzzles so far used them and I realized that if the problem includes traversal or pathfinding in some way, I'm pretty lost.

3. I also need to get better at graphs. And I have to find better ways to think about them.
