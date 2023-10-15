import { site } from './config';

export default function getPageNumbers(numberOfPosts: number) {
  const numberOfPages = numberOfPosts / Number(site.postPerPage);

  return Array.from({ length: numberOfPages }, (_, i) => i + 1);
}
