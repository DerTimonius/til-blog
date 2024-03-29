---
title: Revisiting sorting algorithms
pubDate: 2023-11-03
tags: ['computer-science']
isDraft: false
description: From Bubble to Quick, unraveling the magic of sorting data efficiently.
---

import Aside from '~/components/Aside.astro';

Sorting algorithms are among the first things you learn if you start taking algorithm classes/courses. I learned them some time ago, but with most knowledge that is not used regularly it's doomed to be forgotten. That's why I decided to revisit them and refresh my knowledge.

<Aside>
  I also want to start playing with `Rust` a bit, so this is a great way to get
  into a new language. Therefore, I will write my examples in Rust and either
  Python or TypeScript.

Also, I know that the term `array` may be incorrect technically, but I will still use it here.

</Aside>

## What are sorting algorithms?

At some point during development, it's necessary to sort an unsorted array from lowest to highest. You could of course use built-in functions, but where's the fun in that? If you want to learn these algorithms yourself, the best way to train this is to sort arrays of numbers.

Speaking of built-in functions: it's not really known what algorithms are used in the Javascript version of `sort`, because it's up to the implementation in the browser or the V8 engine what algorithm they want to use. In practice, it's most likely a variation of quicksort or mergesort. Some engines switch between algorithms based on the type and size of the array being sorted, as well as other factors to balance performance and efficiency.

What's great about learning sorting algorithms is that you gain knowledge in recursion and asymptotic notation.

### Recursion

One of the best easter eggs on Google can be found if you look for recursion. I won't give it away, try it out yourself, but to sum up you will actually learn how recursion works!

