import type { Site, SocialObjects } from './types';

export const site: Site = {
  website: 'https://astro-paper.pages.dev/', // replace this with your deployed domain
  author: 'Timon Jurschitsch',
  desc: 'A little blog to share what I have learned today',
  title: 'TIL - DerTimonius',
  ogImage: 'astropaper-og.jpg',
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const logoImage = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

// TODO: add portfolio page when done
export const socials: SocialObjects = [
  {
    name: 'Github',
    href: 'https://github.com/dertimonius',
    linkTitle: ` ${site.title} on Github`,
    active: true,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dertimonius/',
    linkTitle: `${site.title} on Instagram`,
    active: false,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/timonjurschitsch/',
    linkTitle: `${site.title} on LinkedIn`,
    active: true,
  },
  {
    name: 'Mail',
    href: 'mailto:timon.jurschitsch@gmail.com',
    linkTitle: `Send an email to ${site.author}`,
    active: false,
  },
  {
    name: 'Reddit',
    href: 'https://www.reddit.com/user/dertimonius',
    linkTitle: `${site.title} on Reddit`,
    active: false,
  },
];
