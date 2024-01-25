<script lang="ts">
  import type { SearchResult } from '~/utils/types';

  const { foundPosts } = $props<{ foundPosts: SearchResult[] }>();
</script>

<ol class="list-none gap-6 px-6">
  {#each foundPosts as foundPost}
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
    <ul class="mb-2">
      {#each foundPost.item.tags as tag}
        <li class="inline-block my-1 underline-offset-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="-mr-5 h-6 w-6 text-custom-base opacity-80 scale-75"
            ><path
              d="M16.018 3.815 15.232 8h-4.966l.716-3.815-1.964-.37L8.232 8H4v2h3.857l-.751 4H3v2h3.731l-.714 3.805 1.965.369L8.766 16h4.966l-.714 3.805 1.965.369.783-4.174H20v-2h-3.859l.751-4H21V8h-3.733l.716-3.815-1.965-.37zM14.106 14H9.141l.751-4h4.966l-.752 4z"
            ></path>
          </svg>
          &nbsp;<span>{tag.toLowerCase()}</span>
        </li>{/each}
    </ul>
    <div
      class="max-w-4xl mx-auto px-2 border-dashed border-custom-light border-b-2 last:hidden"
    />
  {/each}
</ol>
