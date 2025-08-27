import { buttonManager } from './button-manager';

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    const { addScreenshotButtonToYouTubePlayer } = buttonManager();

    void addScreenshotButtonToYouTubePlayer();
  },
});
