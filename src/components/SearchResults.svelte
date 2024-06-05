<script lang="ts">
  import type { SearchResult } from '~/utils/types';

  const { foundPosts } = $props<{ foundPosts: SearchResult[] }>();
</script>

<ol class="list-none gap-6 px-6">
  {#each foundPosts as foundPost}
    <div class="mx-auto my-8 max-w-4xl">
      <li class="my-6">
        <a
          href={`/blog/${foundPost.item.slug}`}
          class="inline-block text-lg font-medium text-custom-accent decoration-dashed underline-offset-4 focus-visible:underline-offset-0"
          data-test-id={`search-result-${foundPost.item.slug}`}
        >
          <h2 class="text-lg font-medium decoration-dashed hover:underline">
            {foundPost.item.title}
          </h2>
        </a>
        <p>{foundPost.item.description}</p>
      </li>
      <ul class="mb-4 flex flex-row gap-3">
        {#each foundPost.item.tags as tag}
          <li class="text-sm uppercase text-gray-700/80 dark:text-gray-400">
            {tag.toLowerCase()}
          </li>{/each}
      </ul>
    </div>
  {/each}
</ol>
