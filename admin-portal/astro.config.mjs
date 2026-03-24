import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import path from 'path';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@layouts': path.resolve('./src/layouts'),
        '@components': path.resolve('./src/components'),
        '@actions': path.resolve('./src/actions'),
        '@lib': path.resolve('./src/lib'),
      },
    },
  },
});
