/* nav.js — 左側／頂部選單手動切換 ＋ 視窗寬度自動切換
 *
 * data-nav-mode 屬性「第一次決定值」的關鍵邏輯寫在 index.html <head>
 * 最前面的內聯 <script>，必須在任何 CSS 套用前同步執行完，否則畫面
 * 會先閃一下錯的版面才變成對的（FOUC）。這支檔案不重複那段邏輯，
 * 只負責頁面互動的部分：
 *   1. 切換按鈕的點擊行為、更新提示文字
 *   2. 頂部模式下，選單可能因為視窗變窄而自動換成兩行，
 *      這裡量測選單實際高度寫入 --nav-top-h-actual，
 *      讓下方內容區（#viewport）的 top 永遠對齊選單真正的高度，
 *      不會被多出來的第二行蓋住。
 *   3. 視窗寬度自動切換（本次新增）
 *
 * ── 自動切換規則 ──────────────────────────────────────────────────────
 * 區分兩個概念：
 *   userPref         使用者「真正想要」的模式（left／top），
 *                     只有在「不是自動覆寫中」時的手動切換才會更新並寫入
 *                     localStorage，是寬螢幕、未被視窗寬度干擾時的基準狀態。
 *   autoOverrideActive  目前是否處於「因視窗太窄而被自動覆寫」的狀態。
 *
 * 規則：
 *   - 視窗從寬變窄（跨過門檻的那一刻）：
 *       若 userPref === 'left' → 自動切到 top，並標記 autoOverrideActive = true
 *       若 userPref === 'top'  → 本來就是 top，不做任何事
 *   - 視窗從窄變寬（跨過門檻的那一刻）：
 *       若 autoOverrideActive  → 復原成 userPref（也就是 left），
 *                                並清除 autoOverrideActive
 *       否則（userPref 本來就是 top）→ 不做任何事，維持 top
 *   - 只在「跨越門檻」的那一刻判斷，視窗在同一寬度區間內持續拉動
 *     不會重複觸發。
 *   - 手動切換按鈕：
 *       若目前不是 autoOverrideActive → 正常切換並更新 userPref／localStorage
 *       若目前是 autoOverrideActive   → 只改變當下畫面顯示，
 *                                       不更新 userPref、不寫入 localStorage。
 *       這樣一來，使用者在自動覆寫期間不管手動切了幾次，
 *       視窗變寬時的「復原」判斷依然依照進入自動覆寫前的原始模式。
 */
(function () {
  var STORAGE_KEY = 'ff14fc-nav-mode';
  var BREAKPOINT = 900; // 必須與 index.html <head> 內聯 script 的門檻一致
  var root = document.documentElement;
  var btn = document.getElementById('nav-mode-toggle');

  // ── 使用者真實偏好：有存過值就用存的值，沒存過就以 'left' 為基準
  //    （窄螢幕首次造訪時畫面雖顯示 top，那只是「目前被覆寫」，
  //    並非使用者明確選擇，基準仍視為 left，待會由 autoOverrideActive
  //    的初始判斷去對齊目前畫面，不會有 FOUC 或狀態不一致的問題）
  var userPref = (function () {
    var m;
    try { m = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return (m === 'left' || m === 'top') ? m : 'left';
  })();

  var lastNarrow = window.innerWidth <= BREAKPOINT;
  var autoOverrideActive = (userPref === 'left' && lastNarrow);

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

  // 只改變畫面顯示，不動 userPref／localStorage
  function applyMode(mode) {
    root.setAttribute('data-nav-mode', mode);
    updateBtnTitle();
    // 換模式後版面要先套用完，下一禎再量測（換行與否會影響高度）
    requestAnimationFrame(syncTopNavHeight);
  }

  // 真正的「使用者偏好」更新：寫入 userPref 與 localStorage
  function persistPref(mode) {
    userPref = mode;
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
  }

  // 視窗寬度跨越門檻時的自動切換判斷
  function checkAutoSwitch() {
    var narrowNow = window.innerWidth <= BREAKPOINT;
    if (narrowNow === lastNarrow) return; // 沒有跨越門檻，不處理
    lastNarrow = narrowNow;

    if (narrowNow) {
      // 寬 → 窄
      if (userPref === 'left') {
        autoOverrideActive = true;
        applyMode('top');
      }
      // userPref 本來就是 'top' 的話什麼都不用做
    } else {
      // 窄 → 寬
      if (autoOverrideActive) {
        autoOverrideActive = false;
        applyMode(userPref); // 復原成原本的偏好（也就是 'left'）
      }
      // 若不是自動覆寫中（代表 userPref 本來就是 'top'），維持原樣
    }
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentMode() === 'top' ? 'left' : 'top';
      applyMode(next);
      if (!autoOverrideActive) {
        // 不在自動覆寫狀態下的手動切換才是「真正改變偏好」
        persistPref(next);
      }
      // 若在自動覆寫狀態下手動切換，只改變當下畫面顯示，
      // 復原判斷依然依照進入覆寫前的 userPref（不在此更新）
    });
  }

  function handleResize() {
    checkAutoSwitch();
    syncTopNavHeight();
  }

  updateBtnTitle();
  syncTopNavHeight();
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('load', handleResize);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncTopNavHeight).catch(function () {});
  }
})();
