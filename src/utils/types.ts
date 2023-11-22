import type { CollectionEntry } from 'astro:content';
import Fuse from 'fuse.js';

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  username?: string;
};

export type SocialObjects = {
  name: SocialMedia;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type SocialIcons = {
  [social in SocialMedia]: string;
};

export type SocialMedia =
  | 'Github'
  | 'Instagram'
  | 'LinkedIn'
  | 'Reddit'
  | 'Mail';

export type SearchList = {
  data: CollectionEntry<'blogs'>['data'];
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export type SearchResult = Fuse.FuseResult<SearchList>;
