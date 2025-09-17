export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DOWNLOAD_SCREENSHOT') {
      handleScreenshotDownload(message.data)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });
});

const handleScreenshotDownload = async (data: {
  imageDataUrl: string;
  filename: string;
}): Promise<{ success: boolean; downloadId?: number; error?: string }> => {
  const downloadListener = (item: any, suggest: any) => {
    suggest({ filename: data.filename });
    browser.downloads.onDeterminingFilename.removeListener(downloadListener);
  };

  try {
    browser.downloads.onDeterminingFilename.addListener(downloadListener);
    const downloadId = await browser.downloads.download({
      url: data.imageDataUrl,
      filename: data.filename,
      saveAs: false, // ダイアログなし
    });

    return { success: true, downloadId };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
