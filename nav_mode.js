/* nav_mode.js — 左側／頂部選單手動切換
 *
 * data-nav-mode 屬性「第一次決定值」的關鍵邏輯寫在 index.html <head>
 * 最前面的內聯 <script>，必須在任何 CSS 套用前同步執行完，否則畫面
 * 會先閃一下錯的版面才變成對的（FOUC）。這支檔案不重複那段邏輯，
 * 只負責頁面互動的部分：
 *   1. 切換按鈕的點擊行為、存回 localStorage、更新提示文字
 *   2. 頂部模式下，選單可能因為視窗變窄而自動換成兩行，
 *      這裡量測選單實際高度寫入 --nav-top-h-actual，
 *      讓下方內容區（#viewport）的 top 永遠對齊選單真正的高度，
 *      不會被多出來的第二行蓋住。
 *
 * 注意：resize 監聽只用來「重新量測高度」，不會反過來改變
 * data-nav-mode 本身——使用者選好的模式不會因為拉視窗大小而被
 * 自動切換掉，這正是這次要拿掉「偵測性觸發」的用意。
 */
(function () {
  var STORAGE_KEY = 'ff14fc-nav-mode';
  var root = document.documentElement;
  var btn = document.getElementById('nav-mode-toggle');

  function currentMode() {
    return root.getAttribute('data-nav-mode') === 'top' ? 'top' : 'left';
  }

  function syncTopNavHeight() {
    if (currentMode() !== 'top') return;
    var nav = document.querySelector('.royal-nav');
    if (!nav) return;
    var h = nav.offsetHeight;
    if (h > 0) root.style.setProperty('--nav-top-h-actual', h + 'px');
  }

  function updateBtnTitle() {
    if (!btn) return;
    var m = currentMode();
    var label = btn.querySelector('.nmt-label');
    if (m === 'top') {
      btn.setAttribute('title', '目前：頂部選單（點擊切換為左側選單）');
      btn.setAttribute('aria-label', '切換為左側選單');
      if (label) label.textContent = '切換左側選單';
    } else {
      btn.setAttribute('title', '目前：左側選單（點擊切換為頂部選單）');
      btn.setAttribute('aria-label', '切換為頂部選單');
      if (label) label.textContent = '切換頂部選單';
    }
  }

  function setMode(mode) {
    root.setAttribute('data-nav-mode', mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    updateBtnTitle();
    // 換模式後版面要先套用完，下一禎再量測（換行與否會影響高度）
    requestAnimationFrame(syncTopNavHeight);
  }

  if (btn) {
    btn.addEventListener('click', function () {
      setMode(currentMode() === 'top' ? 'left' : 'top');
    });
  }

  updateBtnTitle();
  syncTopNavHeight();
  window.addEventListener('resize', syncTopNavHeight, { passive: true });
  window.addEventListener('load', syncTopNavHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncTopNavHeight).catch(function () {});
  }
})();
