import { JSX } from 'solid-js';
import shutterIcon from '../assets/youtube_camera_shutter.svg?raw';

interface ScreenshotButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  video: HTMLVideoElement;
  onScreenshot: (video: HTMLVideoElement) => void;
  icon: string;
  title?: string;
}

export const ScreenshotButton = ({
  video,
  onScreenshot,
  title,
  icon,
  ...props
}: ScreenshotButtonProps) => {
  return (
    <button
      onClick={() => onScreenshot(video)}
      title={title ?? "スクリーンショットを撮る"}
      innerHTML={icon}
      {...props}
    />
  );
};
