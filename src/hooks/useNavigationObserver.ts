import { onCleanup } from 'solid-js';

export const useNavigationObserver = (callback: () => void) => {
  let currentUrl = location.href;

  const observer = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      setTimeout(callback, 1000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  onCleanup(() => observer.disconnect());

  return observer;
};
