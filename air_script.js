/**
 * air_script.js
 *
 * 飛空艇路線計算 UI，架構與互動邏輯完全比照 script.js 裡的 app.buildSub()。
 * 沿用同一套 CSS class（sub-xxx），所以不需要另外改 style_patch.css。
 *
 * 與潛水艇版本的差異：
 *  - 沒有「航海圖」篩選（雲海只有一張圖、一個起點），拿掉相關 UI。
 *  - 部件欄位是 船體／纜索／艏樓／艉樓（不是 船體／船尾／船首／艦橋）。
 *  - 等級上限 50（不是 125），且沒有隨等級的數值加成。
 *  - 物品名稱查表用 AIR_ITEM_DB（不是外部 ITEM_DB）。
 */
app.buildAir = function () {
  const root = document.getElementById('air-root'); if (!root) return;
  let selH = null, selR = null, selF = null, selA = null, airRank = 1, letterOnly = false;
  let mustInc = [], mustExcl = [], mustLootIds = [];
  let useTime = false, desiredMins = 0;
  let sortKey = 'epm', sortDir = -1, currentRoutes = [], lootToggleSeq = 0;
  const SORT_PROP = { exp: 'exp', time: 'timeMins', epm: 'epm' };
  const SORT_LABEL = { exp: '經驗值', time: '時間', epm: 'EXP/分' };
  const getStats = () => selH && selR && selF && selA ? airCalcStats(selH, selR, selF, selA) : null;
  const getName = id => AIR_ITEM_DB[String(id)] || `ID:${id}`;

  /* 點擊式資訊彈窗：與潛水艇版本共用同一套（window._subTipInit 旗標判斷用的
     data-tip / loot-toggle class 名稱一致，只需初始化一次，兩個分頁共用）。 */
  if (!window._subTipInit) {
    window._subTipInit = true;
    let tipBox = null, tipTrigger = null;
    const closeTip = () => { if (tipBox) { tipBox.remove(); tipBox = null; tipTrigger = null; } };
    const openTip = (trigger) => {
      closeTip();
      const box = document.createElement('div'); box.className = 'sub-tip-box';
      box.innerHTML = trigger.getAttribute('data-tip').replace(/\n/g, '<br>');
      document.body.appendChild(box);
      const r = trigger.getBoundingClientRect();
      let left = r.left, top = r.bottom + 6;
      const bw = box.offsetWidth, bh = box.offsetHeight;
      if (left + bw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - bw - 8);
      if (top + bh > window.innerHeight - 8) top = r.top - bh - 6;
      box.style.left = left + 'px'; box.style.top = top + 'px';
      tipBox = box; tipTrigger = trigger;
    };
    document.addEventListener('click', e => {
      const toggleBtn = e.target.closest('.loot-toggle');
      if (toggleBtn) {
        e.stopPropagation(); closeTip();
        const target = document.getElementById(toggleBtn.dataset.target); if (!target) return;
        const isHidden = target.style.display === 'none';
        target.style.display = isHidden ? 'inline' : 'none';
        toggleBtn.textContent = isHidden ? '　收合' : `　⋯等${toggleBtn.dataset.total}種`;
        return;
      }
      const trigger = e.target.closest('[data-tip]');
      if (trigger) { e.stopPropagation(); if (tipTrigger === trigger) closeTip(); else openTip(trigger); }
      else if (!e.target.closest('.sub-tip-box')) closeTip();
    });
    window.addEventListener('scroll', closeTip, { passive: true });
    window.addEventListener('resize', closeTip);
  }

  root.innerHTML = `<div class="sub-mogship">
<div class="sub-top-row"><div class="sub-field-grp"><label class="sub-lbl" for="air-rank-inp">等級</label><input type="number" id="air-rank-inp" class="sub-inp" value="1" min="1" max="50"></div><button id="air-search-btn" class="sub-search-btn" style="margin-left:auto">搜　尋</button><button id="air-clear-btn" class="sub-clear-btn">清除篩選</button><button id="air-view-toggle" class="sub-view-btn" type="button">切換為精簡模式</button></div>
<div class="sub-parts-row">
  <div class="sub-part-col"><label class="sub-lbl" for="air-hull">船體</label><select id="air-hull" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="air-rigging">舾裝</label><select id="air-rigging" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="air-forecastle">船首</label><select id="air-forecastle" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="air-aftcastle">船尾</label><select id="air-aftcastle" class="sub-sel"></select></div>
</div>
<div class="sub-stats-bar">
  <div class="sub-stat-box"><div class="sub-stat-lbl">探索性能</div><div class="sub-stat-val sv-neu" id="as-sur">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">收集性能</div><div class="sub-stat-val sv-neu" id="as-ret">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">巡航速度</div><div class="sub-stat-val sv-neu" id="as-spd">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">航行距離</div><div class="sub-stat-val sv-neu" id="as-rng">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">恩惠</div><div class="sub-stat-val sv-neu" id="as-fav">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">承載力</div><div class="sub-stat-val sv-neu" id="as-cap">—</div></div>
</div>
<div class="sub-filters-section">
  <button id="air-filters-hdr" class="sub-filters-hdr" type="button">&#x25b8; 篩選條件</button>
  <div id="air-filters-panel" class="sub-filters-panel">
<div class="sub-opts-row">
  <label class="sub-chk-lbl"><input type="radio" name="air-time-mode" id="air-time-mode-dur" checked> 剩餘時長</label>
  <label class="sub-chk-lbl"><input type="radio" name="air-time-mode" id="air-time-mode-target"> 指定收成時間</label>
  <label class="sub-chk-lbl"><input type="checkbox" id="air-letter"> 只顯示目的地編號</label>
</div>
<div class="sub-opts-row" id="air-dur-row">
  <label class="sub-lbl" for="air-days">天</label><input type="number" id="air-days" class="sub-inp" value="0" min="0">
  <label class="sub-lbl" for="air-hrs">小時</label><input type="number" id="air-hrs" class="sub-inp" value="0" min="0" max="23">
  <label class="sub-lbl" for="air-mins">分鐘</label><input type="number" id="air-mins" class="sub-inp" value="0" min="0" max="59">
  <label class="sub-chk-lbl"><input type="checkbox" id="air-use-time"> 使用指定時間</label>
</div>
<div class="sub-opts-row" id="air-target-row" style="display:none">
  <label class="sub-lbl" for="air-target-date">日期</label>
  <input type="date" id="air-target-date" class="sub-inp sub-date-inp">
  <label class="sub-lbl sub-time-lbl" for="air-target-hour">時間</label>
  <input type="number" id="air-target-hour" class="sub-inp" value="20" min="0" max="23">
  <span class="sub-time-colon">:</span>
  <input type="number" id="air-target-min" class="sub-inp" value="0" min="0" max="59">
  <button type="button" id="air-ampm-btn" class="sub-ampm-btn" style="display:none">上午</button>
  <button type="button" id="air-hourmode-btn" class="sub-hourmode-btn" title="切換12/24小時制">24小時制</button>
  <span class="sub-picker-wrap">
    <button type="button" id="air-target-picker-btn" class="sub-picker-btn" style="display:none" aria-label="開啟日期時間選擇器" title="開啟日曆選擇器">📅</button>
    <input type="datetime-local" id="air-target-native" class="sub-native-dt" tabindex="-1" aria-hidden="true">
  </span>
  <span class="sub-target-hint" id="air-target-hint"></span>
</div>
<div class="sub-filter-row">
  <div class="sub-filter-col"><label class="sub-lbl">必須包含目的地</label><div class="sub-multisel-wrap" id="air-inc-wrap"></div></div>
  <div class="sub-filter-col"><label class="sub-lbl">排除目的地</label><div class="sub-multisel-wrap" id="air-excl-wrap"></div></div>
</div>
<div class="sub-filter-col"><label class="sub-lbl">必須獲得物品</label><div class="sub-multisel-wrap" id="air-loot-wrap"></div><label class="sub-chk-lbl sub-loot-strict-lbl"><input type="checkbox" id="air-loot-strict"> 每個目的地都至少有其中一項物品</label></div>
<div id="air-range-disp" class="sub-range-disp">目前航行距離：—</div>
  </div>
</div>
<div id="air-results"><div class="sub-empty">選擇部件並按搜尋查看最佳路線</div></div>
</div>`;

  /* 部件代號比照潛水艇的命名方式：取該部件英文名稱的字首字母。
     七個等級的英文原名依序為 Bronco／Invincible／Enterprise／Invincible II／
     Odyssey／Tatanora／Viltgance，剛好除了 Invincible 系列外字首都不重複，
     Invincible／Invincible II 就分別用 I／I(II) 區分（比照鯊魚級/鯊魚改級
     用 S/SM 區分的邏輯，只是這裡官方英文名稱本身重複，用 (II) 標示改良款）。 */
  const AIR_RANK_CODE = { 1: 'B', 5: 'I', 15: 'E', 25: 'I(II)', 35: 'O', 45: 'T', 50: 'V' };
  ['hull', 'rigging', 'forecastle', 'aftcastle'].forEach(slot => {
    const sel = root.querySelector(`#air-${slot}`);
    AIR_PARTS[slot].forEach(p => { const o = document.createElement('option'); o.value = p[0]; o.textContent = `${AIR_RANK_CODE[p[1]] || p[1]} — ${p[2]}`; sel.appendChild(o); });
  });

  const mkStepper = (input, opts) => {
    if (!input) return; opts = opts || {};
    const step = opts.step || 1, min = opts.min, max = opts.max, wrapAround = !!opts.wrap;
    input.classList.add('sub-stepper-inp'); if (opts.wide) input.classList.add('sub-stepper-inp-wide');
    const wrapEl = document.createElement('div'); wrapEl.className = 'sub-stepper';
    input.parentNode.insertBefore(wrapEl, input);
    const dn = document.createElement('button'); dn.type = 'button'; dn.className = 'sub-step-btn sub-step-dn'; dn.textContent = '−';
    const up = document.createElement('button'); up.type = 'button'; up.className = 'sub-step-btn sub-step-up'; up.textContent = '＋';
    wrapEl.appendChild(dn); wrapEl.appendChild(input); wrapEl.appendChild(up);
    const apply = dir => {
      let v = (parseInt(input.value, 10) || 0) + dir * step;
      if (wrapAround && min != null && max != null) { const range = max - min + 1; v = min + (((v - min) % range) + range) % range; }
      else { if (min != null) v = Math.max(min, v); if (max != null) v = Math.min(max, v); }
      input.value = v; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    let holdT = null, holdI = null;
    const stopHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = null; holdI = null; };
    [[dn, -1], [up, 1]].forEach(([btn, dir]) => {
      btn.addEventListener('pointerdown', e => { e.preventDefault(); apply(dir); stopHold(); holdT = setTimeout(() => { holdI = setInterval(() => apply(dir), 80); }, 450); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stopHold));
    });
  };
  mkStepper(root.querySelector('#air-rank-inp'), { step: 1, min: 1, max: 50, wide: true });
  mkStepper(root.querySelector('#air-days'), { step: 1, min: 0 });
  mkStepper(root.querySelector('#air-hrs'), { step: 1, min: 0, max: 23, wrap: true });
  mkStepper(root.querySelector('#air-mins'), { step: 1, min: 0, max: 59, wrap: true });
  mkStepper(root.querySelector('#air-target-min'), { step: 1, min: 0, max: 59, wrap: true });

  /* ── 「指定收成時間」模式：完全比照潛水艇版本的邏輯與元件 ── */
  const durRow = root.querySelector('#air-dur-row');
  const targetRow = root.querySelector('#air-target-row');
  const targetDateInp = root.querySelector('#air-target-date');
  const targetHourInp = root.querySelector('#air-target-hour');
  const targetMinInp = root.querySelector('#air-target-min');
  const targetHint = root.querySelector('#air-target-hint');
  const ampmBtn = root.querySelector('#air-ampm-btn');
  const hourModeBtn = root.querySelector('#air-hourmode-btn');
  const pickerBtn = root.querySelector('#air-target-picker-btn');
  const nativeDt = root.querySelector('#air-target-native');
  const pad2 = n => String(n).padStart(2, '0');
  const toLocalDT = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  let hourMode = '24';
  let ampmIsPM = false;
  let trueHour24 = new Date().getHours();

  const to12 = h24 => { const h = h24 % 12; return h === 0 ? 12 : h; };
  const isPMof = h24 => h24 >= 12;
  const to24 = (h12, pm) => { let h = h12 % 12; if (pm) h += 12; return h; };

  const syncHourDisplay = () => {
    if (!targetHourInp) return;
    if (hourMode === '24') { targetHourInp.value = trueHour24; }
    else { targetHourInp.value = to12(trueHour24); ampmIsPM = isPMof(trueHour24); }
    if (ampmBtn) ampmBtn.textContent = ampmIsPM ? '下午' : '上午';
  };

  const rebuildHourStepper = () => {
    if (hourMode === '24') mkStepper(targetHourInp, { step: 1, min: 0, max: 23, wrap: true });
    else mkStepper(targetHourInp, { step: 1, min: 1, max: 12, wrap: true });
  };

  if (targetDateInp) {
    const now = new Date();
    const tmr = new Date(now.getTime() + 24 * 3600 * 1000);
    targetDateInp.min = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    targetDateInp.value = `${tmr.getFullYear()}-${pad2(tmr.getMonth() + 1)}-${pad2(tmr.getDate())}`;
    trueHour24 = now.getHours();
    if (targetMinInp) targetMinInp.value = now.getMinutes();
    if (nativeDt) nativeDt.min = toLocalDT(now);
  }
  rebuildHourStepper();
  syncHourDisplay();

  const composeTargetDate = () => {
    const dv = targetDateInp?.value; if (!dv) return null;
    const [y, mo, da] = dv.split('-').map(Number);
    const mm = parseInt(targetMinInp?.value, 10) || 0;
    return new Date(y, mo - 1, da, trueHour24, mm, 0, 0);
  };
  const updateTargetHint = () => {
    if (!targetHint) return;
    const target = composeTargetDate();
    if (!target) { targetHint.textContent = ''; return; }
    const diffMin = Math.round((target - new Date()) / 60000);
    if (diffMin <= 0) { targetHint.textContent = '⚠ 已經過去'; targetHint.classList.add('sub-target-hint-warn'); return; }
    targetHint.classList.remove('sub-target-hint-warn');
    const dd = Math.floor(diffMin / 1440), hh = Math.floor((diffMin % 1440) / 60), mm = diffMin % 60;
    const parts = []; if (dd) parts.push(dd + '天'); if (hh) parts.push(hh + '小時'); parts.push(mm + '分');
    targetHint.textContent = '距離現在：' + parts.join('');
  };

  const onHourInput = () => {
    const v = parseInt(targetHourInp.value, 10) || 0;
    if (hourMode === '24') trueHour24 = Math.max(0, Math.min(23, v));
    else trueHour24 = to24(Math.max(1, Math.min(12, v)), ampmIsPM);
    updateTargetHint();
  };
  targetHourInp?.addEventListener('input', onHourInput);
  [targetDateInp, targetMinInp].forEach(el => el?.addEventListener('input', updateTargetHint));
  updateTargetHint();

  ampmBtn?.addEventListener('click', () => {
    ampmIsPM = !ampmIsPM;
    const h12 = parseInt(targetHourInp.value, 10) || 12;
    trueHour24 = to24(h12, ampmIsPM);
    syncHourDisplay(); updateTargetHint();
  });

  hourModeBtn?.addEventListener('click', () => {
    hourMode = hourMode === '24' ? '12' : '24';
    hourModeBtn.textContent = hourMode === '24' ? '24小時制' : '12小時制';
    if (ampmBtn) ampmBtn.style.display = hourMode === '12' ? '' : 'none';
    rebuildHourStepper(); syncHourDisplay(); updateTargetHint();
  });

  const isFirefox = /firefox/i.test(navigator.userAgent);
  const supportsShowPicker = nativeDt && typeof nativeDt.showPicker === 'function' && !isFirefox;
  if (pickerBtn) pickerBtn.style.display = supportsShowPicker ? '' : 'none';
  if (pickerBtn && nativeDt) {
    pickerBtn.addEventListener('click', () => {
      const t = composeTargetDate(); if (t) nativeDt.value = toLocalDT(t);
      try { nativeDt.showPicker(); } catch (err) { console.warn('[XIV] showPicker 失敗：', err); }
    });
    nativeDt.addEventListener('change', () => {
      if (!nativeDt.value) return;
      const dt = new Date(nativeDt.value);
      if (targetDateInp) targetDateInp.value = `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
      trueHour24 = dt.getHours();
      if (targetMinInp) targetMinInp.value = dt.getMinutes();
      syncHourDisplay(); updateTargetHint();
    });
  }

  const applyTimeMode = () => {
    const isTarget = root.querySelector('#air-time-mode-target')?.checked;
    if (durRow) durRow.style.display = isTarget ? 'none' : '';
    if (targetRow) targetRow.style.display = isTarget ? '' : 'none';
    if (isTarget) updateTargetHint();
  };
  root.querySelectorAll('input[name="air-time-mode"]').forEach(r => r.addEventListener('change', applyTimeMode));
  applyTimeMode();

  const updateStats = () => {
    airRank = parseInt(root.querySelector('#air-rank-inp')?.value) || 1;
    selH = AIR_PARTS.hull.find(p => p[0] == root.querySelector('#air-hull').value);
    selR = AIR_PARTS.rigging.find(p => p[0] == root.querySelector('#air-rigging').value);
    selF = AIR_PARTS.forecastle.find(p => p[0] == root.querySelector('#air-forecastle').value);
    selA = AIR_PARTS.aftcastle.find(p => p[0] == root.querySelector('#air-aftcastle').value);
    const st = getStats(); if (!st) return;
    root.querySelector('#air-range-disp').textContent = `目前航行距離：${st.rng}`;
    [['sur'], ['ret'], ['spd'], ['rng'], ['fav']].forEach(([k]) => {
      const el = root.querySelector(`#as-${k}`); if (!el) return;
      const v = st[k]; el.textContent = (v >= 0 ? '+' : '') + v;
      el.className = 'sub-stat-val ' + (v > 0 ? 'sv-pos' : v < 0 ? 'sv-neg' : 'sv-neu');
    });
    /* 容量：四個部件的「造價(components)」總和，不能超過目前等級的容量上限
       （官方機制：パーツコストの合計＝＜キャパシティ，飛空艇／潛水艇皆同）。 */
    const capEl = root.querySelector('#as-cap');
    if (capEl) {
      const curCap = [selH, selR, selF, selA].reduce((s, p) => s + (p ? p[8] : 0), 0);
      const maxCap = (AIR_RANKS[airRank] || [])[1] ?? '—';
      capEl.textContent = `${curCap}/${maxCap}`;
      capEl.className = 'sub-stat-val ' + (typeof maxCap === 'number' && curCap > maxCap ? 'sv-neg' : 'sv-neu');
    }
  };

  const mkSecFilter = (wid, arr) => {
    const wrap = root.querySelector(`#${wid}`); if (!wrap) return;
    const chips = document.createElement('div'); chips.className = 'sub-chips-display';
    const cw = document.createElement('div'); cw.className = 'sub-combo-wrap';
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'sub-combo-inp'; inp.placeholder = '輸入編號或名稱篩選目的地…';
    const dd = document.createElement('div'); dd.className = 'sub-combo-dd'; dd.style.display = 'none';
    const allOpts = AIR_SECTORS.map(s => ({ val: s[0], label: `${s[1]} — ${s[3]}` }));
    const renderDD = q => {
      dd.innerHTML = ''; q = (q || '').trim().toLowerCase();
      allOpts.forEach(o => {
        const lo = o.label.toLowerCase();
        if (q && !lo.includes(q)) return;
        const it = document.createElement('div'); it.className = 'sub-combo-item' + (arr.includes(o.val) ? ' selected' : ''); it.textContent = (arr.includes(o.val) ? '✓ ' : '') + o.label;
        it.addEventListener('mousedown', e => { e.preventDefault(); const idx = arr.indexOf(o.val); if (idx >= 0) arr.splice(idx, 1); else arr.push(o.val); inp.value = ''; rc(); renderDD(inp.value); });
        dd.appendChild(it);
      });
      if (!dd.children.length) { const em = document.createElement('div'); em.className = 'sub-combo-empty'; em.textContent = '無符合結果'; dd.appendChild(em); }
    };
    inp.addEventListener('focus', () => { renderDD(inp.value); dd.style.display = 'block'; });
    inp.addEventListener('blur', () => { setTimeout(() => { dd.style.display = 'none'; }, 160); });
    inp.addEventListener('input', () => { renderDD(inp.value); dd.style.display = 'block'; });
    cw.appendChild(inp); cw.appendChild(dd);
    const rc = () => { chips.innerHTML = ''; arr.forEach((id, i) => { const s = AIR_SECTOR_MAP.get(id); if (!s) return; const chip = document.createElement('span'); chip.className = 'sub-chip-tag'; chip.textContent = `${s[1]} ${s[3]}`; const rm = document.createElement('span'); rm.className = 'sub-chip-rm'; rm.textContent = '×'; rm.onclick = () => { arr.splice(i, 1); rc(); renderDD(inp.value); }; chip.appendChild(rm); chips.appendChild(chip); }); };
    wrap.appendChild(chips); wrap.appendChild(cw);
  };

  const mkLootFilter = (wid, arr) => {
    const wrap = root.querySelector(`#${wid}`); if (!wrap) return;
    const chips = document.createElement('div'); chips.className = 'sub-chips-display';
    const cw = document.createElement('div'); cw.className = 'sub-combo-wrap';
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'sub-combo-inp'; inp.placeholder = '輸入物品名稱搜尋…';
    const dd = document.createElement('div'); dd.className = 'sub-combo-dd'; dd.style.display = 'none';
    const commonSet = new Set(AIR_COMMON_LOOT);
    const allIds = [...new Set(Object.keys(AIR_ITEM_DB).map(Number))];
    const allOpts = allIds.map(id => ({ id, name: getName(id), isCommon: commonSet.has(getName(id)) })).sort((a, b) => { if (a.isCommon !== b.isCommon) return a.isCommon ? -1 : 1; return a.name.localeCompare(b.name, 'zh-TW'); });
    const renderDD = q => {
      dd.innerHTML = ''; q = (q || '').trim().toLowerCase(); let inC = false, inO = false;
      allOpts.forEach(o => {
        if (q && !o.name.toLowerCase().includes(q)) return;
        if (o.isCommon && !inC) { inC = true; const g = document.createElement('div'); g.className = 'sub-combo-grp'; g.textContent = '常用物品'; dd.appendChild(g); }
        if (!o.isCommon && !inO) { inO = true; const g = document.createElement('div'); g.className = 'sub-combo-grp'; g.textContent = '其他物品'; dd.appendChild(g); }
        const it = document.createElement('div'); it.className = 'sub-combo-item' + (arr.includes(o.id) ? ' selected' : ''); it.textContent = (arr.includes(o.id) ? '✓ ' : '') + o.name;
        it.addEventListener('mousedown', e => { e.preventDefault(); const idx = arr.indexOf(o.id); if (idx >= 0) arr.splice(idx, 1); else arr.push(o.id); inp.value = ''; rc(); renderDD(inp.value); });
        dd.appendChild(it);
      });
      if (!dd.children.length) { const em = document.createElement('div'); em.className = 'sub-combo-empty'; em.textContent = '無符合結果'; dd.appendChild(em); }
    };
    inp.addEventListener('focus', () => { renderDD(inp.value); dd.style.display = 'block'; });
    inp.addEventListener('blur', () => { setTimeout(() => { dd.style.display = 'none'; }, 160); });
    inp.addEventListener('input', () => { renderDD(inp.value); dd.style.display = 'block'; });
    cw.appendChild(inp); cw.appendChild(dd);
    const rc = () => { chips.innerHTML = ''; arr.forEach((id, i) => { const chip = document.createElement('span'); chip.className = 'sub-chip-tag'; chip.textContent = getName(id); const rm = document.createElement('span'); rm.className = 'sub-chip-rm'; rm.textContent = '×'; rm.onclick = () => { arr.splice(i, 1); rc(); renderDD(inp.value); }; chip.appendChild(rm); chips.appendChild(chip); }); };
    wrap.appendChild(chips); wrap.appendChild(cw);
  };

  mkSecFilter('air-inc-wrap', mustInc); mkSecFilter('air-excl-wrap', mustExcl); mkLootFilter('air-loot-wrap', mustLootIds);

  const ensureAirWorker = () => {
    if (this._airWorkerFailed) return null;
    if (this._airWorker) return this._airWorker;
    try {
      const w = new Worker('air_worker.js');
      w.addEventListener('error', ev => { console.warn('[XIV] air_worker 執行失敗，改回主執行緒計算：', ev.message); this._airWorkerFailed = true; this._airWorker = null; });
      this._airWorker = w; return w;
    } catch (err) { console.warn('[XIV] 瀏覽器不支援 Worker 或載入失敗，改回主執行緒計算：', err); this._airWorkerFailed = true; return null; }
  };

  const doSearch = () => {
    const st = getStats(); if (!st) { root.querySelector('#air-results').innerHTML = '<div class="sub-empty">請先選擇所有部件</div>'; return; }
    const lootStrict = root.querySelector('#air-loot-strict')?.checked || false;
    letterOnly = root.querySelector('#air-letter')?.checked || false;
    const res = root.querySelector('#air-results');

    const timeMode = root.querySelector('#air-time-mode-target')?.checked ? 'target' : 'dur';
    if (timeMode === 'target') {
      const target = composeTargetDate();
      if (!target) { res.innerHTML = '<div class="sub-empty">請先選擇想收成的日期與時間</div>'; return; }
      const diffMin = Math.round((target - new Date()) / 60000);
      if (diffMin <= 0) { res.innerHTML = '<div class="sub-empty">指定的收成時間已經過去，請重新選擇</div>'; return; }
      desiredMins = diffMin; useTime = true;
    } else {
      useTime = root.querySelector('#air-use-time')?.checked || false;
      const dd_ = parseInt(root.querySelector('#air-days')?.value) || 0, hh_ = parseInt(root.querySelector('#air-hrs')?.value) || 0, mm_ = parseInt(root.querySelector('#air-mins')?.value) || 0;
      desiredMins = dd_ * 1440 + hh_ * 60 + mm_;
    }
    res.innerHTML = '<div class="sub-empty">⋯ 計算中，請稍候</div>';

    const TIER_LABEL = { 1: 'T1', 2: 'T2', 3: 'T3' };
    const tierMetAt = (sec, tier, curStats) => { if (tier === 1) return true; if (tier === 2) return curStats.sur >= sec[9]; return curStats.sur >= sec[10]; };

    const buildLootDetail = (secIds) => {
      const detail = {};
      secIds.forEach(id => {
        const sec = AIR_SECTOR_MAP.get(id); const tierData = AIR_LOOT_TIER[id];
        if (!sec || !tierData) return;
        [1, 2, 3].forEach(t => { (tierData[t] || []).forEach(itemId => {
          if (!detail[itemId]) detail[itemId] = { minTier: t, sources: [] };
          else if (t < detail[itemId].minTier) detail[itemId].minTier = t;
          detail[itemId].sources.push({ id, letter: sec[1], name: sec[3], tier: t });
        }); });
      });
      return detail;
    };

    const buildLootCell = (secIds, curStats) => {
      const detail = buildLootDetail(secIds);
      const groups = { 1: [], 2: [], 3: [] };
      Object.entries(detail).forEach(([idStr, info]) => { const id = +idStr; const name = getName(id); groups[info.minTier].push({ id, name, sources: info.sources.filter(s => s.tier === info.minTier) }); });
      [1, 2, 3].forEach(t => groups[t].sort((a, b) => a.name.localeCompare(b.name, 'zh-TW')));
      const MAX_SHOW = 4; let html = '';
      [1, 2, 3].forEach(t => {
        const items = groups[t]; if (!items.length) return;
        const mkItem = it => {
          const met = t === 1 || it.sources.some(s => tierMetAt(AIR_SECTOR_MAP.get(s.id), t, curStats));
          const tip = '來源：\n' + it.sources.map(s => { const sec = AIR_SECTOR_MAP.get(s.id); if (t === 1) return `${s.letter} ${s.name}`; const thr = t === 2 ? sec[9] : sec[10]; return `${s.letter} ${s.name}（探索性能需≥${thr}）`; }).join('\n');
          return `<span class="loot-item${met ? '' : ' loot-unmet'}" data-tip="${tip}">${it.name}</span>`;
        };
        const shown = items.slice(0, MAX_SHOW); const rest = items.slice(MAX_SHOW);
        let itemHtml = shown.map(mkItem).join('、');
        if (rest.length) {
          lootToggleSeq++; const gid = 'air-loot-ext-' + lootToggleSeq; const restHtml = rest.map(mkItem).join('、');
          itemHtml += `<span class="loot-toggle" data-target="${gid}" data-total="${items.length}">　⋯等${items.length}種</span><span class="loot-extra" id="${gid}" style="display:none">、${restHtml}</span>`;
        }
        html += `<div class="loot-tier-row loot-tier-${t}"><span class="loot-tier-badge">${TIER_LABEL[t]}</span><span class="loot-tier-items">${itemHtml}</span></div>`;
      });
      return html || '<span class="loot-empty">—</span>';
    };

    const buildThresholdStrip = (secIds, curStats) => secIds.map(id => {
      const sec = AIR_SECTOR_MAP.get(id); if (!sec) return '';
      const favor = sec[8], t2 = sec[9], t3 = sec[10], normal = sec[11], optimal = sec[12];
      const survCls = curStats.sur >= t3 ? 'thr-full' : curStats.sur >= t2 ? 'thr-part' : 'thr-none';
      const retCls = curStats.ret >= optimal ? 'thr-full' : curStats.ret >= normal ? 'thr-part' : 'thr-none';
      const favCls = curStats.fav >= favor ? 'thr-full' : 'thr-none';
      const tip = `${sec[1]} ${sec[3]}\n👁 探索性能需 T2 ${t2}／T3 ${t3}（你目前 ${curStats.sur}）\n⚓ 收集性能需一般 ${normal}／最佳 ${optimal}（你目前 ${curStats.ret}）\n🍀 恩惠達 ${favor} 有機會雙倍戰利品（你目前 ${curStats.fav}）`;
      return `<span class="thr-stop" data-tip="${tip}"><b class="thr-letter">${sec[1]}</b><i class="thr-dot ${survCls}"></i><i class="thr-dot ${retCls}"></i><i class="thr-dot ${favCls}"></i></span>`;
    }).join('');

    const renderRoutes = (routes) => {
      currentRoutes = routes;
      mogship.classList.toggle('sub-letter', letterOnly && !mogship.classList.contains('sub-compact'));
      if (!routes.length) { res.innerHTML = '<div class="sub-empty">未找到符合條件的路線</div>'; return; }
      const st = getStats(); const curStats = st ? { sur: st.sur, ret: st.ret, fav: st.fav } : { sur: 0, ret: 0, fav: 0 };
      const prop = SORT_PROP[sortKey] || 'epm';
      const sorted = [...routes].sort((a, b) => sortDir * (a[prop] - b[prop]));
      const BATCH = 50; let shown = 0;
      const mkRow = r => {
        const lootHtml = buildLootCell(r.secIds, curStats); const thrHtml = buildThresholdStrip(r.secIds, curStats);
        return `<tr><td data-col="rank">${r.minRank}</td><td data-col="exp">${r.exp.toLocaleString()}</td><td data-col="time">${r.timeStr}</td><td data-col="epm" class="epm-val">${r.epm.toLocaleString()}</td><td data-col="dist">${r.range}</td><td data-col="tank">${r.tank}</td><td data-col="count">${r.secCount}</td><td data-col="sec" class="sec-path"><span class="sec-full">${r.secStr}</span><span class="sec-ltr">${r.secLetters || ''}</span><div class="sub-thr-strip">${thrHtml}</div></td><td data-col="loot" class="loot-cell-tiered">${lootHtml}</td></tr>`;
      };
      const thCell = (col, label) => { if (!SORT_PROP[col]) return `<th data-col="${col}">${label}</th>`; const active = sortKey === col; const arrow = active ? (sortDir === -1 ? '↓' : '↑') : ''; return `<th data-col="${col}" class="sub-sort-th${active ? ' sorted' : ''}">${label}${arrow ? '\u2009' + arrow : ''}</th>`; };
      const firstBatch = sorted.slice(0, BATCH); shown = firstBatch.length;
      const legendHtml = `<div class="sub-legend"><span class="sub-legend-title">備註</span>`+
        `<span><b class="loot-tier-badge tier-badge-1">T1</b> 一般</span>`+
        `<span><b class="loot-tier-badge tier-badge-2">T2</b> 需探索性能達標</span>`+
        `<span><b class="loot-tier-badge tier-badge-3">T3</b> 需探索性能達最佳</span>`+
        `<span class="sub-legend-sep">淺色字＝尚未達標</span>`+
        `<span class="sub-legend-sep">圓點（探索／收集／恩惠）：<i class="thr-dot thr-full"></i>最佳（實心）　<i class="thr-dot thr-part"></i>達標（半圓）　<i class="thr-dot thr-none"></i>未達標（空心）</span>`+
        `<span class="sub-legend-sep">點擊物品名稱或圓點可查看完整資訊</span></div>`;
      let html = legendHtml + `<div class="sub-scroll-hint">← 左右滑動查看全部欄位 →</div><table class="sub-table"><thead><tr>` +
        thCell('rank', '等級') + thCell('exp', SORT_LABEL.exp) + thCell('time', SORT_LABEL.time) + thCell('epm', SORT_LABEL.epm) +
        thCell('dist', '距離消耗') + thCell('tank', '青磷水消耗') + thCell('count', '目的地數') + thCell('sec', '目的地') + thCell('loot', '獲得物品') + `</tr></thead><tbody>`;
      firstBatch.forEach(r => { html += mkRow(r); }); html += '</tbody></table>';
      res.innerHTML = html;
      res.querySelectorAll('th.sub-sort-th').forEach(th => { th.addEventListener('click', () => { const col = th.dataset.col; if (sortKey === col) sortDir = -sortDir; else { sortKey = col; sortDir = -1; } renderRoutes(currentRoutes); }); });
      if (sorted.length > shown) {
        const moreBtn = document.createElement('button'); moreBtn.className = 'sub-more-btn'; moreBtn.textContent = `顯示更多（已顯示 ${shown} ／ 共 ${sorted.length} 筆）`;
        moreBtn.onclick = () => { const tbody = res.querySelector('tbody'); const next = sorted.slice(shown, shown + BATCH); next.forEach(r => { tbody.insertAdjacentHTML('beforeend', mkRow(r)); }); shown += next.length; if (shown >= sorted.length) moreBtn.remove(); else moreBtn.textContent = `顯示更多（已顯示 ${shown} ／ 共 ${sorted.length} 筆）`; };
        res.appendChild(moreBtn);
      }
    };

    const runOnMainThread = () => { setTimeout(() => { renderRoutes(airFindRoutes(airRank, st, mustInc, mustExcl, mustLootIds, desiredMins, useTime, lootStrict)); }, 50); };
    const worker = ensureAirWorker();
    if (!worker) { runOnMainThread(); return; }
    const reqId = (this._airReqId = (this._airReqId || 0) + 1);
    const onMsg = (ev) => {
      if (ev.data?.reqId !== reqId) return; worker.removeEventListener('message', onMsg);
      if (ev.data.ok) { renderRoutes(ev.data.routes); } else { console.warn('[XIV] worker 計算發生錯誤，改回主執行緒計算：', ev.data.error); runOnMainThread(); }
    };
    worker.addEventListener('message', onMsg);
    worker.postMessage({ reqId, rank: airRank, stats: st, mustInc, mustExcl, mustLootIds, desiredMins, useTime, lootStrict });
  };

  root.querySelector('#air-rank-inp')?.addEventListener('input', updateStats);
  ['air-hull', 'air-rigging', 'air-forecastle', 'air-aftcastle'].forEach(id => root.querySelector(`#${id}`)?.addEventListener('change', updateStats));
  root.querySelector('#air-search-btn')?.addEventListener('click', doSearch);
  root.querySelector('#air-clear-btn')?.addEventListener('click', () => {
    [mustInc, mustExcl, mustLootIds].forEach(a => a.length = 0);
    root.querySelectorAll('.sub-chips-display').forEach(c => c.innerHTML = '');
    const strictChk = root.querySelector('#air-loot-strict'); if (strictChk) strictChk.checked = false;
  });

  const mogship = root.querySelector('.sub-mogship');
  const viewToggle = root.querySelector('#air-view-toggle');
  const filtersHdr = root.querySelector('#air-filters-hdr');
  const filtersPanel = root.querySelector('#air-filters-panel');
  const setCompact = (compact) => {
    mogship.classList.toggle('sub-compact', compact);
    viewToggle.textContent = compact ? '切換為完整模式' : '切換為精簡模式';
    filtersPanel.classList.toggle('sub-filters-open', !compact);
    filtersHdr.textContent = (filtersPanel.classList.contains('sub-filters-open') ? '▾' : '▸') + ' 篩選條件';
    try { localStorage.setItem('xiv-air-compact', compact ? '1' : '0'); } catch (e) {}
  };
  let _ac = '0'; try { _ac = localStorage.getItem('xiv-air-compact') || '0'; } catch (e) {}
  setCompact(_ac === '1');
  viewToggle?.addEventListener('click', () => setCompact(!mogship.classList.contains('sub-compact')));
  filtersHdr?.addEventListener('click', () => { filtersPanel.classList.toggle('sub-filters-open'); filtersHdr.textContent = (filtersPanel.classList.contains('sub-filters-open') ? '▾' : '▸') + ' 篩選條件'; });

  updateStats();
  setTimeout(() => root.querySelectorAll('.ih:not([data-ih])').forEach(el => { el.setAttribute('data-ih', '1'); this._bindIH(el); }), 100);
};