A recursive function is a function that calls itself (with a different parameter or you'll get a stack overflow).

```ts
function factorial(n) {
  if (n === 0) {
    return 1;
  }

  return n * factorial(n - 1);
}
```

Recursive functions are often used in sorting algorithms, especially if they divide the given array in some way.

### Asymptotic notation

If you want to compare the efficiency of an algorithm to a different one, it's not possible to just compare the time it takes them to sort an array. There are just too many factors that could impair the outcome:

- how many elements are in the array?
- how fast is the CPU?
- how many other programs are currently running?

And much more... Therefore, the standard way of comparing is asymptotic notation, although you most likely will have heard of `Big O Notation` instead.

Here's a quick rundown of the different notations:

| _**Notation**_ | _**Description**_ | _**Giveaway feature**_                                                      | _**Example**_                                     |
| -------------- | ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| O(1)           | constant          | Independent of input size                                                   | Finding an element in an array with a given index |
| O(log n)       | logarithmic       | Halfs the array in every iteration                                          | Binary search                                     |
| O(n)           | linear            | Loops over the complete array at least once                                 | Linear search                                     |
| O(n \* log n)  | loglinear         | Loops over the complete array once, also halfs the array in each iteration  | Mergesort                                         |
| O(n^2)         | quadratic         | Loops over the complete array, loops over the array again in each iteration | Bubblesort                                        |
| O(2^n)         | exponential       | Repeatedly solving subtasks with multiple recursions                        | Towers of Hanoi                                   |
| O(n!)          | factorial         | Calling the function recursively with the input - 1                         | Calculating the factorial of a number, ironically |

With this knowledge in mind, let's get into it!

## Bubblesort

Bubblesort is a simple and straightforward (if not the easiest) sorting algorithm that repeatedly steps through a list of elements, compares adjacent items, and swaps them if they are in the wrong order (you could also say that the higher value bubbles up). This process continues until no more swaps are needed, indicating that the list is sorted.

```python title="bubblesort.py"
def bubblesort(arr):
  for i in range(len(arr)):
    for j in range(len(arr) - 1 - i):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
```

<br />

```rs title="bubblesort.rs"
fn bubblesort(list: $mut Vec<i32>) {
  for i in 0..list.len() {
    for j in 0..list.len() - 1 - i {
      if list[j] > list[j + 1] {
        list.swap(j, j + 1);
      }
    }
  }
}
```

The swap happens in place, meaning that no new array has to be created. The runtime of this algorithm is `O(n^2)` because we loop over the array for every element of the array, even in the optimized way we use here.

## Insertion sort

Let's look at `Insertion sort` next. It is a simple comparison-based sorting algorithm that works by dividing the input list into a sorted and an unsorted region. It repeatedly takes an element from the unsorted region and moves it into its correct position within the sorted region.

In the examples I'm providing, it checks if the element is smaller than the elements to its left in the sorted region. If it is, the algorithm shifts those larger elements one position to the right to make space for the current element, and then inserts the current element in its correct sorted position.

```python title="insertion_sort.py"
def insertion_sort(arr):
    for i in range(1, len(arr)):
        value = arr[i]
        j = i - 1
        while j >= 0:
            if value < arr[j]:
                arr[j + 1], arr[j] = arr[j], value
                j -= 1
            else:
                break
    return arr
```

<br />

```rs title="insertion_sort.rs"
fn insertion_sort(arr: &mut Vec<i32>) -> &mut Vec<i32> {
    for i in 1..arr.len() - 1 {
        let mut j = i - 1;
        while j > 0 {
            if arr[i] < arr[j] {
                arr.swap(i, j);
                j -= 1;
            } else {
                break
            }
        }
    }
    arr
}
```

Similar to `bubblesort` this algorithm has a runtime of `O(n^2)`.

## Mergesort

The smaller an array is, the faster we can sort it. What is the shortest possible array? If it has one element - which is automatically sorted. But if the given array is not of that length, how do we achieve this?

Enter `Mergesort`! This algorithm is the prime example of a `divide and conquer` algorithm (alongside binary search). It splits the array in two halves, checks if the length is smaller than or equal to one (where it returns the array: base case!), and repeats the splitting until the array has only one element in it.

In the next step, we merge the short arrays together by comparing at the first element of the right and left arrays:

```ts title="mergeSort.ts"
export function mergeSort(arr: number[]): number[] {
  const length = arr.length;
  if (length === 1) return arr;

  const middle = Math.floor(length / 2);
  const leftHalf = arr.slice(0, middle);
  const rightHalf = arr.slice(middle, length);
  const leftSorted = mergesSrt(leftHalf);
  const rightSorted = mergeSort(rightHalf);
  return merge(leftSorted, rightSorted);
}

function merge(left: number[], right: number[]): number[] {
  const sorted: number[] = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sorted.push(left[0]);
      left.shift();
    } else {
      sorted.push(right[0]);
      right.shift();
    }
  }
  if (left.length) {
    sorted.push(...left);
  }
  if (right.length) {
    sorted.push(...right);
  }
  return sorted;
}
```

<br />

```rs title="mergesort.rs"
pub fn mergesort(list: &mut Vec<i32>) {
    if list.len() <= 1 {
        return;
    }
    let middle_index = list.len() / 2;
    let left_arr = &mut list[..middle_index].to_vec();
    let right_arr = &mut list[middle_index..].to_vec();

    mergesort(left_arr);
    mergesort(right_arr);

    list.clear();
    list.extend(merge(left_arr, right_arr));
}

fn merge(left: &mut Vec<i32>, right: &mut Vec<i32>) -> Vec<i32> {
    let mut arr: Vec<i32> = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);

    while i < left.len() && j < right.len() {
        if left[i] < right[j] {
            arr.push(left[i]);
            i += 1;
        } else {
            arr.push(right[j]);
            j += 1;
        }
    }

    arr.extend(&left[i..]);
    arr.extend(&right[j..]);

    arr
}
```

This can also sort the array in place, in the TS version I created a separate array.

Compared to `bubblesort` and `insertion sort`, using `mergesort` is a huge increase of speed when looking at the runtime: `O(n * log n)`. Mergesort is also special in this regard: the runtime is always `(n * log n)`, even if the array is already sorted.

## Quicksort

Quicksort is another efficient sorting algorithm based on the divide-and-conquer strategy. It selects a 'pivot' element from the list and partitions the other elements into two sublists – those less than the pivot and those greater than the pivot. The algorithm then recursively sorts the sublists.

```ts title="quickSort.ts"
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

<br />

```rs title="quicksort.rs"
fn quicksort(arr: &Vec<i32>) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec()
    }

    let pivot = arr[0];
    let mut left_arr: Vec<i32> = Vec::new();
    let mut right_arr: Vec<i32> = Vec::new();

    for i in 1..arr.len() {
        if arr[i] > pivot {
            right_arr.push(arr[i])
        } else {
            left_arr.push(arr[i])
        }
    }

    let mut sorted_left = quicksort(&left_arr);
    let sorted_right = quicksort(&right_arr);

    sorted_left.push(pivot);
    sorted_left.extend(sorted_right);

    sorted_left
}
```

Quicksort is known for its average-case time complexity of O(n log n) and is widely used in practice due to its speed. However, its worst-case time complexity can be O(n^2) if not properly implemented.

## What did I learn?

Writing Rust code for the first time was more complicated than I had anticipated, but it's no surprise coming from a high level language that does not deal with pointers, ownership and similar concepts. Excited to keep learning it!
