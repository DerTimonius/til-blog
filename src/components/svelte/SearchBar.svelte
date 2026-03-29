<script lang="ts">
import type { CollectionEntry } from 'astro:content';
import Fuse from 'fuse.js';
import SearchResults from './SearchResults.svelte';
import type { SearchList, SearchResult } from '~/utils/types';

const { posts }: { posts: CollectionEntry<'blogs'>[] } = $props();
const searchList = $derived(
	posts.map((p) => {
		return {
			title: p.data.title,
			description: p.data.description,
			data: p.data,
			slug: p.id,
			tags: p.data.tags,
		};
	}),
) as SearchList[];
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

<div class="brutalist-search-container">
  <label class="brutalist-search-label">
    <span class="brutalist-search-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="square"
        stroke-linejoin="miter"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>
    <input
      class="brutalist-search-input"
      placeholder="Search for topics, JavaScript, CSS, etc..."
      name="search"
      bind:value={searchTerm}
      oninput={searchPosts}
    />
  </label>

  {#if searchTerm.length > 2 && !foundPosts.length}
    <div class="brutalist-no-results">
      <div class="brutalist-no-results-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="miter"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="font-ui text-sm font-semibold uppercase tracking-wider">
          No results found
        </p>
        <p class="font-body text-sm opacity-70">Try a different search term</p>
      </div>
    </div>
  {:else}
    <SearchResults {foundPosts} />
  {/if}
</div>

<style>
  .brutalist-search-container {
    margin-bottom: 2rem;
  }

  .brutalist-search-label {
    display: block;
    position: relative;
  }

  .brutalist-search-icon {
    position: absolute;
    top: 30%;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    color: rgb(var(--color-accent-rgb));
  }

  .brutalist-search-input {
    display: block;
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1rem;
    border: 3px solid rgb(var(--color-border-rgb));
    background-color: rgb(var(--color-fill-rgb));
    color: rgb(var(--color-text-base));
    box-shadow: 4px 4px 0 0 rgb(var(--color-text-base));
    transition: all 0.15s ease;
    outline: none;
  }

  .brutalist-search-input::placeholder {
    color: rgb(var(--color-text-base));
    opacity: 0.5;
    font-style: italic;
  }

  .brutalist-search-input:focus {
    border-color: rgb(var(--color-accent-rgb));
    box-shadow: 4px 4px 0 0 rgb(var(--color-accent-rgb));
    transform: translate(-2px, -2px);
  }

  .brutalist-no-results {
    margin-top: 2rem;
    padding: 2rem;
    text-align: center;
  }

  .brutalist-no-results-box {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem 3rem;
    border: 3px solid rgb(var(--color-border-rgb));
    background-color: rgb(var(--color-card-rgb));
    box-shadow: 4px 4px 0 0 rgb(var(--color-text-base));
    color: rgb(var(--color-text-base));
  }

  .brutalist-no-results-box svg {
    color: rgb(var(--color-accent-rgb));
    margin-bottom: 0.5rem;
  }
</style>
