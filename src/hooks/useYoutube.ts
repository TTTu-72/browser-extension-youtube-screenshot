import { createSignal } from 'solid-js';

export const useYouTube = () => {
  const [player, setPlayer] = createSignal<HTMLElement | null>(null);
  const [video, setVideo] = createSignal<HTMLVideoElement | null>(null);

  /**
   * YouTube Player要素を取得
   */
  const waitForPlayer = async (timeoutMs = 10000): Promise<HTMLElement> => {
    const current = player();
    if (current) return current;

    const start = Date.now();
    while (true) {
      const playerElement = document.querySelector('.html5-video-player') as HTMLElement | null;
      if (playerElement) {
        const videoElement = playerElement.querySelector('video') as HTMLVideoElement;
        if (videoElement) {
          setVideo(videoElement);
          setPlayer(playerElement);
          return playerElement;
        }
      }

      if (Date.now() - start > timeoutMs) throw new Error('Player not found within timeout');

      // 1秒待つ
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  /**
   * YouTube Video要素を取得
   */
  const waitForVideo = async (): Promise<HTMLVideoElement> => {
    const current = video();
    if (current) return current;

    await waitForPlayer();
    return video() || Promise.reject(new Error('Video element not available'));
  };

  /**
   * YouTubeのタイトルを取得
   */
  const getVideoTitle = (): string => {
    const titleElement = document.querySelector(
      'h1.style-scope.ytd-watch-metadata yt-formatted-string'
    );
    return titleElement?.textContent?.trim() || 'youtube_video';
  };

  /**
   * YouTubeのチャンネル名を取得
   */
  const getChannelName = (): string => {
    const selectors = [
      'ytd-channel-name #text a',
      '#owner-name a',
      '.ytd-video-owner-renderer a',
      '#channel-name a',
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
   * YouTube動画の再生時刻を取得
   * @param video
   */
  const getVideoTimeStamp = (video: HTMLVideoElement): string => {
    const currentTime = Math.floor(video.currentTime);

    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime % 3600) / 60);
    const seconds = currentTime % 60;

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
    } else if (minutes > 0) {
      return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return {
    waitForPlayer,
    waitForVideo,
    getVideoTitle,
    getChannelName,
    getVideoTimeStamp,
  };
};
