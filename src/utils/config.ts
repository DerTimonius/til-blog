import type { Site, SocialObjects } from './types';

export const site: Site = {
  website: 'https://dertimonius.dev',
  author: 'Timon Jurschitsch',
  desc: 'A little blog to share what I have learned today',
  title: 'TIL - DerTimonius',
  username: 'DerTimonius',
  lightAndDarkMode: true,
  postPerPage: 5,
  ogImage: 'og.png',
};

export const logoImage = {
  enable: true,
  svg: true,
};

// TODO: add portfolio page when done
export const socials: SocialObjects = [
  {
    name: 'Github',
    href: 'https://github.com/dertimonius',
    linkTitle: ` ${site.username} on Github`,
    active: true,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dertimonius/',
    linkTitle: `${site.username} on Instagram`,
    active: false,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/timonjurschitsch/',
    linkTitle: `${site.author} on LinkedIn`,
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
    linkTitle: `${site.username} on Reddit`,
    active: false,
  },
  { name: 'RSS', href: '/rss.xml', linkTitle: 'RSS feed', active: true },
];
