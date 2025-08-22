import { buttonManager } from './button-manager';

export default defineContentScript({
  matches: ['*://*.youtube.com/watch*'],
  async main() {
    const { addScreenshotButtonToYouTubePlayer } = buttonManager();
    const buttonCleanup = await addScreenshotButtonToYouTubePlayer();

    return () => {
      buttonCleanup?.();
    };
  },
});
