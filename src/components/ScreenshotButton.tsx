import { JSX } from 'solid-js';
/* eslint-disable no-unused-vars */
import { splitProps } from 'solid-js';

interface ScreenshotButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  video: HTMLVideoElement;
  onScreenshot: (video: HTMLVideoElement) => void;
  icon: string;
  title?: string;
}

export const ScreenshotButton = (_props: ScreenshotButtonProps) => {
  const [local, others] = splitProps(_props, ['video', 'onScreenshot', 'title', 'icon']);
  return (
    <button
      onClick={() => local.onScreenshot(_props.video)}
      title={local.title ?? 'スクリーンショットを撮る'}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={local.icon}
      {...others}
    />
  );
};
