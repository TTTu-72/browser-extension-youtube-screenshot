import { getCurrentTimestamp } from '@/utils/time';

export const useScreenshot = () => {
  /**
   * スクリーンショットを取得保存
   * @param video
   * @param filename
   */
  const takeScreenshot = async (video: HTMLVideoElement, filename: string): Promise<void> => {
    try {
      const imageDataUrl = await captureVideoFrame(video);

      await browser.runtime.sendMessage({
        type: 'DOWNLOAD_SCREENSHOT',
        data: {
          imageDataUrl,
          filename,
        },
      });
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  };

  /**
   * 動画フレームをPNGのDataURLでキャプチャする
   */
  const captureVideoFrame = async (video: HTMLVideoElement): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context could not be created');
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  };

  return {
    takeScreenshot,
  };
};
