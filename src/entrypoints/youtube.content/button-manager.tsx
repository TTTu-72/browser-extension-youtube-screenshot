import { render } from 'solid-js/web';
import { ScreenshotButton } from '@/components/ScreenshotButton';
import { useYouTube } from '@/hooks/useYoutube';
import { useScreenshot } from '@/hooks/useScreenshot';
import shutterIcon from '../../assets/youtube_camera_shutter.svg?raw';

export const buttonManager = () => {
  const { waitForPlayer, waitForVideo, getVideoTitle, getChannelName, getVideoTimeStamp } = useYouTube();
  const { takeScreenshot } = useScreenshot();

  const handleScreenshot = async (video: HTMLVideoElement): Promise<void> => {
    await takeScreenshot(video, await generateFilename(getVideoTitle(), getChannelName(), video));
  };

  const generateFilename = async (title: string, channelName: string, video: HTMLVideoElement): Promise<string> => {
    // ファイル名に使用できない文字を置換
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 80);
    const cleanChannelName = channelName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 80);
    const videoTimestamp = getVideoTimeStamp(video);

    // 設定を取得
    try {
      const result = await browser.storage.local.get([
        'screenshotFolder',
        'useChannelFolder',
        'useTitleFolder',
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
      const filename = `${cleanTitle}_${videoTimestamp}.png`;

      return path ? `${path}/${filename}` : filename;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return `${cleanTitle}_${videoTimestamp}.png`;
    }
  };

  const addButtonToPlayer = async (buttonElement: HTMLElement) => {
    const currentPlayer = await waitForPlayer();

    const controls = currentPlayer.querySelector('.ytp-chrome-bottom');
    if (!controls) return;

    const rightControls = controls.querySelector('.ytp-right-controls');
    if (!rightControls) return;

    rightControls.insertBefore(buttonElement, rightControls.firstChild);
  };

  const addScreenshotButtonToYouTubePlayer = async () => {
    const video = await waitForVideo();
    if (!video) return;

    const buttonContainer = document.createElement('div');
    const cleanUp = render(
      () => (
        <ScreenshotButton
          video={video}
          onScreenshot={handleScreenshot}
          icon={shutterIcon}
          class="ytp-button"
        />
      ),
      buttonContainer
    );

    await addButtonToPlayer(buttonContainer.firstElementChild as HTMLElement);

    return cleanUp;
  };

  return {
    addScreenshotButtonToYouTubePlayer,
  };
};
