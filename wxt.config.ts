import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-solid', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'YouTube Screenshot',
    description: 'YouTubeの動画にスクリーンショット機能を追加します',
    permissions: [
      'activeTab',
      'downloads',
      'storage'
    ],
    host_permissions: [
      '*://*.youtube.com/*'
    ]
  }
});
