---
title: How file-based routing works
pubDate: 2023-10-18
tags: ['web-dev', 'astro']
isDraft: false
description: Some frameworks like Next.js or Astro offer file-based routing - here's how it works
---

While working on this blog, I could enjoy the ease of _file-based routing_. It's just one of the great things about [Astro](https://astro.build). But during my commute today, I was wondering, how is it achieved? How does Astro or any other framework that supports file-based routing like [Next.js](https://nextjs.org) know, what the correct pages are and when to serve a 404 page?

So I did what every curious minded person would do: I took my phone and searched. A quick google did not really help, which did surprise me. Therefore I took a different route. I looked at the repos.

## `fs` and parsing

Broken down to its smallest parts, it could be described as a simple interaction of reading a directory with `fs` and parsing the URL to get to the correct file.

Why does this work? Well, for file-based routing to work devs have to put the files into the correct directories (`src/pages` in the case of Astro, `app` or `pages` for Next.js depending on if you want to use SSR and RSC). Inside these directories, the underlying functions look for the correct files (or file endings to be precise) and serve them to the browser.

In the case of `Astro` you can add `.astro` or `.md` (and every other markdown related ending) files to the `pages` directory and it will work.
For `Next.js`, it depends on the router you use: if you use the `pages` router, it works with `<filename>.jsx` or `<filename>.tsx`. With the `app` router, you have to use `page.tsx` (or .jsx) and subdirectories.

The URL is parsed in some way: `<domain>/` will receive the `index.astro` file (or the `index.tsx` or `app/page.tsx` in Next). `<domain>/about` will get the `about.astro` file. Things get a bit more complicated for URLs like `<domain>/tags/web-dev` where you could find this post.

## Serving subdirectories

For these situations, it's necessary to put the files in a directory inside the `pages` directory (don't worry, I will talk about the Next appDir further down below), like `pages/tags/index.astro`. Both Astro and Next use specific function that parse the URL to match the filePath.

The following is the actual function used for the pages directory in [Next.js](https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/utils/url.ts) (as of today, and yes I am aware that this function is used in the ESLint plugin):

```ts
/**
 * Recursively parse directory for page URLs.
 */
function parseUrlForPages(urlprefix: string, directory: string) {
  fsReadDirSyncCache[directory] ??= fs.readdirSync(directory, {
    withFileTypes: true,
  });
  const res = [];
  fsReadDirSyncCache[directory].forEach((dirent) => {
    if (/(\.(j|t)sx?)$/.test(dirent.name)) {
      if (/^index(\.(j|t)sx?)$/.test(dirent.name)) {
        res.push(
          `${urlprefix}${dirent.name.replace(/^index(\.(j|t)sx?)$/, '')}`,
        );
      }
      res.push(`${urlprefix}${dirent.name.replace(/(\.(j|t)sx?)$/, '')}`);
    } else {
      const dirPath = path.join(directory, dirent.name);
      if (dirent.isDirectory() && !dirent.isSymbolicLink()) {
        res.push(...parseUrlForPages(urlprefix + dirent.name + '/', dirPath));
      }
    }
  });
  return res;
}
```

Let's break this down:

- the first step is to read the given directory with `fs` with the fileTypes
  - the fileTypes are necessary to check if the entry of the directory is a directory itself or a symlink
- the next step is to check if the files end in `.tsx` or `.jsx`
  - if this is the case, the file name is checked: if it's `index`, the name is stripped, otherwise it is kept
  - the saved route is then the `urlprefix` + the filename
- if the entry is a directory, but no symlink, the function is called recursively with an updated `urlprefix`
  - the original `urlprefix` is `/`
- after the recursion, an array of strings is returned

The parsing of the Astro URLs is pretty similar, so I won't describe this here.

## The appDir

With Next.js 13 came a new paradigm: server side rendering (SSR) and react server components (RSC). This resulted in a new file structure: the file that is exposed to the browser is called `page.tsx` (or jsx), while other files are used for different use cases (`layout.tsx` for the layout, `route.ts` for API endpoints). So, `about.tsx` would not work.

This results in a greater emphasis on the subdirectories: `app/about/page.tsx` is now the same as `pages/about.tsx` and will result in `<domain>/about`.

The function for the app directory is pretty much the same, but it checks for `page.tsx` files - which makes sense since this is the only file that will get to the browser.

## Dynamic routes

I have talked a lot about Next now, let's get back to Astro for this one.

Dynamic routes allow you to create flexible routes that can match a variety of URL segments, making it easy to handle parameters and generate dynamic content. In Astro, all routes must be determined at build time, so it's necessary to [generate the static paths](https://docs.astro.build/en/core-concepts/routing/#static-ssg-mode) with the `getStaticPaths()` function. Here, you define every possible route.

I did the following for this blog:

```ts
export async function getStaticPaths() {
  const posts = await getCollection('blogs', ({ data }) => !data.isDraft);

  const postPaths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  const pagePaths = getPageNumbers(posts.length).map((pageNum) => ({
    params: { slug: String(pageNum) },
  }));

  return [...postPaths, ...pagePaths];
}
```

I get all entries in the `blogs` collection that are not drafts. The slug of the filename is now a route. But since pagination is also possible, the number of the possible pages should also be added as a path.

With this function, the possible paths grow automatically if I create a new post. Neat!

## Conclusion

Whether you choose Next.js or Astro (or any other framework that supports file-based routing), both frameworks provide powerful tools for file-based routing, enabling you to build dynamic and performant web applications with ease.

File-based routing isn't just a convenience; it's a fundamental concept that empowers developers to build web applications that are not only developer-friendly but also user-friendly.
