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
      const channelName = getChannelName();
      const filename = await generateFilename(title, channelName);

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

  /**
   * YouTubeのチャンネル名を取得
   */
  const getChannelName = (): string => {
    const selectors = [
      'ytd-channel-name #text a',
      '#owner-name a',
      '.ytd-video-owner-renderer a',
      '#channel-name a'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }

    return 'Unknown Channel';
  };

  /**
   * ファイル名を生成
   * @param title
   * @param channelName
   */
  const generateFilename = async (title: string, channelName: string): Promise<string> => {
    // ファイル名に使用できない文字を置換
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
    const cleanChannelName = channelName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 30);
    const timestamp = getCurrentTimestamp();

    // 設定を取得
    try {
      const result = await browser.storage.local.get([
        'screenshotFolder',
        'useChannelFolder',
        'useTitleFolder'
      ]);

      const folder = result.screenshotFolder || '';
      const useChannelFolder = result.useChannelFolder || false;
      const useTitleFolder = result.useTitleFolder || false;

      let path = '';

      // 指定されたフォルダ
      if (folder.trim()) {
        const cleanFolder = folder.replace(/[<>:"/\\|?*]/g, '_');
        path += cleanFolder;
      }

      // チャンネル名フォルダ
      if (useChannelFolder) {
        path += path ? `/${cleanChannelName}` : cleanChannelName;
      }

      // 動画タイトルフォルダ
      if (useTitleFolder) {
        path += path ? `/${cleanTitle}` : cleanTitle;
      }

      // ファイル名
      const filename = `${cleanTitle}_${timestamp}.png`;

      return path ? `${path}/${filename}` : filename;

    } catch (error) {
      console.error('Failed to get settings:', error);
      return `${cleanTitle}_${timestamp}.png`;
    }
  };

  return {
    takeScreenshot
  };
};
