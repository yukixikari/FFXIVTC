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
    let sortKey='epm',sortDir=-1,currentRoutes=[],lootToggleSeq=0;
    const SORT_PROP={exp:'exp',time:'timeMins',epm:'epm'};
    const SORT_LABEL={exp:'\u7d93\u9a57\u5024',time:'\u6642\u9593',epm:'EXP/\u5206'};
    const getStats=()=>selH&&selS&&selB&&selBr?subCalcStats(subRank,selH,selS,selB,selBr):null;
    const getName=id=>(typeof ITEM_DB!=='undefined'&&ITEM_DB[String(id)])||`ID:${id}`;

    /* ── 點擊式資訊彈窗（取代原生 title）──────────────────────────────
     * 原生 title 只有滑鼠停在原地才會顯示，稍微一動就消失，讀不完內容，
     * 手機上也不可靠。改成：帶有 data-tip 屬性的元素，點擊後在旁邊彈出
     * 一個小方塊顯示完整內容，點別的地方或再點一次就關閉。只需要綁定
     * 一次，整個頁面共用（用 window 旗標避免重複綁定）。 */
    if(!window._subTipInit){
      window._subTipInit=true;
      let tipBox=null,tipTrigger=null;
      const closeTip=()=>{if(tipBox){tipBox.remove();tipBox=null;tipTrigger=null;}};
      const openTip=(trigger)=>{
        closeTip();
        const box=document.createElement('div');
        box.className='sub-tip-box';
        box.innerHTML=trigger.getAttribute('data-tip').replace(/\n/g,'<br>');
        document.body.appendChild(box);
        const r=trigger.getBoundingClientRect();
        let left=r.left,top=r.bottom+6;
        const bw=box.offsetWidth,bh=box.offsetHeight;
        if(left+bw>window.innerWidth-8)left=Math.max(8,window.innerWidth-bw-8);
        if(top+bh>window.innerHeight-8)top=r.top-bh-6;
        box.style.left=left+'px';box.style.top=top+'px';
        tipBox=box;tipTrigger=trigger;
      };
      document.addEventListener('click',e=>{
        const toggleBtn=e.target.closest('.loot-toggle');
        if(toggleBtn){
          e.stopPropagation();
          closeTip();
          const target=document.getElementById(toggleBtn.dataset.target);
          if(!target)return;
          const isHidden=target.style.display==='none';
          target.style.display=isHidden?'inline':'none';
          toggleBtn.textContent=isHidden?'\u3000\u6536\u5408':`\u3000\u22ef\u7b49${toggleBtn.dataset.total}\u7a2e`;
          return;
        }
        const trigger=e.target.closest('[data-tip]');
        if(trigger){
          e.stopPropagation();
          if(tipTrigger===trigger){closeTip();}else{openTip(trigger);}
        }else if(!e.target.closest('.sub-tip-box')){
          closeTip();
        }
      });
      window.addEventListener('scroll',closeTip,{passive:true});
      window.addEventListener('resize',closeTip);
    }

    root.innerHTML=`<div class="sub-mogship">
<div class="sub-top-row"><div class="sub-field-grp"><label class="sub-lbl" for="sub-rank-inp">等級</label><input type="number" id="sub-rank-inp" class="sub-inp" value="1" min="1" max="125"></div><button id="sub-search-btn" class="sub-search-btn" style="margin-left:auto">搜　尋</button><button id="sub-clear-btn" class="sub-clear-btn">清除篩選</button><button id="sub-view-toggle" class="sub-view-btn" type="button">切換為精簡模式</button></div>
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
  <div class="sub-stat-box"><div class="sub-stat-lbl">承載力</div><div class="sub-stat-val sv-neu" id="ss-cap">—</div></div>
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
  <span class="sub-picker-wrap">
    <button type="button" id="sub-target-picker-btn" class="sub-picker-btn" style="display:none" aria-label="開啟日期時間選擇器" title="開啟日曆選擇器">\ud83d\udcc5</button>
    <input type="datetime-local" id="sub-target-native" class="sub-native-dt" tabindex="-1" aria-hidden="true">
  </span>
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
<div class="sub-filter-col"><label class="sub-lbl">必須獲得物品</label><div class="sub-multisel-wrap" id="sub-loot-wrap"></div><label class="sub-chk-lbl sub-loot-strict-lbl"><input type="checkbox" id="sub-loot-strict"> 每個目的地都至少有其中一項物品</label></div>
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
       操作方式。
       ★ Firefox 雖然也有 showPicker() API，但彈出的選擇器只管日期，時間
       要在「輸入框本身」用內建小箭頭/打字調整——而我們這顆原生欄位刻意
       做成隱形疊在按鈕上面，Firefox 使用者完全看不到、摸不到那個時間輸入
       介面，體驗是殘缺的（只能選日期）。這是 Firefox 本身跟 Chromium 系
       瀏覽器實作方式不同造成的，沒辦法用 CSS/JS 修正，所以額外判斷排除，
       Firefox 上直接隱藏這顆按鈕，只保留一定完整可用的自訂欄位操作方式。 */
    const isFirefox=/firefox/i.test(navigator.userAgent);
    const supportsShowPicker=nativeDt&&typeof nativeDt.showPicker==='function'&&!isFirefox;
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
      /* 容量：四個部件的「造價(components)」總和，不能超過目前等級的容量上限
         （官方機制：パーツコストの合計＝＜キャパシティ，潛水艇／飛空艇皆同）。 */
      const capEl=root.querySelector('#ss-cap');
      if(capEl){
        const curCap=[selH,selS,selB,selBr].reduce((s,p)=>s+(p?p[7]:0),0);
        const maxCap=(SUB_CAP[subRank]??'—');
        capEl.textContent=`${curCap}/${maxCap}`;
        capEl.className='sub-stat-val '+(typeof maxCap==='number'&&curCap>maxCap?'sv-neg':'sv-neu');
      }
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
      const lootStrict=root.querySelector('#sub-loot-strict')?.checked||false;
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

      const TIER_LABEL={1:'T1',2:'T2',3:'T3'};

      /* 依目前配置(curStats)判斷某個 tier 在某個目的地是否算「達標」。
         T1 一律算達標（隨時拿得到）；T2/T3 比對該目的地的探索性能門檻(sec[10]/sec[11])。 */
      const tierMetAt=(sec,tier,curStats)=>{
        if(tier===1)return true;
        if(tier===2)return curStats.sur>=sec[10];
        return curStats.sur>=sec[11];
      };

      /* 把整條路線（可能多個目的地）的物品，依「最容易達成的 tier」合併分組。
         同一物品若在路線上多個目的地都拿得到，取門檻最低（最容易）的那個 tier；
         sources 記錄每個來源目的地與門檻，供 tooltip 顯示。 */
      const buildLootDetail=(secIds)=>{
        const detail={};
        secIds.forEach(id=>{
          const sec=SECTOR_MAP.get(id);
          const tierData=SUB_LOOT_TIER[id];
          if(!sec||!tierData)return;
          [1,2,3].forEach(t=>{
            (tierData[t]||[]).forEach(itemId=>{
              if(!detail[itemId])detail[itemId]={minTier:t,sources:[]};
              else if(t<detail[itemId].minTier)detail[itemId].minTier=t;
              detail[itemId].sources.push({id,letter:sec[2],name:sec[4],tier:t});
            });
          });
        });
        return detail;
      };

      /* 組出「合併後的 T1/T2/T3 物品清單」HTML：每層最多顯示 MAX_SHOW 項，
         超過的用「...等N種」收起來（滑鼠移過去看完整清單），避免一條路線物品
         一多，整行就被撐得很長。達標的物品正常顯示，未達標的變淺色；每個
         物品滑鼠移過去（或點一下）顯示來源目的地與門檻細節。 */
      const buildLootCell=(secIds,curStats)=>{
        const detail=buildLootDetail(secIds);
        const groups={1:[],2:[],3:[]};
        Object.entries(detail).forEach(([idStr,info])=>{
          const id=+idStr;const name=getName(id);
          if(name.startsWith('ID:'))return;
          groups[info.minTier].push({id,name,sources:info.sources.filter(s=>s.tier===info.minTier)});
        });
        [1,2,3].forEach(t=>groups[t].sort((a,b)=>a.name.localeCompare(b.name,'zh-TW')));
        const MAX_SHOW=4;
        let html='';
        [1,2,3].forEach(t=>{
          const items=groups[t];
          if(!items.length)return;
          const mkItem=it=>{
            const met=t===1||it.sources.some(s=>tierMetAt(SECTOR_MAP.get(s.id),t,curStats));
            /* T1 沒有門檻可比對，但一樣給來源清單當作資訊，這樣每個物品
               不管哪個 tier，點下去都會有反應，不會讓人以為壞了。 */
            const tip='\u4f86\u6e90\uff1a\n'+it.sources.map(s=>{
              const sec=SECTOR_MAP.get(s.id);
              if(t===1)return `${s.letter} ${s.name}`;
              const thr=t===2?sec[10]:sec[11];
              return `${s.letter} ${s.name}\uff08\u63a2\u7d22\u6027\u80fd\u9700\u2265${thr}\uff09`;
            }).join('\n');
            return `<span class="loot-item${met?'':' loot-unmet'}" data-tip="${tip}">${it.name}</span>`;
          };
          const shown=items.slice(0,MAX_SHOW);
          const rest=items.slice(MAX_SHOW);
          let itemHtml=shown.map(mkItem).join('\u3001');
          if(rest.length){
            /* 「等N種」不再是純文字彈窗，而是一個展開/收合按鈕：點下去把剩下
               的物品用同一套 mkItem 展開成真正可點擊、有達標判斷的物品，
               再點一次收回去。 */
            lootToggleSeq++;
            const gid='loot-ext-'+lootToggleSeq;
            const restHtml=rest.map(mkItem).join('\u3001');
            itemHtml+=`<span class="loot-toggle" data-target="${gid}" data-total="${items.length}">\u3000\u22ef\u7b49${items.length}\u7a2e</span>`+
              `<span class="loot-extra" id="${gid}" style="display:none">\u3001${restHtml}</span>`;
          }
          html+=`<div class="loot-tier-row loot-tier-${t}"><span class="loot-tier-badge">${TIER_LABEL[t]}</span><span class="loot-tier-items">${itemHtml}</span></div>`;
        });
        return html||'<span class="loot-empty">\u2014</span>';
      };

      /* 組出目的地門檻列：每個目的地一個字母＋三個小圓點（探索／收集／恩惠），
         圓點顏色代表達標程度，數字細節收進整塊的 tooltip 裡，滑鼠移過去
         （或手機點一下）才看到完整數字，平常只佔很小的空間、不會把欄位撐寬。 */
      const buildThresholdStrip=(secIds,curStats)=>secIds.map(id=>{
        const sec=SECTOR_MAP.get(id);if(!sec)return'';
        const favor=sec[9],t2=sec[10],t3=sec[11],normal=sec[12],optimal=sec[13];
        const survCls=curStats.sur>=t3?'thr-full':curStats.sur>=t2?'thr-part':'thr-none';
        const retCls=curStats.ret>=optimal?'thr-full':curStats.ret>=normal?'thr-part':'thr-none';
        const favCls=curStats.fav>=favor?'thr-full':'thr-none';
        const tip=`${sec[2]} ${sec[4]}\n\ud83d\udc41 \u63a2\u7d22\u6027\u80fd\u9700 T2 ${t2}\uff0fT3 ${t3}\uff08\u4f60\u76ee\u524d ${curStats.sur}\uff09\n`+
          `\u2693 \u6536\u96c6\u6027\u80fd\u9700\u4e00\u822c ${normal}\uff0f\u6700\u4f73 ${optimal}\uff08\u4f60\u76ee\u524d ${curStats.ret}\uff09\n`+
          `\ud83c\udf40 \u6069\u60e0\u9700 ${favor}\uff08\u4f60\u76ee\u524d ${curStats.fav}\uff09`;
        return `<span class="thr-stop" data-tip="${tip}"><b class="thr-letter">${sec[2]}</b>`+
          `<i class="thr-dot ${survCls}"></i><i class="thr-dot ${retCls}"></i><i class="thr-dot ${favCls}"></i>`+
        `</span>`;
      }).join('');

      const renderRoutes=(routes)=>{
        currentRoutes=routes; // 記住這次搜尋結果，供之後點表頭排序重用，不必重新計算
        // sub-letter: full-mode + letterOnly checkbox → show .sec-ltr instead of .sec-full
        // sub-compact handles its own display separately; clear sub-letter in compact mode
        mogship.classList.toggle('sub-letter', letterOnly && !mogship.classList.contains('sub-compact'));
        if(!routes.length){res.innerHTML='<div class="sub-empty">未找到符合條件的路線</div>';return;}

        /* 目前配置的探索/收集/恩惠數值，整批路線共用同一份（配置沒變就不用重算）。 */
        const st=getStats();
        const curStats=st?{sur:st.sur,ret:st.ret,fav:st.fav}:{sur:0,ret:0,fav:0};

        /* 依目前 sortKey / sortDir 排序（複製陣列，不改動原始 routes 順序） */
        const prop=SORT_PROP[sortKey]||'epm';
        const sorted=[...routes].sort((a,b)=>sortDir*(a[prop]-b[prop]));

        const BATCH=50;let shown=0;
        const mkRow=r=>{
          const lootHtml=buildLootCell(r.secIds,curStats);
          const thrHtml=buildThresholdStrip(r.secIds,curStats);
          return `<tr><td data-col="rank">${r.minRank}</td><td data-col="exp">${r.exp.toLocaleString()}</td><td data-col="time">${r.timeStr}</td><td data-col="epm" class="epm-val">${r.epm.toLocaleString()}</td><td data-col="dist">${r.range}</td><td data-col="tank">${r.tank}</td><td data-col="count">${r.secCount}</td><td data-col="map">${r.mapStr}</td><td data-col="sec" class="sec-path"><span class="sec-full">${r.secStr}</span><span class="sec-ltr">${r.secLetters||''}</span><div class="sub-thr-strip">${thrHtml}</div></td><td data-col="loot" class="loot-cell-tiered">${lootHtml}</td></tr>`;
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
        const legendHtml=`<div class="sub-legend">`+
          `<span class="sub-legend-title">\u5099\u8a3b</span>`+
          `<span><b class="loot-tier-badge tier-badge-1">T1</b> \u4e00\u822c</span>`+
          `<span><b class="loot-tier-badge tier-badge-2">T2</b> \u9700\u63a2\u7d22\u6027\u80fd\u9054\u6a19</span>`+
          `<span><b class="loot-tier-badge tier-badge-3">T3</b> \u9700\u63a2\u7d22\u6027\u80fd\u9054\u6700\u4f73</span>`+
          `<span class="sub-legend-sep">\u6dfa\u8272\u5b57\uff1d\u5c1a\u672a\u9054\u6a19</span>`+
          `<span class="sub-legend-sep">\u5713\u9ede\uff08\u63a2\u7d22\uff0f\u6536\u96c6\uff0f\u6069\u60e0\uff09\uff1a<i class="thr-dot thr-full"></i>\u6700\u4f73\uff08\u5be6\u5fc3\uff09\u3000<i class="thr-dot thr-part"></i>\u9054\u6a19\uff08\u534a\u5713\uff09\u3000<i class="thr-dot thr-none"></i>\u672a\u9054\u6a19\uff08\u7a7a\u5fc3\uff09</span>`+
          `<span class="sub-legend-sep">\u9ede\u64ca\u7269\u54c1\u540d\u7a31\u6216\u5713\u9ede\u53ef\u67e5\u770b\u5b8c\u6574\u8cc7\u8a0a</span>`+
        `</div>`;
        let html=legendHtml+`<div class="sub-scroll-hint">\u2190 \u5de6\u53f3\u6ed1\u52d5\u67e5\u770b\u5168\u90e8\u6b04\u4f4d \u2192</div><table class="sub-table"><thead><tr>`+
          thCell('rank','\u7b49\u7d1a')+
          thCell('exp',SORT_LABEL.exp)+
          thCell('time',SORT_LABEL.time)+
          thCell('epm',SORT_LABEL.epm)+
          thCell('dist','\u8ddd\u96e2\u6d88\u8017')+
          thCell('tank','\u9752\u78f7\u6c34\u6d88\u8017')+
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
          renderRoutes(subFindRoutes(subRank,st,mustInc,mustExcl,mustIncMaps,mustExclMaps,mustLootIds,desiredMins,useTime,letterOnly,lootStrict));
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
      worker.postMessage({reqId,rank:subRank,stats:st,mustInc,mustExcl,mustIncMaps,mustExclMaps,mustLootIds,desiredMins,useTime,letterOnly,lootStrict});
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
      const strictChk=root.querySelector('#sub-loot-strict');if(strictChk)strictChk.checked=false;
    });
    /* ── 精簡/完整 視圖切換 ── */
    const mogship=root.querySelector('.sub-mogship');
    const viewToggle=root.querySelector('#sub-view-toggle');
    const filtersHdr=root.querySelector('#sub-filters-hdr');
    const filtersPanel=root.querySelector('#sub-filters-panel');
    const setCompact=(compact)=>{
      mogship.classList.toggle('sub-compact',compact);
      mogship.classList.remove('sub-letter'); // clear on any mode switch; re-applied by renderRoutes after next search
      viewToggle.textContent=compact?'\u5207\u63db\u70ba\u5b8c\u6574\u6a21\u5f0f':'\u5207\u63db\u70ba\u7cbe\u7c21\u6a21\u5f0f';
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
