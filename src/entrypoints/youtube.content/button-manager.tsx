import { render } from 'solid-js/web';
import { ScreenshotButton } from '@/components/ScreenshotButton';
import { useYouTube } from '@/hooks/useYoutube';
import shutterIcon from '../../assets/youtube_camera_shutter.svg?raw';
import { useScreenshot } from "@/hooks/useScreenshot";

export const buttonManager = () => {
  const { waitForVideo, addButtonToPlayer, getVideoTitle } = useYouTube();
  const { takeScreenshot } = useScreenshot();

  const handleScreenshot = async (video: HTMLVideoElement): Promise<void> => {
    await takeScreenshot(video, getVideoTitle());
  };

  const addScreenshotButtonToYouTubePlayer = async () => {
    const video = await waitForVideo();
    if (!video) return;

    const buttonContainer = document.createElement('div');
    const cleanUp = render(() => (
      <ScreenshotButton
        video={video}
        onScreenshot={handleScreenshot}
        icon={shutterIcon}
        class="ytp-button"
      />
    ), buttonContainer);

    await addButtonToPlayer(buttonContainer.firstElementChild as HTMLElement);

    return cleanUp;
  };

  return {
    addScreenshotButtonToYouTubePlayer,
  }
};
