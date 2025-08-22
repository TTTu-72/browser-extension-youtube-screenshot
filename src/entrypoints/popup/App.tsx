import { createSignal, onMount, createEffect } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';
import './App.css';

function App() {
  const [folder, setFolder] = createSignal('');
  const [useChannelFolder, setUseChannelFolder] = createSignal(false);
  const [useTitleFolder, setUseTitleFolder] = createSignal(false);
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(async () => {
    try {
      const result = await browser.storage.local.get([
        'screenshotFolder',
        'useChannelFolder',
        'useTitleFolder',
      ]);
      if (result.screenshotFolder) {
        setFolder(result.screenshotFolder);
      }
      if (result.useChannelFolder) {
        setUseChannelFolder(result.useChannelFolder);
      }
      if (result.useTitleFolder) {
        setUseTitleFolder(result.useTitleFolder);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setIsLoaded(true);
    }
  });

  // 指定フォルダ名保存処理
  const saveFolderSetting = debounce(async (folderValue: string) => {
    try {
      if (folderValue.trim()) {
        await browser.storage.local.set({ screenshotFolder: folderValue });
        console.log('Folder setting auto-saved:', folderValue);
      } else {
        await browser.storage.local.remove(['screenshotFolder']);
        console.log('Folder setting cleared');
      }
    } catch (error) {
      console.error('Failed to save folder setting:', error);
    }
  }, 500);

  // フォルダ名保存
  createEffect(() => {
    if (!isLoaded()) return;
    saveFolderSetting(folder());
  });

  // サブフォルダチェック保存
  createEffect(() => {
    if (!isLoaded()) return;

    const saveSettings = async () => {
      try {
        await browser.storage.local.set({
          useChannelFolder: useChannelFolder(),
          useTitleFolder: useTitleFolder(),
        });
        console.log('Folder options auto-saved:', {
          useChannelFolder: useChannelFolder(),
          useTitleFolder: useTitleFolder(),
        });
      } catch (error) {
        console.error('Failed to save folder options:', error);
      }
    };

    void saveSettings();
  });

  // プレビュー用のパス
  const getPreviewPath = () => {
    let path = 'ダウンロード';
    if (folder().trim()) {
      path += `/${folder()}`;
    }
    if (useChannelFolder()) {
      path += '/[チャンネル名]';
    }
    if (useTitleFolder()) {
      path += '/[動画タイトル]';
    }
    return path;
  };

  return (
    <div class="popup-container">
      <h1>YouTube スクリーンショット 設定</h1>

      <div class="setting-section">
        <label for="folder-input" class="setting-label">
          保存先フォルダ:
        </label>
        <div class="input-group">
          <input
            id="folder-input"
            type="text"
            value={folder()}
            onInput={e => setFolder(e.currentTarget.value)}
            placeholder="e.g., YouTube Screenshots"
            class="folder-input"
          />
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={useChannelFolder()}
              onChange={e => setUseChannelFolder(e.currentTarget.checked)}
              class="checkbox"
            />
            チャンネル名でサブフォルダを作成
          </label>

          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={useTitleFolder()}
              onChange={e => setUseTitleFolder(e.currentTarget.checked)}
              class="checkbox"
            />
            動画タイトルでサブフォルダを作成
          </label>
        </div>

        <p class="setting-help">保存先: {getPreviewPath()}/ファイル名.png</p>
      </div>
    </div>
  );
}

export default App;
