import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'SoonIter',
  description: 'SoonIter 的个人博客',
  lang: 'zh',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'SoonIter',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'SoonIter',
    },
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/SoonIter',
      },
    ],
  },
});
