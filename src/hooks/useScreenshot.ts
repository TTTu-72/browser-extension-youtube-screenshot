import { getCurrentTimestamp } from '@/utils/time';

export const useScreenshot = () => {
  /**
   * スクリーンショットを取得保存
   * @param video
   * @param title
   */
  const takeScreenshot = async (video: HTMLVideoElement, title: string): Promise<void> => {
    try {
      const imageDataUrl = await captureVideoFrame(video);
      const filename = generateFilename(title);

      await browser.runtime.sendMessage({
        type: 'DOWNLOAD_SCREENSHOT',
        data: {
          imageDataUrl,
          filename
        }
      });
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  };

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

  const generateFilename = (title: string): string => {
    // ファイル名に使用できない文字を置換
    const videoTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
    const timestamp = getCurrentTimestamp();
    return `${videoTitle}_${timestamp}.png`;
  };

  return {
    takeScreenshot
  };
};
