<script lang="ts">
import type { SearchResult } from '~/utils/types';

const { foundPosts } = $props<{ foundPosts: SearchResult[] }>();
</script>

{#if foundPosts.length > 0}
  <div class="brutalist-results-header">
    <span class="font-ui text-sm font-semibold uppercase tracking-wider text-accent">
      {foundPosts.length} result{foundPosts.length === 1 ? '' : 's'} found
    </span>
  </div>
{/if}

<ol class="brutalist-results-list">
  {#each foundPosts as foundPost}
    <li class="brutalist-result-item">
      <a
        href={`/posts/${foundPost.item.slug}`}
        class="brutalist-result-link"
        data-test-id={`search-result-${foundPost.item.slug}`}
      >
        <article class="brutalist-result-card">
          <h2 class="brutalist-result-title">
            {foundPost.item.title}
          </h2>
          <p class="brutalist-result-description">
            {foundPost.item.description}
          </p>
          <div class="brutalist-result-tags">
            {#each foundPost.item.tags as tag}
              <span class="brutalist-result-tag">{tag.toLowerCase()}</span>
            {/each}
          </div>
          <div class="brutalist-result-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </article>
      </a>
    </li>
  {/each}
</ol>

<style>
  .brutalist-results-header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 3px solid rgb(var(--color-border-rgb));
  }

  .brutalist-results-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .brutalist-result-item {
    margin: 0;
  }

  .brutalist-result-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .brutalist-result-card {
    position: relative;
    padding: 1.25rem;
    border: 3px solid rgb(var(--color-border-rgb));
    background-color: rgb(var(--color-card-rgb));
    box-shadow: 4px 4px 0 0 rgb(var(--color-text-base));
    transition: all 0.15s ease;
  }

  .brutalist-result-link:hover .brutalist-result-card {
    transform: translate(-3px, -3px);
    box-shadow: 7px 7px 0 0 rgb(var(--color-accent-rgb));
    border-color: rgb(var(--color-accent-rgb));
  }

  .brutalist-result-title {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.75rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: rgb(var(--color-text-base));
    margin-bottom: 0.5rem;
    transition: color 0.15s ease;
  }

  .brutalist-result-link:hover .brutalist-result-title {
    color: rgb(var(--color-accent-rgb));
  }

  .brutalist-result-description {
    font-family: "Fira Mono", monospace;
    font-size: 1rem;
    line-height: 1.6;
    color: rgb(var(--color-text-base));
    opacity: 0.85;
    margin-bottom: 0.75rem;
  }

  .brutalist-result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .brutalist-result-tag {
    display: inline-block;
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.6rem;
    border: 2px solid rgb(var(--color-border-rgb));
    background-color: rgb(var(--color-fill-rgb));
    color: rgb(var(--color-text-base));
  }

  .brutalist-result-arrow {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    color: rgb(var(--color-accent-rgb));
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.15s ease;
  }

  .brutalist-result-link:hover .brutalist-result-arrow {
    opacity: 1;
    transform: translateX(0);
  }
</style>
