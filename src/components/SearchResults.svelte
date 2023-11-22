<script lang="ts">
  const { foundPosts } = $props<{ foundPosts: any }>();
</script>

<ol class="list-none gap-6">
  {#each foundPosts as foundPost}
    <li class="my-6">
      <a
        href={`/blog/${foundPost.item.slug}`}
        class="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
        data-test-id={`search-result-${foundPost.item.slug}`}
      >
        <h2>{foundPost.item.title}</h2>
      </a>
      <p>{foundPost.item.description}</p>
    </li>
  {/each}
</ol>
