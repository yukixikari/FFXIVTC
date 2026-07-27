/**
 * sub-worker.js
 *
 * 把潛水艇路線搜尋（subFindRoutes，組合爆炸的重計算）丟到背景執行緒跑，
 * 避免使用者按下「搜尋」時主執行緒（畫面）被卡住。
 *
 * 用 importScripts 載入 sub-data.js（資料）與 sub-calc.js（演算法）。
 * 這兩份檔案同時被 index.html 以 <script> 載入（主執行緒）和這裡以
 * importScripts 載入（Worker），確保資料/邏輯只有一份來源，不會兩邊改到不同步。
 * 兩者皆不碰 document/window，可安全在 Worker（沒有 DOM）裡載入。
 * 順序不可顛倒：sub-calc.js 在頂層直接使用 sub-data.js 定義的常數
 * （例如 SECTOR_MAP 是從 SUB_SECTORS 算出來的），必須先載入 sub-data.js。
 */
importScripts('sub-data.js', 'sub-calc.js');

self.onmessage = function (e) {
  const d = e.data || {};
  const reqId = d.reqId;
  try {
    if (d.mode === 'ownedEnumerateMap') {
      /* 平行化：只列舉分配給這個 Worker 的那幾張地圖的候選路線，
       * 跟配裝完全無關，可以放心切開分給多個 Worker 同時跑。 */
      const candidates = subEnumerateCandidates(
        d.rank, d.mustInc, d.mustExcl, d.mustIncMaps, d.mustExclMaps, d.mapIds
      );
      self.postMessage({ reqId: reqId, ok: true, candidates: candidates });
    } else if (d.mode === 'ownedEvaluate') {
      /* 平行化：候選路線已經在主執行緒合併好了，這裡只做「依擁有部件查表」。 */
      const result = subEvaluateOwnedCandidates(
        d.rank, d.candidates, d.ownedParts, d.mustLootIds,
        d.desiredMins, d.useTime, d.lootStrict, d.lootTier, d.lootMustMeet
      );
      self.postMessage({ reqId: reqId, ok: true, routes: result.routes, noParts: result.noParts, capped: result.capped, totalCount: result.totalCount, searchedCount: result.searchedCount });
    } else if (d.mode === 'owned') {
      /* 單一 Worker 版本（不支援平行化時的 fallback，見 sub-panel.js）。 */
      const result = subFindRoutesForOwnedParts(
        d.rank, d.ownedParts, d.mustInc, d.mustExcl,
        d.mustIncMaps, d.mustExclMaps, d.mustLootIds,
        d.desiredMins, d.useTime, d.letterOnly, d.lootStrict, d.lootTier, d.lootMustMeet
      );
      self.postMessage({ reqId: reqId, ok: true, routes: result.routes, noParts: result.noParts, capped: result.capped, totalCount: result.totalCount, searchedCount: result.searchedCount });
    } else {
      const routes = subFindRoutes(
        d.rank, d.stats, d.mustInc, d.mustExcl,
        d.mustIncMaps, d.mustExclMaps, d.mustLootIds,
        d.desiredMins, d.useTime, d.letterOnly, d.lootStrict, d.lootMustMeet
      );
      self.postMessage({ reqId: reqId, ok: true, routes: routes });
    }
  } catch (err) {
    self.postMessage({ reqId: reqId, ok: false, error: String((err && err.message) || err) });
  }
};
