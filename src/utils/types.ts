import type { CollectionEntry } from 'astro:content';
import type { FuseResult } from 'fuse.js';

export interface Site {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  username?: string;
}

export type SocialObjects = {
  name: SocialMedia;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type SocialIcons = Record<SocialMedia, string>;

export type SocialMedia =
  | 'Github'
  | 'Instagram'
  | 'LinkedIn'
  | 'Reddit'
  | 'RSS'
  | 'BlueSky'
  | 'Mail';

export interface SearchList {
  data: CollectionEntry<'blogs'>['data'];
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export type SearchResult = FuseResult<SearchList>;
