/* Data and computation functions moved to sub_core.js (loaded before this file) */

/* ===== APP ===== */
/* init / nav / _fetch / fetchNews / fetchFashion / _parseFashion
   由 app_patch.js 覆蓋，此處不重複定義                          */
const app={
  initStars(){
    const cv=document.getElementById('starfield');if(!cv)return;
    const ctx=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
    if(this._sid)cancelAnimationFrame(this._sid);
    this._stars=Array.from({length:290},(_,i)=>{const b=i<28,g=Math.random()<0.11;return{x:Math.random()*cv.width,y:Math.random()*cv.height,sz:b?2.4+Math.random()*2.1:0.6+Math.random()*1.6,spd:.055+Math.random()*.18,bOp:b?.68+Math.random()*.28:.40+Math.random()*.48,tf:.007+Math.random()*.022,tp:Math.random()*Math.PI*2,ta:b?.20+Math.random()*.28:.10+Math.random()*.20,b,r:g?252:b?245:232,gr:g?214:b?240:228,bl:g?140:b?255:215};});
    let f=0;const run=()=>{ctx.clearRect(0,0,cv.width,cv.height);f++;this._stars.forEach(s=>{s.y-=s.spd;if(s.y<-5){s.y=cv.height+5;s.x=Math.random()*cv.width;}const op=Math.max(.12,Math.min(1,s.bOp+Math.sin(f*s.tf+s.tp)*s.ta));if(s.b){const g1=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.sz*5.5);g1.addColorStop(0,`rgba(${s.r},${s.gr},${s.bl},${(op*.60).toFixed(3)})`);g1.addColorStop(.35,`rgba(${s.r},${s.gr},${s.bl},${(op*.18).toFixed(3)})`);g1.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g1;ctx.beginPath();ctx.arc(s.x,s.y,s.sz*5.5,0,Math.PI*2);ctx.fill();}ctx.fillStyle=`rgba(${s.r},${s.gr},${s.bl},${op.toFixed(3)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.sz,0,Math.PI*2);ctx.fill();});this._sid=requestAnimationFrame(run);};run();
  },

  initNavFF(){document.querySelectorAll('.nav-item').forEach(item=>{item._nH=false;item.addEventListener('mouseenter',()=>{item._nH=true;this._schedNavFF(item);});item.addEventListener('mouseleave',()=>{item._nH=false;clearTimeout(item._nT);});});},
  _schedNavFF(item){if(!item._nH)return;item._nT=setTimeout(()=>{this._navFF.push(this._mkNavFF(item));this._schedNavFF(item);},170+Math.random()*310);},
  _mkNavFF(item){const el=document.createElement('span'),sz=3+Math.random()*5.5;const lx=item.offsetWidth*(.65+Math.random()*.30),ly=item.offsetHeight*(.46+Math.random()*.44);el.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;left:${lx}px;top:${ly}px;border-radius:50%;pointer-events:none;opacity:0;background:radial-gradient(circle at 38% 35%,#fff 0%,#fcf6ba 42%,#c5a059 100%);box-shadow:0 0 ${sz*1.2}px ${sz*.4}px #c5a059,0 0 ${sz*2.5}px ${sz*.8}px rgba(197,160,89,.4);z-index:10;will-change:transform,opacity;`;item.appendChild(el);return{el,age:0,maxAge:210+Math.random()*150,dAmp:(Math.random()-.5)*60,dFreq:.011+Math.random()*.020,dPhase:Math.random()*Math.PI*2,rise:.18+Math.random()*.26,riseA:.0004+Math.random()*.0009};},
  _startFFLoop(){const anim=arr=>arr.filter(f=>{f.age++;const p=f.age/f.maxAge;if(p>=1){f.el.remove();return false;}const op=p<.10?p/.10:p>.72?(1-p)/.28:1,sc=p<.12?p/.12:p>.76?(1-p)/.24:1;const dx=Math.sin(f.dFreq*f.age+f.dPhase)*f.dAmp*Math.min(p*5,1),dy=-(f.rise*f.age+f.riseA*f.age*f.age);f.el.style.opacity=Math.max(0,Math.min(1,op)).toFixed(4);f.el.style.transform=`translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${sc.toFixed(4)})`;return true;});const run=()=>{requestAnimationFrame(run);this._navFF=anim(this._navFF);this._ihFF=anim(this._ihFF);};run();},
  _initIH(){setTimeout(()=>{document.querySelectorAll('.ih').forEach(el=>this._bindIH(el));new MutationObserver(()=>document.querySelectorAll('.ih:not([data-ih])').forEach(el=>{el.setAttribute('data-ih','1');this._bindIH(el);})).observe(document.body,{subtree:true,childList:true});},400);},
  _bindIH(el){if(el._ihB)return;el._ihB=true;el._ihH=false;el.addEventListener('mouseenter',()=>{el._ihH=true;this._schedIH(el);});el.addEventListener('mouseleave',()=>{el._ihH=false;clearTimeout(el._iT);});},
  _schedIH(el){if(!el._ihH)return;el._iT=setTimeout(()=>{this._spawnIHFF(el);this._schedIH(el);},220+Math.random()*380);},
  _spawnIHFF(el){const sz=2.5+Math.random()*4.5,rect=el.getBoundingClientRect();const f=document.createElement('span');f.style.cssText=`position:fixed;width:${sz}px;height:${sz}px;pointer-events:none;border-radius:50%;z-index:99998;opacity:0;will-change:transform,opacity;background:radial-gradient(circle at 38% 35%,#fff 0%,#fcf6ba 42%,#c5a059 100%);box-shadow:0 0 ${sz*1.5}px ${sz*.5}px rgba(197,160,89,.65);left:${(rect.left+rect.width*(.60+Math.random()*.35)-sz/2).toFixed(1)}px;top:${(rect.top+rect.height*(.44+Math.random()*.46)-sz/2).toFixed(1)}px;`;document.body.appendChild(f);this._ihFF.push({el:f,age:0,maxAge:190+Math.random()*140,dAmp:(Math.random()-.5)*52,dFreq:.012+Math.random()*.022,dPhase:Math.random()*Math.PI*2,rise:.15+Math.random()*.22,riseA:.0005+Math.random()*.0008});},


  /* ─── SUBMARINE UI ─── */
  buildSub(){
    const root=document.getElementById('sub-root');if(!root)return;
    let selH=null,selS=null,selB=null,selBr=null,subRank=1;
    let mustInc=[],mustExcl=[],mustIncMaps=[],mustExclMaps=[],mustLootIds=[];
    let useTime=false,desiredMins=0,letterOnly=false;
    const getStats=()=>selH&&selS&&selB&&selBr?subCalcStats(subRank,selH,selS,selB,selBr):null;
    const getName=id=>(typeof ITEM_DB!=='undefined'&&ITEM_DB[String(id)])||`ID:${id}`;

    root.innerHTML=`<div class="sub-mogship">
<div class="sub-top-row"><div class="sub-field-grp"><label class="sub-lbl">等級</label><input type="number" id="sub-rank-inp" class="sub-inp" value="1" min="1" max="125" style="width:80px"></div><button id="sub-search-btn" class="sub-search-btn" style="margin-left:auto">搜　尋</button><button id="sub-clear-btn" class="sub-clear-btn">清除篩選</button><button id="sub-view-toggle" class="sub-view-btn" type="button">精簡</button></div>
<div class="sub-parts-row">
  <div class="sub-part-col"><label class="sub-lbl">船體</label><select id="sub-hull" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl">船尾</label><select id="sub-stern" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl">船首</label><select id="sub-bow" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl">艦橋</label><select id="sub-bridge" class="sub-sel"></select></div>
</div>
<div class="sub-stats-bar">
  <div class="sub-stat-box"><div class="sub-stat-lbl">探索性能</div><div class="sub-stat-val sv-neu" id="ss-sur">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">收集性能</div><div class="sub-stat-val sv-neu" id="ss-ret">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">巡航速度</div><div class="sub-stat-val sv-neu" id="ss-spd">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">航行距離</div><div class="sub-stat-val sv-neu" id="ss-rng">—</div></div>
  <div class="sub-stat-box"><div class="sub-stat-lbl">恩惠</div><div class="sub-stat-val sv-neu" id="ss-fav">—</div></div>
</div>
<div class="sub-filters-section">
  <button id="sub-filters-hdr" class="sub-filters-hdr" type="button">&#x25b8; 篩選條件</button>
  <div id="sub-filters-panel" class="sub-filters-panel">
<div class="sub-opts-row">
  <label class="sub-lbl">天</label><input type="number" id="sub-days" class="sub-inp" value="0" min="0" style="width:55px">
  <label class="sub-lbl">小時</label><input type="number" id="sub-hrs" class="sub-inp" value="0" min="0" max="23" style="width:55px">
  <label class="sub-lbl">分鐘</label><input type="number" id="sub-mins" class="sub-inp" value="0" min="0" max="59" style="width:55px">
  <label class="sub-chk-lbl"><input type="checkbox" id="sub-use-time"> 使用指定時間</label>
  <label class="sub-chk-lbl"><input type="checkbox" id="sub-letter"> 只顯示目的地字母</label>
</div>
<div class="sub-filter-row">
  <div class="sub-filter-col"><label class="sub-lbl">必須包含目的地</label><div class="sub-multisel-wrap" id="sub-inc-wrap"></div></div>
  <div class="sub-filter-col"><label class="sub-lbl">排除目的地</label><div class="sub-multisel-wrap" id="sub-excl-wrap"></div></div>
</div>
<div class="sub-filter-row">
  <div class="sub-filter-col"><label class="sub-lbl">必須包含航海圖</label><div class="sub-multisel-wrap" id="sub-inmap-wrap"></div></div>
  <div class="sub-filter-col"><label class="sub-lbl">排除航海圖</label><div class="sub-multisel-wrap" id="sub-exmap-wrap"></div></div>
</div>
<div class="sub-filter-col"><label class="sub-lbl">必須獲得物品</label><div class="sub-multisel-wrap" id="sub-loot-wrap"></div></div>
<div id="sub-range-disp" class="sub-range-disp">目前航行距離：—</div>
  </div>
</div>
<div id="sub-results"><div class="sub-empty">選擇部件並按搜尋查看最佳路線</div></div>
</div>`;

    ['hull','stern','bow','bridge'].forEach(slot=>{const sel=root.querySelector(`#sub-${slot}`);PARTS[slot].forEach(p=>{const o=document.createElement('option');o.value=p[0];o.textContent=`${p[0]} — ${p[1]}`;sel.appendChild(o);});});

    const updateStats=()=>{
      subRank=parseInt(root.querySelector('#sub-rank-inp')?.value)||1;
      selH=PARTS.hull.find(p=>p[0]===root.querySelector('#sub-hull').value);
      selS=PARTS.stern.find(p=>p[0]===root.querySelector('#sub-stern').value);
      selB=PARTS.bow.find(p=>p[0]===root.querySelector('#sub-bow').value);
      selBr=PARTS.bridge.find(p=>p[0]===root.querySelector('#sub-bridge').value);
      const st=getStats();if(!st)return;
      root.querySelector('#sub-range-disp').textContent=`目前航行距離：${st.rng}`;
      [['sur',2],['ret',3],['spd',4],['rng',5],['fav',6]].forEach(([k])=>{const el=root.querySelector(`#ss-${k}`);if(!el)return;const v=st[k];el.textContent=(v>=0?'+':'')+v;el.className='sub-stat-val '+(v>0?'sv-pos':v<0?'sv-neg':'sv-neu');});
    };

    const mkSecFilter=(wid,arr)=>{
      const wrap=root.querySelector(`#${wid}`);if(!wrap)return;
      const chips=document.createElement('div');chips.className='sub-chips-display';
      const cw=document.createElement('div');cw.className='sub-combo-wrap';
      const inp=document.createElement('input');inp.type='text';inp.className='sub-combo-inp';inp.placeholder='輸入字母或名稱篩選目的地\u2026';
      const dd=document.createElement('div');dd.className='sub-combo-dd';dd.style.display='none';
      const allOpts=[];
      [1,2,3,4,5,6].forEach(m=>{SUB_SECTORS.filter(s=>s[1]===m).forEach(s=>{allOpts.push({val:s[0],label:`${s[2]} \u2014 ${s[4]}`,grp:`(${m}) ${MAP_NAMES[m]}`});});});
      const renderDD=q=>{
        dd.innerHTML='';q=(q||'').trim().toLowerCase();let cg='';
        allOpts.forEach(o=>{
          const lo=o.label.toLowerCase(),letter=o.label.split('\u2014')[0].trim().toLowerCase();
          if(q&&!lo.includes(q)&&letter!==q)return;
          if(o.grp!==cg){cg=o.grp;const g=document.createElement('div');g.className='sub-combo-grp';g.textContent=cg;dd.appendChild(g);}
          const it=document.createElement('div');it.className='sub-combo-item'+(arr.includes(o.val)?' selected':'');it.textContent=(arr.includes(o.val)?'✓ ':'')+o.label;
          it.addEventListener('mousedown',e=>{e.preventDefault();const idx=arr.indexOf(o.val);if(idx>=0)arr.splice(idx,1);else arr.push(o.val);inp.value='';rc();renderDD(inp.value);});
          dd.appendChild(it);
        });
        if(!dd.children.length){const em=document.createElement('div');em.className='sub-combo-empty';em.textContent='無符合結果';dd.appendChild(em);}
      };
      inp.addEventListener('focus',()=>{renderDD(inp.value);dd.style.display='block';});
      inp.addEventListener('blur',()=>{setTimeout(()=>{dd.style.display='none';},160);});
      inp.addEventListener('input',()=>{renderDD(inp.value);dd.style.display='block';});
      cw.appendChild(inp);cw.appendChild(dd);
      const rc=()=>{chips.innerHTML='';arr.forEach((id,i)=>{const s=SECTOR_MAP.get(id);if(!s)return;const chip=document.createElement('span');chip.className='sub-chip-tag';chip.textContent=`${s[2]} ${s[4]}`;const rm=document.createElement('span');rm.className='sub-chip-rm';rm.textContent='\xd7';rm.onclick=()=>{arr.splice(i,1);rc();renderDD(inp.value);};chip.appendChild(rm);chips.appendChild(chip);});};
      wrap.appendChild(chips);wrap.appendChild(cw);
    }

    const mkMapFilter=(wid,arr)=>{
      const wrap=root.querySelector(`#${wid}`);if(!wrap)return;
      const chips=document.createElement('div');chips.className='sub-chips-display';
      const cw=document.createElement('div');cw.className='sub-combo-wrap';
      const btn=document.createElement('button');btn.type='button';btn.className='sub-map-toggle';btn.textContent='選擇航海圖 \u25be';
      const dd=document.createElement('div');dd.className='sub-combo-dd sub-map-dd';dd.style.display='none';
      [1,2,3,4,5,6].forEach(m=>{
        const it=document.createElement('div');
        it.className='sub-combo-item'+(arr.includes(m)?' selected':'');
        it.dataset.map=m;
        it.textContent=`(${m}) ${MAP_NAMES[m]}`;
        it.addEventListener('mousedown',e=>{
          e.preventDefault();
          if(arr.includes(m)){const idx=arr.indexOf(m);arr.splice(idx,1);}
          else arr.push(m);
          it.classList.toggle('selected',arr.includes(m));
          rc();
        });
        dd.appendChild(it);
      });
      btn.addEventListener('click',()=>{const open=dd.style.display==='block';dd.style.display=open?'none':'block';btn.textContent='選擇航海圖 '+(open?'\u25be':'\u25b4');});
      document.addEventListener('click',e=>{if(!cw.contains(e.target)){dd.style.display='none';btn.textContent='選擇航海圖 \u25be';}},{passive:true});
      cw.appendChild(btn);cw.appendChild(dd);
      const rc=()=>{
        chips.innerHTML='';
        arr.forEach((m,i)=>{
          const chip=document.createElement('span');chip.className='sub-chip-tag';chip.textContent=MAP_NAMES[m];
          const rm=document.createElement('span');rm.className='sub-chip-rm';rm.textContent='\xd7';
          rm.onclick=()=>{arr.splice(i,1);const it=dd.querySelector(`[data-map="${m}"]`);if(it)it.classList.remove('selected');rc();};
          chip.appendChild(rm);chips.appendChild(chip);
        });
      };
      wrap.appendChild(chips);wrap.appendChild(cw);
    }

    const mkLootFilter=(wid,arr)=>{
      const wrap=root.querySelector(`#${wid}`);if(!wrap)return;
      const chips=document.createElement('div');chips.className='sub-chips-display';
      const cw=document.createElement('div');cw.className='sub-combo-wrap';
      const inp=document.createElement('input');inp.type='text';inp.className='sub-combo-inp';inp.placeholder='輸入物品名稱搜尋\u2026';
      const dd=document.createElement('div');dd.className='sub-combo-dd';dd.style.display='none';
      const commonSet=new Set(COMMON_LOOT);
      const allIds=[...new Set(Object.values(SUB_LOOT).flat())];
      const allOpts=allIds.map(id=>({id,name:getName(id),isCommon:commonSet.has(getName(id))})).filter(o=>!o.name.startsWith('ID:')).sort((a,b)=>{if(a.isCommon!==b.isCommon)return a.isCommon?-1:1;return a.name.localeCompare(b.name,'zh-TW');});
      const renderDD=q=>{
        dd.innerHTML='';q=(q||'').trim().toLowerCase();let inC=false,inO=false;
        allOpts.forEach(o=>{
          if(q&&!o.name.toLowerCase().includes(q))return;
          if(o.isCommon&&!inC){inC=true;const g=document.createElement('div');g.className='sub-combo-grp';g.textContent='常用物品';dd.appendChild(g);}
          if(!o.isCommon&&!inO){inO=true;const g=document.createElement('div');g.className='sub-combo-grp';g.textContent='其他物品';dd.appendChild(g);}
          const it=document.createElement('div');it.className='sub-combo-item'+(arr.includes(o.id)?' selected':'');it.textContent=(arr.includes(o.id)?'✓ ':'')+o.name;
          it.addEventListener('mousedown',e=>{e.preventDefault();const idx=arr.indexOf(o.id);if(idx>=0)arr.splice(idx,1);else arr.push(o.id);inp.value='';rc();renderDD(inp.value);});
          dd.appendChild(it);
        });
        if(!dd.children.length){const em=document.createElement('div');em.className='sub-combo-empty';em.textContent='無符合結果';dd.appendChild(em);}
      };
      inp.addEventListener('focus',()=>{renderDD(inp.value);dd.style.display='block';});
      inp.addEventListener('blur',()=>{setTimeout(()=>{dd.style.display='none';},160);});
      inp.addEventListener('input',()=>{renderDD(inp.value);dd.style.display='block';});
      cw.appendChild(inp);cw.appendChild(dd);
      const rc=()=>{chips.innerHTML='';arr.forEach((id,i)=>{const chip=document.createElement('span');chip.className='sub-chip-tag';chip.textContent=getName(id);const rm=document.createElement('span');rm.className='sub-chip-rm';rm.textContent='\xd7';rm.onclick=()=>{arr.splice(i,1);rc();renderDD(inp.value);};chip.appendChild(rm);chips.appendChild(chip);});};
      wrap.appendChild(chips);wrap.appendChild(cw);
    };

    mkSecFilter('sub-inc-wrap',mustInc);mkSecFilter('sub-excl-wrap',mustExcl);
    mkMapFilter('sub-inmap-wrap',mustIncMaps);mkMapFilter('sub-exmap-wrap',mustExclMaps);
    mkLootFilter('sub-loot-wrap',mustLootIds);

    /* ── 取得（必要時建立）背景計算用的 Web Worker ──
     * 若瀏覽器不支援 Worker，或 Worker 檔案載入失敗（例如直接用
     * file:// 開啟網頁、沒有經過伺服器），自動退回主執行緒同步計算，
     * 確保搜尋功能在任何情況下都還能用，只是退回原本可能會卡頓的版本。 */
    const ensureSubWorker=()=>{
      if(this._subWorkerFailed)return null;
      if(this._subWorker)return this._subWorker;
      try{
        const w=new Worker('sub_worker.js');
        w.addEventListener('error',ev=>{
          console.warn('[XIV] sub_worker 執行失敗，改回主執行緒計算：',ev.message);
          this._subWorkerFailed=true;this._subWorker=null;
        });
        this._subWorker=w;
        return w;
      }catch(err){
        console.warn('[XIV] 瀏覽器不支援 Worker 或載入失敗，改回主執行緒計算：',err);
        this._subWorkerFailed=true;
        return null;
      }
    };

    const doSearch=()=>{
      const st=getStats();if(!st){root.querySelector('#sub-results').innerHTML='<div class="sub-empty">請先選擇所有部件</div>';return;}
      letterOnly=root.querySelector('#sub-letter')?.checked||false;
      useTime=root.querySelector('#sub-use-time')?.checked||false;
      const d=parseInt(root.querySelector('#sub-days')?.value)||0,h=parseInt(root.querySelector('#sub-hrs')?.value)||0,m=parseInt(root.querySelector('#sub-mins')?.value)||0;
      desiredMins=d*1440+h*60+m;
      const res=root.querySelector('#sub-results');res.innerHTML='<div class="sub-empty">\u22ef 計算中，請稍候</div>';

      const renderRoutes=(routes)=>{
        if(!routes.length){res.innerHTML='<div class="sub-empty">未找到符合條件的路線</div>';return;}
        const itemFreq={};
        routes.forEach(r=>r.allLoot.forEach(id=>{itemFreq[id]=(itemFreq[id]||0)+1;}));
        routes.forEach(r=>r.allLoot.sort((a,b)=>{const ap=PRIORITY_LOOT.has(a)?0:1,bp=PRIORITY_LOOT.has(b)?0:1;if(ap!==bp)return ap-bp;return (itemFreq[a]||0)-(itemFreq[b]||0);}));
        const BATCH=50;let shown=0;
        const mkRow=r=>{
          const named=r.allLoot.map(id=>getName(id)).filter(n=>!n.startsWith('ID:'));
          const MAX_SHOW=3;
          const lootDisplay=named.length===0?'\u2014':named.length<=MAX_SHOW?named.join('\u3001'):`${named.slice(0,MAX_SHOW).join('\u3001')}<span class="loot-more">\u3000\u22ef \u7b49${named.length}\u7a2e</span>`;
          const lootTitle=named.join('\u3001')||'';
          return `<tr><td data-col="rank">${r.minRank}</td><td data-col="exp">${r.exp.toLocaleString()}</td><td data-col="time">${r.timeStr}</td><td data-col="epm" class="epm-val">${r.epm.toLocaleString()}</td><td data-col="dist">${r.range}</td><td data-col="count">${r.secCount}</td><td data-col="map">${r.mapStr}</td><td data-col="sec" class="sec-path"><span class="sec-full">${r.secStr}</span><span class="sec-ltr">${r.secLetters||''}</span></td><td data-col="loot" class="loot-cell" title="${lootTitle}">${lootDisplay}</td></tr>`;
        };
        const firstBatch=routes.slice(0,BATCH);shown=firstBatch.length;
        let html=`<div class="sub-scroll-hint">\u2190 \u5de6\u53f3\u6ed1\u52d5\u67e5\u770b\u5168\u90e8\u6b04\u4f4d \u2192</div><table class="sub-table"><thead><tr><th data-col="rank">\u7b49\u7d1a</th><th data-col="exp">\u7d93\u9a57\u5024</th><th data-col="time">\u6642\u9593</th><th data-col="epm" class="sorted">EXP/\u5206\u2193</th><th data-col="dist">\u8ddd\u96e2\u6d88\u8017</th><th data-col="count">\u76ee\u7684\u5730\u6578</th><th data-col="map">\u822a\u6d77\u5716</th><th data-col="sec">\u76ee\u7684\u5730</th><th data-col="loot">\u7372\u5f97\u7269\u54c1</th></tr></thead><tbody>`;
        firstBatch.forEach(r=>{html+=mkRow(r);});html+='</tbody></table>';
        res.innerHTML=html;
        if(routes.length>shown){
          const moreBtn=document.createElement('button');
          moreBtn.className='sub-more-btn';
          moreBtn.textContent=`顯示更多（已顯示 ${shown} \uFF0F 共 ${routes.length} 筆）`;
          moreBtn.onclick=()=>{
            const tbody=res.querySelector('tbody');
            const next=routes.slice(shown,shown+BATCH);
            next.forEach(r=>{tbody.insertAdjacentHTML('beforeend',mkRow(r));});
            shown+=next.length;
            if(shown>=routes.length)moreBtn.remove();
            else moreBtn.textContent=`顯示更多（已顯示 ${shown} \uFF0F 共 ${routes.length} 筆）`;
          };
          res.appendChild(moreBtn);
        }
      };

      const runOnMainThread=()=>{
        setTimeout(()=>{
          renderRoutes(subFindRoutes(subRank,st,mustInc,mustExcl,mustIncMaps,mustExclMaps,mustLootIds,desiredMins,useTime,letterOnly));
        },50);
      };

      const worker=ensureSubWorker();
      if(!worker){runOnMainThread();return;}

      /* reqId：避免使用者連續快速按搜尋時，舊的計算結果晚回來反而蓋掉新結果 */
      const reqId=(this._subReqId=(this._subReqId||0)+1);
      const onMsg=(ev)=>{
        if(ev.data?.reqId!==reqId)return;
        worker.removeEventListener('message',onMsg);
        if(ev.data.ok){renderRoutes(ev.data.routes);}
        else{
          console.warn('[XIV] worker 計算發生錯誤，改回主執行緒計算：',ev.data.error);
          runOnMainThread();
        }
      };
      worker.addEventListener('message',onMsg);
      worker.postMessage({reqId,rank:subRank,stats:st,mustInc,mustExcl,mustIncMaps,mustExclMaps,mustLootIds,desiredMins,useTime,letterOnly});
    };

    root.querySelector('#sub-rank-inp')?.addEventListener('input',updateStats);
    ['sub-hull','sub-stern','sub-bow','sub-bridge'].forEach(id=>root.querySelector(`#${id}`)?.addEventListener('change',updateStats));
    root.querySelector('#sub-search-btn')?.addEventListener('click',doSearch);
    root.querySelector('#sub-clear-btn')?.addEventListener('click',()=>{
      [mustInc,mustExcl,mustIncMaps,mustExclMaps,mustLootIds].forEach(a=>a.length=0);
      root.querySelectorAll('.sub-chips-display').forEach(c=>c.innerHTML='');
      root.querySelectorAll('.sub-map-dd .sub-combo-item').forEach(it=>{it.classList.remove('selected');});
      root.querySelectorAll('.sub-map-toggle').forEach(t=>{t.textContent='選擇航海圖 ▾';});
      root.querySelectorAll('.sub-map-dd').forEach(d=>{d.style.display='none';});
    });
    /* ── 精簡/完整 視圖切換 ── */
    const mogship=root.querySelector('.sub-mogship');
    const viewToggle=root.querySelector('#sub-view-toggle');
    const filtersHdr=root.querySelector('#sub-filters-hdr');
    const filtersPanel=root.querySelector('#sub-filters-panel');
    const setCompact=(compact)=>{
      mogship.classList.toggle('sub-compact',compact);
      viewToggle.textContent=compact?'完整':'精簡';
      filtersPanel.classList.toggle('sub-filters-open',!compact);
      filtersHdr.textContent=(filtersPanel.classList.contains('sub-filters-open')?'▾':'▸')+' 篩選條件';
      const letterChk=root.querySelector('#sub-letter');
      if(letterChk) letterChk.checked=compact;
      try{localStorage.setItem('xiv-sub-compact',compact?'1':'0');}catch(e){}
    };
    let _sc='0';try{_sc=localStorage.getItem('xiv-sub-compact')||'0';}catch(e){}
    setCompact(_sc==='1');
    viewToggle?.addEventListener('click',()=>setCompact(!mogship.classList.contains('sub-compact')));
    filtersHdr?.addEventListener('click',()=>{
      filtersPanel.classList.toggle('sub-filters-open');
      filtersHdr.textContent=(filtersPanel.classList.contains('sub-filters-open')?'▾':'▸')+' 篩選條件';
    });
    updateStats();
    setTimeout(()=>root.querySelectorAll('.ih:not([data-ih])').forEach(el=>{el.setAttribute('data-ih','1');this._bindIH(el);}),100);
  },
};

/* window.onload 由 app_patch.js 統一管理 */
