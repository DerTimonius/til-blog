<script lang="ts">
  // @ts-ignore
  import type { CollectionEntry } from 'astro:content';
  import Fuse from 'fuse.js';
  import SearchResults from './SearchResults.svelte';
  import type { SearchList, SearchResult } from '~/utils/types';

  const { posts }: { posts: CollectionEntry<'blogs'>[] } = $props();
  const searchList = posts.map((p) => {
    return {
      title: p.data.title,
      description: p.data.description,
      data: p.data,
      slug: p.slug,
      tags: p.data.tags,
    };
  }) as SearchList[];
  const fuse = new Fuse(searchList, {
    keys: ['title', 'description', 'tags'],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.3,
  });
  let searchTerm = $state('');
  let foundPosts = $state<SearchResult[]>([]);

  const searchPosts = () => {
    if (searchTerm.length > 2) {
      return (foundPosts = fuse.search(searchTerm));
    } else {
      return (foundPosts = []);
    }
  };
</script>

<label class="relative block">
  <span class="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 fill-custom-base"
      aria-hidden="true"
    >
      <path
        d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
      ></path>
    </svg>
  </span>
  <input
    class="block w-full rounded border border-custom-fill
  border-opacity-40 bg-custom-fill py-3 pl-10
  pr-3 placeholder:italic placeholder:text-opacity-75
  focus:border-custom-accent focus:outline-none"
    placeholder="Camera, JavaScript, Font, you name it..."
    name="search"
    bind:value={searchTerm}
    oninput={searchPosts}
  />
</label>

{#if searchTerm.length > 2 && !foundPosts.length}
  <p>Sorry, I wasn't able to find anything!</p>
{:else}
  <SearchResults {foundPosts} />
{/if}
