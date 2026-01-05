import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RspressPlugin } from '@rspress/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function pluginThemeTerminalBlog(): RspressPlugin {
  return {
    name: '@sooniter/rspress-plugin-theme-terminal-blog',
    config(config) {
      return {
        ...config,
        themeDir: path.join(__dirname, 'theme'),
      };
    },
  };
}
