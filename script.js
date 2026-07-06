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
    /* 表格排序狀態：sortKey 對應可排序欄位，sortDir：-1 由大到小、1 由小到大。
       currentRoutes 保留最近一次搜尋結果，點表頭切換排序時直接重排、
       不需要重新呼叫 worker 計算。 */
    let sortKey='epm',sortDir=-1,currentRoutes=[];
    const SORT_PROP={exp:'exp',time:'timeMins',epm:'epm'};
    const SORT_LABEL={exp:'\u7d93\u9a57\u5024',time:'\u6642\u9593',epm:'EXP/\u5206'};
    const getStats=()=>selH&&selS&&selB&&selBr?subCalcStats(subRank,selH,selS,selB,selBr):null;
    const getName=id=>(typeof ITEM_DB!=='undefined'&&ITEM_DB[String(id)])||`ID:${id}`;

    root.innerHTML=`<div class="sub-mogship">
<div class="sub-top-row"><div class="sub-field-grp"><label class="sub-lbl" for="sub-rank-inp">等級</label><input type="number" id="sub-rank-inp" class="sub-inp" value="1" min="1" max="125"></div><button id="sub-search-btn" class="sub-search-btn" style="margin-left:auto">搜　尋</button><button id="sub-clear-btn" class="sub-clear-btn">清除篩選</button><button id="sub-view-toggle" class="sub-view-btn" type="button">精簡</button></div>
<div class="sub-parts-row">
  <div class="sub-part-col"><label class="sub-lbl" for="sub-hull">船體</label><select id="sub-hull" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="sub-stern">船尾</label><select id="sub-stern" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="sub-bow">船首</label><select id="sub-bow" class="sub-sel"></select></div>
  <div class="sub-part-col"><label class="sub-lbl" for="sub-bridge">艦橋</label><select id="sub-bridge" class="sub-sel"></select></div>
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
  <label class="sub-chk-lbl"><input type="radio" name="sub-time-mode" id="sub-time-mode-dur" checked> 剩餘時長</label>
  <label class="sub-chk-lbl"><input type="radio" name="sub-time-mode" id="sub-time-mode-target"> 指定收成時間</label>
  <label class="sub-chk-lbl"><input type="checkbox" id="sub-letter"> 只顯示目的地字母</label>
</div>
<div class="sub-opts-row" id="sub-dur-row">
  <label class="sub-lbl" for="sub-days">天</label><input type="number" id="sub-days" class="sub-inp" value="0" min="0">
  <label class="sub-lbl" for="sub-hrs">小時</label><input type="number" id="sub-hrs" class="sub-inp" value="0" min="0" max="23">
  <label class="sub-lbl" for="sub-mins">分鐘</label><input type="number" id="sub-mins" class="sub-inp" value="0" min="0" max="59">
  <label class="sub-chk-lbl"><input type="checkbox" id="sub-use-time"> 使用指定時間</label>
</div>
<div class="sub-opts-row" id="sub-target-row" style="display:none">
  <label class="sub-lbl" for="sub-target-date">日期</label>
  <input type="date" id="sub-target-date" class="sub-inp sub-date-inp">
  <label class="sub-lbl sub-time-lbl" for="sub-target-hour">時間</label>
  <input type="number" id="sub-target-hour" class="sub-inp" value="20" min="0" max="23">
  <span class="sub-time-colon">:</span>
  <input type="number" id="sub-target-min" class="sub-inp" value="0" min="0" max="59">
  <button type="button" id="sub-ampm-btn" class="sub-ampm-btn" style="display:none">上午</button>
  <button type="button" id="sub-hourmode-btn" class="sub-hourmode-btn" title="切換12/24小時制">24小時制</button>
  <button type="button" id="sub-target-picker-btn" class="sub-picker-btn" style="display:none" aria-label="開啟日期時間選擇器" title="開啟日曆選擇器">\ud83d\udcc5</button>
  <input type="datetime-local" id="sub-target-native" class="sub-native-dt" tabindex="-1" aria-hidden="true">
  <span class="sub-target-hint" id="sub-target-hint"></span>
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

    /* ── 自訂增減按鈕：取代原生 number 輸入框的小箭頭 ──────────────────
     * 原生箭頭太小、樣式也跟網站風格不搭。這裡用兩顆夠大的「－／＋」按鈕
     * 取代，點一下增減一次，按住不放會連續增減；同時保留鍵盤直接輸入數字。
     * wrap:true 表示到達上限/下限時循環（例如小時 23 再 ＋1 會回到 0），
     * 適合時鐘型態的欄位（時、分）；天數、等級則用一般的夾在上下限。 */
    const mkStepper=(input,opts)=>{
      if(!input)return;
      opts=opts||{};
      /* 若這顆輸入框先前已經包過一次（例如切換 12/24 小時制需要換新的
         上下限），先把舊的包裝拆掉，避免重複包兩層。 */
      if(input.parentNode&&input.parentNode.classList&&input.parentNode.classList.contains('sub-stepper')){
        const oldWrap=input.parentNode;
        oldWrap.parentNode.insertBefore(input,oldWrap);
        oldWrap.remove();
      }
      const step=opts.step||1,min=opts.min,max=opts.max,wrapAround=!!opts.wrap;
      input.classList.add('sub-stepper-inp');
      if(opts.wide)input.classList.add('sub-stepper-inp-wide');
      const wrapEl=document.createElement('div');wrapEl.className='sub-stepper';
      input.parentNode.insertBefore(wrapEl,input);
      const dn=document.createElement('button');dn.type='button';dn.className='sub-step-btn sub-step-dn';dn.setAttribute('aria-label','減少');dn.textContent='\u2212';
      const up=document.createElement('button');up.type='button';up.className='sub-step-btn sub-step-up';up.setAttribute('aria-label','增加');up.textContent='\uff0b';
      wrapEl.appendChild(dn);wrapEl.appendChild(input);wrapEl.appendChild(up);
      const apply=dir=>{
        let v=(parseInt(input.value,10)||0)+dir*step;
        if(wrapAround&&min!=null&&max!=null){
          const range=max-min+1;
          v=min+(((v-min)%range)+range)%range;
        }else{
          if(min!=null)v=Math.max(min,v);
          if(max!=null)v=Math.min(max,v);
        }
        input.value=v;
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.dispatchEvent(new Event('change',{bubbles:true}));
      };
      let holdT=null,holdI=null;
      const stopHold=()=>{clearTimeout(holdT);clearInterval(holdI);holdT=null;holdI=null;};
      [[dn,-1],[up,1]].forEach(([btn,dir])=>{
        btn.addEventListener('pointerdown',e=>{
          e.preventDefault();apply(dir);stopHold();
          holdT=setTimeout(()=>{holdI=setInterval(()=>apply(dir),80);},450);
        });
        ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,stopHold));
      });
    };
    mkStepper(root.querySelector('#sub-rank-inp'),{step:1,min:1,max:125,wide:true});
    mkStepper(root.querySelector('#sub-days'),{step:1,min:0});
    mkStepper(root.querySelector('#sub-hrs'),{step:1,min:0,max:23,wrap:true});
    mkStepper(root.querySelector('#sub-mins'),{step:1,min:0,max:59,wrap:true});
    mkStepper(root.querySelector('#sub-target-min'),{step:1,min:0,max:59,wrap:true});

    /* ── 「指定收成時間」模式 ──────────────────────────────────────────
     * 自訂的「日期＋時＋分」欄位負責直接輸入／點按鈕操作；同時保留原生
     * datetime-local 彈窗（滑動式時間選擇、上下午切換都是瀏覽器內建，尤其
     * 手機上很好用），兩者同步、互不影響：
     *   - trueHour24：內部永遠用 0–23 的「真實時間」為準，是唯一的真相來源。
     *   - hourMode('24'/'12') 與 ampmIsPM 只影響「時」欄位怎麼顯示，
     *     不影響實際運算。
     *   - 📅 按鈕呼叫原生 <input type="datetime-local"> 的 showPicker()
     *     （不支援的瀏覽器會自動隱藏這顆按鈕，不影響其他操作方式）。
     * new Date() 直接讀取使用者本機系統時鐘（含時區），不需要任何權限；
     * 手動組成的 Date 物件同樣是本機時區，兩者基準一致，「目標時間－現在
     * 時間」算出來的分鐘數就是使用者真正剩餘的時間，餵給原本「總時間 ≤
     * 指定時間」的篩選邏輯（useTime/desiredMins）即可，sub_core.js 完全
     * 不用改。 */
    const durRow=root.querySelector('#sub-dur-row');
    const targetRow=root.querySelector('#sub-target-row');
    const targetDateInp=root.querySelector('#sub-target-date');
    const targetHourInp=root.querySelector('#sub-target-hour');
    const targetMinInp=root.querySelector('#sub-target-min');
    const targetHint=root.querySelector('#sub-target-hint');
    const ampmBtn=root.querySelector('#sub-ampm-btn');
    const hourModeBtn=root.querySelector('#sub-hourmode-btn');
    const pickerBtn=root.querySelector('#sub-target-picker-btn');
    const nativeDt=root.querySelector('#sub-target-native');
    const pad2=n=>String(n).padStart(2,'0');
    const toLocalDT=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

    let hourMode='24'; // '24' 或 '12'
    let ampmIsPM=false;
    let trueHour24=new Date().getHours(); // 唯一真相來源，之後會被預設值覆蓋

    const to12=h24=>{const h=h24%12;return h===0?12:h;};
    const isPMof=h24=>h24>=12;
    const to24=(h12,pm)=>{let h=h12%12;if(pm)h+=12;return h;};

    const syncHourDisplay=()=>{
      if(!targetHourInp)return;
      if(hourMode==='24'){
        targetHourInp.value=trueHour24;
      }else{
        targetHourInp.value=to12(trueHour24);
        ampmIsPM=isPMof(trueHour24);
      }
      if(ampmBtn)ampmBtn.textContent=ampmIsPM?'\u4e0b\u5348':'\u4e0a\u5348';
    };

    const rebuildHourStepper=()=>{
      if(hourMode==='24')mkStepper(targetHourInp,{step:1,min:0,max:23,wrap:true});
      else mkStepper(targetHourInp,{step:1,min:1,max:12,wrap:true});
    };

    if(targetDateInp){
      const now=new Date();
      const tmr=new Date(now.getTime()+24*3600*1000);
      targetDateInp.min=`${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}`; // 擋掉過去的日期
      targetDateInp.value=`${tmr.getFullYear()}-${pad2(tmr.getMonth()+1)}-${pad2(tmr.getDate())}`; // 預設「明天」
      trueHour24=now.getHours(); // 預設帶入「此刻」的時分，等於「明天此刻」
      if(targetMinInp)targetMinInp.value=now.getMinutes();
      if(nativeDt)nativeDt.min=toLocalDT(now);
    }
    rebuildHourStepper();
    syncHourDisplay();

    const composeTargetDate=()=>{
      const dv=targetDateInp?.value;if(!dv)return null;
      const[y,mo,da]=dv.split('-').map(Number);
      const mm=parseInt(targetMinInp?.value,10)||0;
      return new Date(y,mo-1,da,trueHour24,mm,0,0);
    };
    const updateTargetHint=()=>{
      if(!targetHint)return;
      const target=composeTargetDate();
      if(!target){targetHint.textContent='';return;}
      const diffMin=Math.round((target-new Date())/60000);
      if(diffMin<=0){targetHint.textContent='\u26a0 \u5df2\u7d93\u904e\u53bb';targetHint.classList.add('sub-target-hint-warn');return;}
      targetHint.classList.remove('sub-target-hint-warn');
      const dd=Math.floor(diffMin/1440),hh=Math.floor((diffMin%1440)/60),mm=diffMin%60;
      const parts=[];if(dd)parts.push(dd+'\u5929');if(hh)parts.push(hh+'\u5c0f\u6642');parts.push(mm+'\u5206');
      targetHint.textContent='\u8ddd\u96e2\u73fe\u5728\uff1a'+parts.join('');
    };

    /* 「時」欄位輸入：依目前模式（12／24小時制）把畫面上的數字換算回
       trueHour24（唯一真相來源），再更新提示文字。 */
    const onHourInput=()=>{
      const v=parseInt(targetHourInp.value,10)||0;
      if(hourMode==='24')trueHour24=Math.max(0,Math.min(23,v));
      else trueHour24=to24(Math.max(1,Math.min(12,v)),ampmIsPM);
      updateTargetHint();
    };
    targetHourInp?.addEventListener('input',onHourInput);
    [targetDateInp,targetMinInp].forEach(el=>el?.addEventListener('input',updateTargetHint));
    updateTargetHint();

    /* 上午／下午切換：只翻轉真實時間的上下半（±12 小時），畫面上的
       12小時制數字（例如「3」）維持不變，只是變成下午3點。 */
    ampmBtn?.addEventListener('click',()=>{
      ampmIsPM=!ampmIsPM;
      const h12=parseInt(targetHourInp.value,10)||12;
      trueHour24=to24(h12,ampmIsPM);
      syncHourDisplay();
      updateTargetHint();
    });

    /* 12／24小時制切換：轉換目前顯示、重建「時」欄位的步進器範圍
       （24小時制是 0–23，12小時制是 1–12，上下限不同）。 */
    hourModeBtn?.addEventListener('click',()=>{
      hourMode=hourMode==='24'?'12':'24';
      hourModeBtn.textContent=hourMode==='24'?'24\u5c0f\u6642\u5236':'12\u5c0f\u6642\u5236';
      if(ampmBtn)ampmBtn.style.display=hourMode==='12'?'':'none';
      rebuildHourStepper();
      syncHourDisplay();
      updateTargetHint();
    });

    /* 📅 原生選擇器：想要滑動式時間選擇、或原生日曆的上下午切換，可以點
       這顆按鈕叫出瀏覽器內建的 datetime-local 選擇器（手機上通常是滾輪式
       時間選擇，體驗很好）。選完之後同步寫回自訂欄位。不支援 showPicker()
       的瀏覽器（例如較舊的桌面版 Safari）會自動隱藏這顆按鈕，不影響其他
       操作方式。 */
    const supportsShowPicker=nativeDt&&typeof nativeDt.showPicker==='function';
    if(pickerBtn)pickerBtn.style.display=supportsShowPicker?'':'none';
    if(pickerBtn&&nativeDt){
      pickerBtn.addEventListener('click',()=>{
        const t=composeTargetDate();
        if(t)nativeDt.value=toLocalDT(t);
        try{nativeDt.showPicker();}catch(err){console.warn('[XIV] showPicker \u5931\u6557\uff1a',err);}
      });
      nativeDt.addEventListener('change',()=>{
        if(!nativeDt.value)return;
        const dt=new Date(nativeDt.value);
        if(targetDateInp)targetDateInp.value=`${dt.getFullYear()}-${pad2(dt.getMonth()+1)}-${pad2(dt.getDate())}`;
        trueHour24=dt.getHours();
        if(targetMinInp)targetMinInp.value=dt.getMinutes();
        syncHourDisplay();
        updateTargetHint();
      });
    }

    const applyTimeMode=()=>{
      const isTarget=root.querySelector('#sub-time-mode-target')?.checked;
      if(durRow)durRow.style.display=isTarget?'none':'';
      if(targetRow)targetRow.style.display=isTarget?'':'none';
      if(isTarget)updateTargetHint();
    };
    root.querySelectorAll('input[name="sub-time-mode"]').forEach(r=>r.addEventListener('change',applyTimeMode));
    applyTimeMode();

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
      const res=root.querySelector('#sub-results');

      const timeMode=root.querySelector('#sub-time-mode-target')?.checked?'target':'dur';
      if(timeMode==='target'){
        const target=composeTargetDate();
        if(!target){res.innerHTML='<div class="sub-empty">請先選擇想收成的日期與時間</div>';return;}
        const diffMin=Math.round((target-new Date())/60000);
        if(diffMin<=0){res.innerHTML='<div class="sub-empty">指定的收成時間已經過去，請重新選擇</div>';return;}
        desiredMins=diffMin;useTime=true;
      }else{
        useTime=root.querySelector('#sub-use-time')?.checked||false;
        const d=parseInt(root.querySelector('#sub-days')?.value)||0,h=parseInt(root.querySelector('#sub-hrs')?.value)||0,m=parseInt(root.querySelector('#sub-mins')?.value)||0;
        desiredMins=d*1440+h*60+m;
      }

      res.innerHTML='<div class="sub-empty">\u22ef 計算中，請稍候</div>';

      const renderRoutes=(routes)=>{
        currentRoutes=routes; // 記住這次搜尋結果，供之後點表頭排序重用，不必重新計算
        // sub-letter: full-mode + letterOnly checkbox → show .sec-ltr instead of .sec-full
        // sub-compact handles its own display separately; clear sub-letter in compact mode
        mogship.classList.toggle('sub-letter', letterOnly && !mogship.classList.contains('sub-compact'));
        if(!routes.length){res.innerHTML='<div class="sub-empty">未找到符合條件的路線</div>';return;}
        const itemFreq={};
        routes.forEach(r=>r.allLoot.forEach(id=>{itemFreq[id]=(itemFreq[id]||0)+1;}));
        routes.forEach(r=>r.allLoot.sort((a,b)=>{const ap=PRIORITY_LOOT.has(a)?0:1,bp=PRIORITY_LOOT.has(b)?0:1;if(ap!==bp)return ap-bp;return (itemFreq[a]||0)-(itemFreq[b]||0);}));

        /* 依目前 sortKey / sortDir 排序（複製陣列，不改動原始 routes 順序） */
        const prop=SORT_PROP[sortKey]||'epm';
        const sorted=[...routes].sort((a,b)=>sortDir*(a[prop]-b[prop]));

        const BATCH=50;let shown=0;
        const mkRow=r=>{
          const named=r.allLoot.map(id=>getName(id)).filter(n=>!n.startsWith('ID:'));
          const MAX_SHOW=3;
          const lootDisplay=named.length===0?'\u2014':named.length<=MAX_SHOW?named.join('\u3001'):`${named.slice(0,MAX_SHOW).join('\u3001')}<span class="loot-more">\u3000\u22ef \u7b49${named.length}\u7a2e</span>`;
          const lootTitle=named.join('\u3001')||'';
          return `<tr><td data-col="rank">${r.minRank}</td><td data-col="exp">${r.exp.toLocaleString()}</td><td data-col="time">${r.timeStr}</td><td data-col="epm" class="epm-val">${r.epm.toLocaleString()}</td><td data-col="dist">${r.range}</td><td data-col="count">${r.secCount}</td><td data-col="map">${r.mapStr}</td><td data-col="sec" class="sec-path"><span class="sec-full">${r.secStr}</span><span class="sec-ltr">${r.secLetters||''}</span></td><td data-col="loot" class="loot-cell" title="${lootTitle}">${lootDisplay}</td></tr>`;
        };

        /* 可排序欄位（經驗值／時間／EXP每分）表頭：目前排序中的欄位顯示 ↓／↑ 箭頭與亮色，
           其餘欄位維持原樣。標記 sub-sort-th 讓 CSS 顯示可點擊樣式並綁定 click 事件。 */
        const thCell=(col,label)=>{
          if(!SORT_PROP[col])return `<th data-col="${col}">${label}</th>`;
          const active=sortKey===col;
          const arrow=active?(sortDir===-1?'\u2193':'\u2191'):'';
          return `<th data-col="${col}" class="sub-sort-th${active?' sorted':''}">${label}${arrow?'\u2009'+arrow:''}</th>`;
        };

        const firstBatch=sorted.slice(0,BATCH);shown=firstBatch.length;
        let html=`<div class="sub-scroll-hint">\u2190 \u5de6\u53f3\u6ed1\u52d5\u67e5\u770b\u5168\u90e8\u6b04\u4f4d \u2192</div><table class="sub-table"><thead><tr>`+
          thCell('rank','\u7b49\u7d1a')+
          thCell('exp',SORT_LABEL.exp)+
          thCell('time',SORT_LABEL.time)+
          thCell('epm',SORT_LABEL.epm)+
          thCell('dist','\u8ddd\u96e2\u6d88\u8017')+
          thCell('count','\u76ee\u7684\u5730\u6578')+
          thCell('map','\u822a\u6d77\u5716')+
          thCell('sec','\u76ee\u7684\u5730')+
          thCell('loot','\u7372\u5f97\u7269\u54c1')+
          `</tr></thead><tbody>`;
        firstBatch.forEach(r=>{html+=mkRow(r);});html+='</tbody></table>';
        res.innerHTML=html;

        /* 點表頭切換排序：同一欄再點一次→反轉方向；點別欄→切到該欄，預設由大到小。
           純前端重排 currentRoutes，不重新呼叫 worker。 */
        res.querySelectorAll('th.sub-sort-th').forEach(th=>{
          th.addEventListener('click',()=>{
            const col=th.dataset.col;
            if(sortKey===col)sortDir=-sortDir;else{sortKey=col;sortDir=-1;}
            renderRoutes(currentRoutes);
          });
        });

        if(sorted.length>shown){
          const moreBtn=document.createElement('button');
          moreBtn.className='sub-more-btn';
          moreBtn.textContent=`顯示更多（已顯示 ${shown} \uFF0F 共 ${sorted.length} 筆）`;
          moreBtn.onclick=()=>{
            const tbody=res.querySelector('tbody');
            const next=sorted.slice(shown,shown+BATCH);
            next.forEach(r=>{tbody.insertAdjacentHTML('beforeend',mkRow(r));});
            shown+=next.length;
            if(shown>=sorted.length)moreBtn.remove();
            else moreBtn.textContent=`顯示更多（已顯示 ${shown} \uFF0F 共 ${sorted.length} 筆）`;
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
      mogship.classList.remove('sub-letter'); // clear on any mode switch; re-applied by renderRoutes after next search
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
