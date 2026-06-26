/* macro_tool.js v2 — FF14 巨集建立工具 */
(function(){
'use strict';
var MAX=15,MAX_C=180,WARN_C=150;
var lines=[],nextId=1,globalCfg={merrorOff:false,mlock:false},pickerCat=null,splitData=null,activeLineId=null;

/* ── Sound effects ── */
var SE=[{v:'',l:'無音效'}];for(var _i=1;_i<=16;_i++)SE.push({v:'<se.'+_i+'>',l:'音效 '+_i});

/* ── Target options ── */
var TGT=[
  {v:'',l:'（不指定目標）'},{v:'<t>',l:'<t>　當前目標'},{v:'<me>',l:'<me>　自己'},
  {v:'<f>',l:'<f>　焦點目標'},{v:'<tt>',l:'<tt>　目標的目標'},
  {v:'<lt>',l:'<lt>　上次目標'},{v:'<mo>',l:'<mo>　滑鼠指向的角色'},
  {v:'<r>',l:'<r>　最後傳悄悄話給你的人'},{v:'<le>',l:'<le>　最後選中的敵人'},
  {v:'<la>',l:'<la>　最後攻擊你的敵人'},{v:'<c>',l:'<c>　自己的搭擋'},
  {v:'<p>',l:'<p>　自己的召喚獸'},
  {v:'<1>',l:'<1>　小隊1號'},{v:'<2>',l:'<2>　小隊2號'},{v:'<3>',l:'<3>　小隊3號'},
  {v:'<4>',l:'<4>　小隊4號'},{v:'<5>',l:'<5>　小隊5號'},{v:'<6>',l:'<6>　小隊6號'},
  {v:'<7>',l:'<7>　小隊7號'},{v:'<8>',l:'<8>　小隊8號'},
  {v:'<attack1>',l:'<attack1>　攻擊標記1'},{v:'<attack2>',l:'<attack2>　攻擊標記2'},
  {v:'<attack3>',l:'<attack3>　攻擊標記3'},{v:'<attack4>',l:'<attack4>　攻擊標記4'},
  {v:'<attack5>',l:'<attack5>　攻擊標記5'},{v:'<bind1>',l:'<bind1>　止步標記1'},
  {v:'<bind2>',l:'<bind2>　止步標記2'},{v:'<bind3>',l:'<bind3>　止步標記3'},
  {v:'<stop1>',l:'<stop1>　禁止標記1'},{v:'<stop2>',l:'<stop2>　禁止標記2'},
  {v:'<square>',l:'<square>　方塊標記'},{v:'<circle>',l:'<circle>　圓圈標記'},
  {v:'<cross>',l:'<cross>　叉標記'},{v:'<triangle>',l:'<triangle>　三角標記'},
  {v:'<e1>',l:'<e1>　PvP敵方1號'},{v:'<e2>',l:'<e2>　PvP敵方2號'},
  {v:'<e3>',l:'<e3>　PvP敵方3號'},{v:'<e4>',l:'<e4>　PvP敵方4號'},
  {v:'<e5>',l:'<e5>　PvP敵方5號'},{v:'custom',l:'自訂輸入...'}
];

/* ── Chat channels ── */
var CH=[
  {v:'p',l:'小隊 /p'},{v:'s',l:'說話 /s（20公尺）'},{v:'y',l:'呼喊 /y（100公尺）'},
  {v:'sh',l:'喊話 /sh（整個區域）'},{v:'a',l:'團隊 /a'},{v:'fc',l:'部隊 /fc'},
  {v:'pt',l:'戰隊 /pt'},{v:'l1',l:'通訊貝1 /l1'},{v:'l2',l:'通訊貝2 /l2'},
  {v:'l3',l:'通訊貝3 /l3'},{v:'l4',l:'通訊貝4 /l4'},{v:'l5',l:'通訊貝5 /l5'},
  {v:'l6',l:'通訊貝6 /l6'},{v:'l7',l:'通訊貝7 /l7'},{v:'l8',l:'通訊貝8 /l8'},
  {v:'cwl1',l:'跨服通訊貝1 /cwl1'},{v:'cwl2',l:'跨服通訊貝2 /cwl2'},
  {v:'cwl3',l:'跨服通訊貝3 /cwl3'},{v:'cwl4',l:'跨服通訊貝4 /cwl4'},
  {v:'b',l:'新人頻道 /b'},{v:'e',l:'默語（僅自己）/e'}
];

/* ── MICON types ── */
var MICON_T=[
  {v:'action',l:'技能 (action)'},{v:'general',l:'通用技能 (general)'},
  {v:'blueaction',l:'青魔法 (blueaction)'},{v:'pvpaction',l:'PvP技能 (pvpaction)'},
  {v:'item',l:'道具 (item)'},{v:'emote',l:'情感動作 (emote)'},
  {v:'mount',l:'坐騎 (mount)'},{v:'minion',l:'寵物 (minion)'},
  {v:'gearset',l:'裝備套裝編號 (gearset)'},{v:'classjob',l:'職業圖示 (classjob)'},
  {v:'marking',l:'目標標記 (marking)'},{v:'waymark',l:'場景標記 (waymark)'}
];

/* ── HUD windows ── */
var HUD_W=[
  {v:'PartyList',l:'小隊列表'},{v:'EnemyList',l:'敵對列表'},
  {v:'TargetInfo',l:'目標情報'},{v:'FocusTarget',l:'焦點目標情報'},
  {v:'NaviMap',l:'導向地圖'},{v:'MyParam',l:'角色參數'},
  {v:'LimitGauge',l:'極限槽'},{v:'ExpBar',l:'經驗值欄'},
  {v:'BuffDebuffStatus',l:'狀態效果'},{v:'MainCommand',l:'快捷指令'},
  {v:'GeneralInfo',l:'基本情報'},{v:'Hotbar1',l:'熱鍵欄1'},
  {v:'Hotbar2',l:'熱鍵欄2'},{v:'Hotbar3',l:'熱鍵欄3'},
  {v:'Hotbar4',l:'熱鍵欄4'},{v:'Hotbar5',l:'熱鍵欄5'},
  {v:'Crosshotbar',l:'十字熱鍵欄'}
];

/* ── Battleeffect ── */
var BE_T=[{v:'self',l:'自己'},{v:'party',l:'小隊成員'},{v:'other',l:'其他玩家'},{v:'enemypc',l:'對戰敵方玩家'}];
var BE_L=[{v:'all',l:'完全顯示'},{v:'simple',l:'簡單顯示'},{v:'off',l:'不顯示'}];

/* ── Nameplate ── */
var NP_T=[{v:'all',l:'全部玩家'},{v:'self',l:'自己'},{v:'party',l:'小隊成員'},{v:'alliance',l:'團隊成員'},{v:'other',l:'其他人'},{v:'friend',l:'好友'},{v:'feast',l:'群狼盛宴中的敵人'}];
var NP_L=[{v:'1',l:'一直顯示'},{v:'2',l:'戰鬥時顯示'},{v:'3',l:'選為目標時顯示'},{v:'4',l:'不顯示'}];

/* ── ItemSort areas & criteria ── */
var IS_AREAS=[
  {v:'inventory',l:'背包（物品欄）',g:'常用'},
  {v:'armourychest',l:'兵裝庫（整個）',g:'常用'},
  {v:'saddlebag',l:'陸行鳥鞍囊',g:'常用'},
  {v:'rightsaddlebag',l:'陸行鳥鞍囊2（右）',g:'常用'},
  {v:'retainer',l:'雇員物品',g:'常用'},
  {v:'main',l:'兵裝庫：主手',g:'兵裝庫子分類'},
  {v:'sub',l:'兵裝庫：副手',g:'兵裝庫子分類'},
  {v:'head',l:'兵裝庫：頭部',g:'兵裝庫子分類'},
  {v:'body',l:'兵裝庫：身體',g:'兵裝庫子分類'},
  {v:'hands',l:'兵裝庫：手部',g:'兵裝庫子分類'},
  {v:'legs',l:'兵裝庫：腿部',g:'兵裝庫子分類'},
  {v:'feet',l:'兵裝庫：腳部',g:'兵裝庫子分類'},
  {v:'neck',l:'兵裝庫：頸部（項鍊）',g:'兵裝庫子分類'},
  {v:'ears',l:'兵裝庫：耳部（耳飾）',g:'兵裝庫子分類'},
  {v:'wrists',l:'兵裝庫：腕部（手鐲）',g:'兵裝庫子分類'},
  {v:'rings',l:'兵裝庫：戒指',g:'兵裝庫子分類'},
  {v:'soul',l:'兵裝庫：靈魂水晶',g:'兵裝庫子分類'}
];
var IS_C=[
  {v:'itemlevel',l:'物品品級',o:true},{v:'category',l:'道具種類（分類）',o:true},
  {v:'id',l:'道具編號',o:true},{v:'spiritbond',l:'精煉度',o:true},
  {v:'level',l:'裝備等級',o:true},{v:'stack',l:'打包數量',o:true},
  {v:'hq',l:'優質道具（HQ）',o:true},{v:'materia',l:'魔晶石數量',o:true},
  {v:'tab',l:'分欄排列（不需選升降序）',o:false},
  {v:'physicaldamage',l:'物理基本性能',o:true},{v:'magicdamage',l:'魔法基本性能',o:true},
  {v:'delay',l:'攻擊間隔',o:true},{v:'physicalautoattack',l:'物理自動攻擊',o:true},
  {v:'blockrate',l:'格擋發動力',o:true},{v:'blockstrength',l:'格擋性能',o:true},
  {v:'defense',l:'物理防禦力',o:true},{v:'magicdefense',l:'魔法防禦力',o:true},
  {v:'str',l:'力量 STR',o:true},{v:'dex',l:'靈巧 DEX',o:true},
  {v:'vit',l:'耐力 VIT',o:true},{v:'int',l:'智力 INT',o:true},
  {v:'mnd',l:'精神 MND',o:true},{v:'craftsmanship',l:'作業精度（製作）',o:true},
  {v:'control',l:'加工精度（製作）',o:true},{v:'gathering',l:'採集力（採集）',o:true},
  {v:'perception',l:'感知力（採集）',o:true}
];

/* ── Named emotes ── */
var EMOTES=[
  {v:'surprised',l:'驚訝'},{v:'angry',l:'不滿'},{v:'furious',l:'憤怒'},
  {v:'blush',l:'害羞'},{v:'bow',l:'行禮'},{v:'cheer',l:'加油'},
  {v:'clap',l:'拍手'},{v:'beckon',l:'招手'},{v:'comfort',l:'安慰'},
  {v:'cry',l:'哭泣'},{v:'dance',l:'跳舞'},{v:'doubt',l:'質疑'},
  {v:'doze',l:'打盹'},{v:'fume',l:'後悔'},{v:'goodbye',l:'道別'},
  {v:'wave',l:'揮手'},{v:'huh',l:'莫名'},{v:'joy',l:'高興'},
  {v:'kneel',l:'下跪'},{v:'chuckle',l:'輕笑'},{v:'laugh',l:'大笑'},
  {v:'lookout',l:'張望'},{v:'me',l:'展示'},{v:'no',l:'搖頭'},
  {v:'deny',l:'否定'},{v:'panic',l:'慌亂'},{v:'point',l:'指向'},
  {v:'poke',l:'戳指'},{v:'congratulate',l:'稱讚'},{v:'psych',l:'激勵'},
  {v:'salute',l:'敬禮'},{v:'shocked',l:'震驚'},{v:'shrug',l:'聳肩'},
  {v:'rally',l:'鼓勵'},{v:'soothe',l:'安撫'},{v:'stagger',l:'迷糊'},
  {v:'stretch',l:'伸展'},{v:'sulk',l:'愠怒'},{v:'think',l:'思考'},
  {v:'upset',l:'失望'},{v:'welcome',l:'歡迎'},{v:'yes',l:'點頭'},
  {v:'thumbsup',l:'肯定'},{v:'examineself',l:'自視'},{v:'pose',l:'擺造型'},
  {v:'blowkiss',l:'飛吻'},{v:'grovel',l:'下跪認錯'},{v:'happy',l:'欣喜若狂'},
  {v:'disappointed',l:'大失所望'},{v:'sit',l:'坐下'},{v:'airquotes',l:'引用'},
  {v:'gcsalute',l:'軍禮'},{v:'pray',l:'祈禱'},{v:'imperialsalute',l:'帝國式軍禮'},
  {v:'straightface',l:'平常'},{v:'smile',l:'微笑'},{v:'grin',l:'笑顏'},
  {v:'smirk',l:'自信'},{v:'taunt',l:'無畏'},{v:'shuteyes',l:'閉目'},
  {v:'sad',l:'悲傷'},{v:'scared',l:'恐怖'},{v:'amazed',l:'意外'},
  {v:'ouch',l:'痛苦'},{v:'annoyed',l:'反感'},{v:'alert',l:'吃驚'},
  {v:'worried',l:'擔心'},{v:'throw',l:'投擲'},{v:'changepose',l:'改變姿勢'},
  {v:'stepdance',l:'踢踏舞'},{v:'harvestdance',l:'豐饒之舞'},{v:'balldance',l:'宮廷之舞'},
  {v:'mandervilledance',l:'紳士之舞'},{v:'stroke',l:'撫摸'},{v:'handover',l:'遞交'},
  {v:'bombdance',l:'火盆舞'},{v:'hurray',l:'勝利歡呼'},{v:'slap',l:'甩巴掌'},
  {v:'hug',l:'擁抱'},{v:'embrace',l:'深情擁抱'},{v:'hildibrand',l:'紳士風度'},
  {v:'fistbump',l:'對拳'},{v:'thavdance',l:'薩維奈舞'},{v:'golddance',l:'黃金之舞'},
  {v:'sundance',l:'太陽之舞'},{v:'battlestance',l:'準備戰鬥'},{v:'victorypose',l:'歡呼勝利'},
  {v:'backflip',l:'後空翻'},{v:'easterngreeting',l:'抱拳禮'},{v:'eureka',l:'靈光一現'},
  {v:'mogdance',l:'莫古莫古舞'},{v:'haurchefant',l:'太棒了'},{v:'easternstretch',l:'熱身'},
  {v:'easterndance',l:'東方傳統舞蹈'},{v:'rangerpose1r',l:'戰隊演武正紅一式'},
  {v:'rangerpose2r',l:'戰隊演武正黑二式'},{v:'rangerpose3r',l:'戰隊演武正黃三式'},
  {v:'wink',l:'飛眼'},{v:'rangerpose1l',l:'戰隊演武逆紅一式'},
  {v:'rangerpose2l',l:'戰隊演武逆黑二式'},{v:'rangerpose3l',l:'戰隊演武逆黃三式'},
  {v:'facepalm',l:'捂臉'},{v:'zantetsuken',l:'斬鐵劍'},{v:'flex',l:'肉體之美'},
  {v:'respect',l:'默哀'},{v:'sneer',l:'陰險'},{v:'prettyplease',l:'撒嬌'},
  {v:'playdead',l:'裝死'},{v:'moonlift',l:'日月之舞'},{v:'dote',l:'表達愛意'},
  {v:'spectacles',l:'托眼鏡'},{v:'songbird',l:'小黃鶯之舞'},{v:'waterfloat',l:'浮水'},
  {v:'waterflip',l:'水中翻跟頭'},{v:'puckerup',l:'嘟嘴'},{v:'powerup',l:'蓄力迸發'},
  {v:'easternbow',l:'行東方禮'},{v:'squats',l:'深蹲'},{v:'pushups',l:'伏地挺身'},
  {v:'situps',l:'仰臥起坐'},{v:'breathcontrol',l:'深呼吸'},{v:'converse',l:'說話'},
  {v:'concentrate',l:'認真'},{v:'disturbed',l:'困惑'},{v:'simper',l:'柔和'},
  {v:'beam',l:'滿足'},{v:'attention',l:'立正'},{v:'atease',l:'稍息'},
  {v:'box',l:'練拳'},{v:'ritualprayer',l:'祝禱'},{v:'tremble',l:'害怕'},
  {v:'winded',l:'單膝跪地'},{v:'aback',l:'大吃一驚'},{v:'greet',l:'打招呼'},
  {v:'boxstep',l:'方形步'},{v:'sidestep',l:'側步'},{v:'ultima',l:'究極'},
  {v:'yoldance',l:'胡鷹之舞'},{v:'splash',l:'撩水'},{v:'sweat',l:'好熱'},
  {v:'shiver',l:'好冷'},{v:'elucidate',l:'說明'},{v:'ponder',l:'思索'},
  {v:'leftwink',l:'左飛眼'},{v:'getfantasy',l:'幻想舞步'},{v:'popotostep',l:'波波托步'},
  {v:'hum',l:'哼歌'},{v:'confirm',l:'確認'},{v:'scheme',l:'說明計劃'},
  {v:'endure',l:'忍耐'},{v:'tomestone',l:'神典石'},{v:'heeltoe',l:'趾踵步'},
  {v:'goobbuedo',l:'古菩步'},{v:'gratuity',l:'心意'},{v:'fistpump',l:'振作精神'},
  {v:'reprimand',l:'提醒'},{v:'sabotender',l:'優雅仙人刺'},{v:'mandervillemambo',l:'紳士舞步'},
  {v:'laliho',l:'啦哩吼'},{v:'simulationm',l:'歐米茄M架勢'},{v:'simulationf',l:'歐米茄F架勢'},
  {v:'toast',l:'乾杯'},{v:'lean',l:'背靠'},{v:'headache',l:'頭痛'},
  {v:'snap',l:'打響指'},{v:'breakfast',l:'吃麵包'},{v:'read',l:'看書'},
  {v:'insist',l:'堅持主張'},{v:'consider',l:'疑問'},{v:'wasshoi',l:'嘿哟'},
  {v:'flowershower',l:'花雨'},{v:'flamedance',l:'火焰之舞'},{v:'highfive',l:'擊掌'},
  {v:'guard',l:'巡視'},{v:'malevolence',l:'詛咒'},{v:'beesknees',l:'蜜蜂之舞'},
  {v:'lalihop',l:'啦哩吼舞'},{v:'eatriceball',l:'吃飯糰'},{v:'eatapple',l:'吃蘋果'},
  {v:'wringhands',l:'搓手'},{v:'sweep',l:'掃地'},{v:'paintblack',l:'黑色陸行鳥之筆'},
  {v:'paintred',l:'紅色陸行鳥之筆'},{v:'paintyellow',l:'黃色陸行鳥之筆'},
  {v:'paintblue',l:'藍色陸行鳥之筆'},{v:'fakesmile',l:'假笑'},
  {v:'pantomime',l:'默劇'},{v:'vexed',l:'不解'},{v:'shush',l:'嘘'},
  {v:'eatpizza',l:'吃披薩'},{v:'reference',l:'比對文獻'}
];

/* ── Categories ── */
var CATS=[
  {id:'chat',  icon:'💬',label:'說話 / 通知', desc:'聊天、廣播、悄悄話'},
  {id:'skill', icon:'⚔', label:'技能 / 道具', desc:'施放技能、使用道具'},
  {id:'target',icon:'🎯',label:'目標操作',    desc:'選中、標記、焦點目標'},
  {id:'move',  icon:'🚶',label:'角色 / 移動', desc:'移動、換裝、整理物品'},
  {id:'setting',icon:'⚙',label:'設定 / 介面',desc:'UI開關、戰鬥特效'},
  {id:'macro', icon:'🔧',label:'巨集設定',    desc:'圖示、鎖定、等待'},
  {id:'custom',icon:'✎', label:'自訂行',      desc:'直接輸入任何完整指令'}
];

/* ── Type definitions (id, category, icon, label) ── */
var TDEFS={
  chat:{cat:'chat',icon:'💬',label:'聊天訊息'},
  chatcountdown:{cat:'chat',icon:'📢',label:'聊天倒數（建構器）',isBlock:true},
  echo:{cat:'chat',icon:'🔊',label:'默語（僅自己）'},
  tell:{cat:'chat',icon:'✉',label:'悄悄話 /tell'},
  reply:{cat:'chat',icon:'↩',label:'回覆悄悄話 /r'},
  em:{cat:'chat',icon:'🎭',label:'感情表現（自訂文字）/em'},
  skill:{cat:'skill',icon:'⚔',label:'職業技能 /ac',isBlock:true},
  generalskill:{cat:'skill',icon:'✦',label:'通用技能 /gaction',isBlock:true},
  blueaction:{cat:'skill',icon:'🔵',label:'青魔法技能 /blueaction',isBlock:true},
  pvpaction:{cat:'skill',icon:'🏆',label:'PvP技能 /pvpaction',isBlock:true},
  petaction:{cat:'skill',icon:'🐉',label:'召喚獸技能 /petaction',isBlock:true},
  companionaction:{cat:'skill',icon:'🐦',label:'搭擋技能 /companionaction',isBlock:true},
  item:{cat:'skill',icon:'🧪',label:'使用道具 /item',isBlock:true},
  emote:{cat:'skill',icon:'✨',label:'情感動作（命名）'},
  abilityrotation:{cat:'skill',icon:'🔄',label:'能力技輪換（建構器）',isBlock:true},
  targeting:{cat:'target',icon:'🎯',label:'選中目標'},
  assist:{cat:'target',icon:'↗',label:'目標的目標 /as'},
  focustarget:{cat:'target',icon:'◎',label:'設定焦點目標 /focustarget'},
  facetarget:{cat:'target',icon:'↕',label:'轉向目標 /ft'},
  lockon:{cat:'target',icon:'🔒',label:'鎖定目標 /lo'},
  marking:{cat:'target',icon:'🏷',label:'目標標記 /mk',isBlock:true},
  waymark:{cat:'target',icon:'📍',label:'場景標記 /wmark',isBlock:true},

  automove:{cat:'move',icon:'🚶',label:'自動前進 /automove'},
  follow:{cat:'move',icon:'👣',label:'跟隨 /follow'},
  mount:{cat:'move',icon:'🐦',label:'乘坐坐騎 /mount'},
  minion:{cat:'move',icon:'🐣',label:'召喚寵物 /minion'},
  battlemode:{cat:'move',icon:'⚔',label:'拔刀/收刀 /bm'},
  gearset:{cat:'move',icon:'🗡',label:'裝備套裝 /gs',isBlock:true},
  itemsort:{cat:'move',icon:'📦',label:'道具整理（建構器）',isBlock:true},
  visor:{cat:'move',icon:'⛑',label:'頭部裝備 /visor'},
  gpose:{cat:'move',icon:'📷',label:'集體動作 /gpose'},
  hud:{cat:'setting',icon:'🖥',label:'UI視窗開關 /hud',isBlock:true},
  battleeffect:{cat:'setting',icon:'💥',label:'戰鬥特效設定 /battleeffect'},
  nameplatedisp:{cat:'setting',icon:'🪧',label:'名牌顯示設定 /nameplatedisp'},
  levelsync:{cat:'setting',icon:'📊',label:'等級同步 /levelsync'},
  statusoff:{cat:'setting',icon:'✗',label:'解除強化狀態 /statusoff'},
  countdown_sys:{cat:'setting',icon:'⏰',label:'系統倒計時 /cd'},
  readycheck:{cat:'setting',icon:'✅',label:'準備確認 /readycheck',isBlock:true},
  ready:{cat:'setting',icon:'👍',label:'準備完畢 /rd'},
  notready:{cat:'setting',icon:'👎',label:'未準備好 /nr'},
  hotbar:{cat:'setting',icon:'📋',label:'熱鍵欄切換 /hotbar'},
  micon:{cat:'macro',icon:'🖼',label:'巨集圖示 /micon'},
  mlock:{cat:'macro',icon:'🔒',label:'巨集鎖定 /mlock'},
  merror_line:{cat:'macro',icon:'⚠',label:'錯誤提示設定 /merror'},
  wait_line:{cat:'macro',icon:'⏱',label:'等待（獨立行）/wait'},
  random:{cat:'macro',icon:'🎲',label:'隨機數字 /random'},
  custom:{cat:'custom',icon:'✎',label:'自訂行（自由輸入）'}
};

/* ── Templates ── */
var TEMPLATES=[
  {id:'chat',icon:'💬',label:'聊天公告',desc:'3秒倒數通知小隊出發',
   lines:[
    {type:'mlock',params:{},note:'鎖定巨集防止中斷'},
    {type:'chat',params:{channel:'p',message:'準備好了嗎？',inlineWait:1},note:''},
    {type:'chat',params:{channel:'p',message:'3...',inlineWait:1},note:''},
    {type:'chat',params:{channel:'p',message:'2...',inlineWait:1},note:''},
    {type:'chat',params:{channel:'p',message:'1...',inlineWait:1},note:''},
    {type:'chat',params:{channel:'p',message:'出發！'},note:''}
  ]},
  {id:'skill',icon:'⚔',label:'技能使用',desc:'施放技能，可附加通知選項',
   lines:[
    {type:'micon',params:{miconName:'',miconType:'action'},note:'技能圖示（同巨集第一個生效）'},
    {type:'skill',params:{skillName:'',target:'<t>',inlineWait:0,
      preAnnounce:false,preAnnounceMsg:'即將施放技能！',preAnnounceChannel:'p',preAnnounceWait:2,preAnnounceSe:'',
      postNotify:false,postNotifyMsg:'技能已施放！',postNotifyChannel:'p',postNotifySe:'',
      postEcho:false,postEchoMsg:'技能使用完畢',postEchoSe:'',
      recastNotify:false,recastPrefix:'',recastSuffix:' 秒',recastChannel:'e',recastSe:''},note:''}
  ]},
  {id:'abilityrotation',icon:'🔄',label:'能力技輪換',desc:'多個能力技輪番施放',
   lines:[
    {type:'merror_line',params:{onOff:'off'},note:'建議關閉錯誤提示，避免冷卻中的訊息刷屏'},
    {type:'micon',params:{miconName:'',miconType:'action'},note:''},
    {type:'abilityrotation',params:{skills:['','',''],target:'<t>',inlineWait:0},note:'不斷按下此巨集可依序施放已冷卻的技能'}
  ]},
  {id:'gearset',icon:'🗡',label:'裝備切換',desc:'切換套裝並顯示圖示和確認',
   lines:[
    {type:'gearset',params:{gsAction:'change',gsNumber:'1',
      addMicon:true,miconType:'gearset',addEcho:true,echoMsg:'已切換至套裝 1',echoSe:''},note:''}
  ]},
  {id:'itemsort',icon:'📦',label:'道具整理',desc:'整理背包與兵裝庫',
   lines:[
    {type:'itemsort',params:{
      areas:['inventory','armourychest'],
      conditions:[{criterion:'itemlevel',order:'des'},{criterion:'category',order:'asc'}],
      useClear:true,echoMsg:'整理完成！',echoSe:'<se.1>'},note:''}
  ]},
  {id:'marking',icon:'🏷',label:'目標標記',desc:'設定攻擊標記',
   lines:[
    {type:'mlock',params:{},note:''},
    {type:'marking',params:{markType:'attack1',markTarget:'<t>',notify:false},note:'攻擊標記1'},
    {type:'marking',params:{markType:'attack2',markTarget:'<t>',notify:false},note:'攻擊標記2'},
    {type:'marking',params:{markType:'attack3',markTarget:'<t>',notify:false},note:'攻擊標記3'},
  ]},
  {id:'kaomoji',icon:'🐱',label:'自訂顏文字',desc:'顏文字圖案，可自由修改',
   lines:[
    {type:'chat',params:{channel:'s',message:'                           \u25cf'},note:'第1行'},
    {type:'chat',params:{channel:'s',message:'                    /\\__\\__/\\'},note:'第2行'},
    {type:'chat',params:{channel:'s',message:'                  /                   \\'},note:'第3行'},
    {type:'chat',params:{channel:'s',message:'               \\( \uff3f  \u22ef \u25cf \u22ef \uff3f)/'},note:'第4行（可繼續新增行）'},
  ]},
  {id:'emote',icon:'✨',label:'情感動作',desc:'播放情感動作',
   lines:[
    {type:'micon',params:{miconName:'bow',miconType:'emote'},note:''},
    {type:'emote',params:{emoteName:'bow',motionOnly:false,
      addEm:false,emText:'向 <t> 深深一鞠躬。'},note:''}
  ]},
  {id:'em',icon:'🎭',label:'感情表現',desc:'自訂文字配情感動作',
   lines:[
    {type:'em',params:{text:'向 <t> 深深一鞠躬。',addMotion:true,motionEmote:'bow'},note:'可修改文字和動作'},
  ]},
  {id:'buzu',icon:'📣',label:'友好部族喊話',desc:'速解喊話型友好任務用',
   lines:[
    {type:'chat',params:{channel:'s',message:'乘風而起 / 展翅高飛 / 翱翔天際 / 不屈之翼 / 追夢無限 / 大鯰魚保佑 / 啦哩吼 / 啦嘿 / 夢想加倍 / 超級小可愛'},note:'第1行'},
    {type:'chat',params:{channel:'s',message:'河狸 / 咖啡時間 / 我就是人趣諸神 / 線軸 / 烏姆·阿拉 / 有咕波果哦 / 燉菜做好了 / 新鮮蔬菜上架了'},note:'第2行'},
  ]},
  {id:'blank',icon:'✦',label:'空白自訂',desc:'從零開始',lines:[]}
];

/* ── Pronouns ── */
var PRONS=[
  {s:'<t>',d:'當前目標'},{s:'<me>',d:'自己'},{s:'<f>',d:'焦點目標'},
  {s:'<tt>',d:'目標的目標'},{s:'<lt>',d:'上次目標'},{s:'<mo>',d:'滑鼠指向的角色'},
  {s:'<r>',d:'最後傳悄悄話的人'},{s:'<le>',d:'最後選中的敵人'},
  {s:'<la>',d:'最後攻擊你的敵人'},{s:'<c>',d:'搭擋'},{s:'<p>',d:'召喚獸'},
  {s:'<1>',d:'小隊1號'},{s:'<2>',d:'小隊2號'},{s:'<3>',d:'小隊3號'},
  {s:'<4>',d:'小隊4號'},{s:'<5>',d:'小隊5號'},{s:'<6>',d:'小隊6號'},
  {s:'<7>',d:'小隊7號'},{s:'<8>',d:'小隊8號'},
  {s:'<attack1>',d:'攻擊標記1'},{s:'<attack2>',d:'攻擊標記2'},
  {s:'<bind1>',d:'止步標記1'},{s:'<stop1>',d:'禁止標記1'},
  {s:'<square>',d:'方塊標記'},{s:'<circle>',d:'圓圈標記'},
  {s:'<cross>',d:'叉標記'},{s:'<triangle>',d:'三角標記'},
  {s:'<e1>',d:'PvP敵方1號'},{s:'<e2>',d:'PvP敵方2號'},
  {s:'<flag>',d:'地圖標記坐標'},
  {s:'<hp>',d:'HP數值'},{s:'<hpp>',d:'HP百分比'},
  {s:'<mp>',d:'MP數值'},{s:'<mpp>',d:'MP百分比'},
  {s:'<job>',d:'當前職業等級'},{s:'<pos>',d:'當前位置坐標'},
  {s:'<targethpp>',d:'目標HP%'},{s:'<focushpp>',d:'焦點目標HP%'},
  {s:'<targetclass>',d:'目標職業等級'},{s:'<buddyhp>',d:'搭擋HP'},
  {s:'<se.1>',d:'播放音效1'},{s:'<recast."技能名">',d:'技能剩餘冷卻秒數'},
  {s:'<wait.1>',d:'等待1秒（內嵌於行末）'}
];

/* ════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════ */
function cc(s){var n=0;for(var i=0;i<s.length;i++){var cp=s.codePointAt(i);n+=cp>0x7F?3:1;if(cp>0xFFFF)i++;/* 代理對佔了2個code unit，跳過第二半避免重複計算 */}return n;}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function so(opts,cur){return opts.map(function(o){return '<option value="'+esc(o.v)+'"'+(o.v===cur?' selected':'')+'>'+esc(o.l)+'</option>';}).join('');}
function dc(o){return JSON.parse(JSON.stringify(o));}
function tv(p,key,ckey){var v=p[key];return v==='custom'?(p[ckey]||'<t>'):v||'';}
function seStr(se){return se?(' '+se):'';}
function waitStr(w){var n=parseInt(w)||0;return n>0?' <wait.'+n+'>':'';}

/* 插入代名詞到輸入框游標位置 */
var _lastMsgInput=null;
function insertAtCursor(inp,text){
  if(!inp) return;
  var s=inp.selectionStart||0,e=inp.selectionEnd||0,v=inp.value||'';
  inp.value=v.slice(0,s)+text+v.slice(e);
  inp.selectionStart=inp.selectionEnd=s+text.length;
  inp.dispatchEvent(new Event('input'));inp.focus();
}

/* 可編輯預覽狀態 */
var previewEditable=false;
/* ════════════════════════════════════════════════
   COMMAND BUILDERS — returns array of strings
════════════════════════════════════════════════ */
function buildLines(line){
  var p=line.params||{}, r=parseInt(line.repeat)||1, out=buildLinesInner(line);
  if(out.length===1&&r>1){var arr=[];for(var i=0;i<r;i++)arr.push(out[0]);return arr;}
  return out;
}

function buildLinesInner(line){
  var p=line.params||{};
  switch(line.type){
    case 'chat':{
      var msg='/'+(p.channel||'p')+' '+(p.message||'');
      if(p.se) msg+=seStr(p.se);
      if(parseInt(p.inlineWait)>0) msg+=waitStr(p.inlineWait);
      return[msg];
    }
    case 'chatcountdown':{
      var ch='/'+(p.channel||'p'), from=parseInt(p.from)||3, out2=[];
      var sm=p.startMsg, em=p.endMsg, w=parseInt(p.waitPerLine)||1;
      var showNums=p.showNumbers!==false;
      if(sm){var l=ch+' '+sm+(p.startSe?seStr(p.startSe):'');if(w>0&&(showNums||em))l+=waitStr(w);out2.push(l);}
      if(showNums){for(var n2=from;n2>=1;n2--){var l2=ch+' '+n2+'...'+(p.lineSe?seStr(p.lineSe):'');if(n2>1||em) l2+=waitStr(w);out2.push(l2);}}
      if(em) out2.push(ch+' '+em+(p.endSe?seStr(p.endSe):''));
      return out2.length?out2:[ch+' ...'];
    }
    case 'echo':{
      var msg2='/e '+(p.message||'');
      if(p.se) msg2+=seStr(p.se);
      return[msg2];
    }
    case 'tell':{
      return['/t '+(p.target||'')+' '+(p.message||'')];
    }
    case 'reply':{
      var msg3='/r '+(p.message||'');
      if(p.se) msg3+=seStr(p.se);
      return[msg3];
    }
    case 'em':{
      var lines_em=[];
      if(p.addMotion&&p.motionEmote){
        var em_name=p.motionEmote==='custom'?(p.motionCustom||''):p.motionEmote;
        lines_em.push('/'+em_name+' motion');
      }
      var emLine='/em '+(p.text||'向 <t> 深深一鞠躬。');
      if(p.se) emLine+=seStr(p.se);
      lines_em.push(emLine);
      return lines_em;
    }
    case 'skill':
    case 'generalskill':
    case 'blueaction':
    case 'pvpaction':
    case 'petaction':
    case 'companionaction':{
      var cmd2={'skill':'/ac','generalskill':'/gaction','blueaction':'/blueaction',
                'pvpaction':'/pvpaction','petaction':'/petaction','companionaction':'/companionaction'}[line.type];
      var sname=p.skillName||'';
      var tgt=tv(p,'target','targetCustom');
      var w2=parseInt(p.inlineWait)||0;
      var skill_out=[];
      // Pre-announce
      if(p.preAnnounce&&p.preAnnounceMsg){
        var pa='/'+(p.preAnnounceChannel||'p')+' '+p.preAnnounceMsg;
        if(p.preAnnounceSe) pa+=seStr(p.preAnnounceSe);
        if(parseInt(p.preAnnounceWait)>0) pa+=waitStr(p.preAnnounceWait);
        skill_out.push(pa);
      }
      // Skill
      var sc=cmd2+' "'+sname+'"';
      if(tgt) sc+=' '+tgt;
      if(w2>0) sc+=' <wait.'+w2+'>';
      skill_out.push(sc);
      // Post instant notify
      if(p.postNotify&&p.postNotifyMsg){
        var pn='/'+(p.postNotifyChannel||'p')+' '+p.postNotifyMsg;
        if(p.postNotifySe) pn+=seStr(p.postNotifySe);
        skill_out.push(pn);
      }
      // Post echo (self)
      if(p.postEcho&&p.postEchoMsg){
        var pe='/e '+p.postEchoMsg;
        if(p.postEchoSe) pe+=seStr(p.postEchoSe);
        skill_out.push(pe);
      }
      // Recast notify
      if(p.recastNotify&&sname){
        var pre=p.recastPrefix||'【'+sname+'】剩餘冷卻：';
        var suf=p.recastSuffix||' 秒';
        var rc='/'+(p.recastChannel||'e')+' '+pre+'<recast."'+sname+'">'+suf;
        if(p.recastSe) rc+=seStr(p.recastSe);
        skill_out.push(rc);
      }
      return skill_out;
    }
    case 'item':{
      var item_out=[];
      var iname=p.itemName||'';
      var itgt=tv(p,'target','targetCustom')||'<me>';
      var il='/item "'+iname+'" '+itgt;
      item_out.push(il);
      if(p.postEcho&&p.postEchoMsg){
        var ie='/e '+(p.postEchoMsg||'已使用：'+iname);
        if(p.postEchoSe) ie+=seStr(p.postEchoSe);
        item_out.push(ie);
      }
      return item_out;
    }
    case 'emote':{
      var emote_out=[];
      var ename=p.emoteName==='custom'?(p.emoteCustom||''):p.emoteName||'bow';
      emote_out.push('/'+ename+(p.motionOnly?' motion':''));
      if(p.addEm&&p.emText){
        var emline='/em '+p.emText;
        if(p.emSe) emline+=seStr(p.emSe);
        emote_out.push(emline);
      }
      return emote_out;
    }
    case 'abilityrotation':{
      var ar_out=[];
      var ar_tgt=tv(p,'target','targetCustom')||'<t>';
      var ar_w=parseInt(p.inlineWait)||0;
      (p.skills||[]).forEach(function(sn){
        if(!sn) return;
        var ac='/ac "'+sn+'" '+ar_tgt;
        if(ar_w>0) ac+=' <wait.'+ar_w+'>';
        ar_out.push(ac);
      });
      return ar_out.length?ar_out:['/ac "技能名稱" <t>'];
    }
    case 'targeting':{
      var tc=p.targetCmd||'/bt';
      var tp2=tv(p,'targetParam','targetCustom');
      if(tc==='/ta'&&tp2) return['/ta '+tp2];
      if(tc==='/as'){var ap=tv(p,'targetParam','targetCustom');return[ap?'/as '+ap:'/as'];}
      return[tc];
    }
    case 'assist':{
      var ap2=tv(p,'target','targetCustom');
      return[ap2?'/as '+ap2:'/as'];
    }
    case 'focustarget':{
      var ft=tv(p,'target','targetCustom')||'<t>';
      return['/focustarget '+ft];
    }
    case 'facetarget': return['/ft'];
    case 'lockon':{
      var lt=p.toggle||'toggle';
      return[lt==='toggle'?'/lo':'/lo '+lt];
    }
    case 'marking':{
      var mk_out=[];
      var mt=p.markType||'attack1';
      if(mt==='clear'){mk_out.push('/mk clear');}
      else{
        var mtgt=tv(p,'markTarget','targetCustom');
        mk_out.push('/mk '+mt+(mtgt?' '+mtgt:''));
      }
      if(p.notify&&p.notifyMsg){
        var mn='/'+(p.notifyChannel||'p')+' '+p.notifyMsg;
        if(p.notifySe) mn+=seStr(p.notifySe);
        mk_out.push(mn);
      }
      return mk_out;
    }
    case 'waymark':{
      var wm_out=[];
      if(p.waymarkAction==='clear'){wm_out.push('/wmark clear');}
      else{
        var wn=p.waymarkName||'A';
        if(p.waymarkAction==='target') wm_out.push('/wmark '+wn+' <t>');
        else wm_out.push('/wmark '+wn);
      }
      if(p.notify&&p.notifyMsg){
        var wmn='/'+(p.notifyChannel||'p')+' '+p.notifyMsg;
        if(p.notifySe) wmn+=seStr(p.notifySe);
        wm_out.push(wmn);
      }
      return wm_out;
    }

    case 'automove':{
      var at=p.toggle||'toggle';
      return[at==='toggle'?'/automove':'/automove '+at];
    }
    case 'follow': return['/follow'];
    case 'mount':{
      var mn2=p.mountName||'';
      return['/mount "'+mn2+'"'];
    }
    case 'minion':{
      var mi2=p.minionName||'';
      return['/minion "'+mi2+'"'];
    }
    case 'battlemode':{
      var bmt=p.toggle||'toggle';
      return[bmt==='toggle'?'/bm':'/bm '+bmt];
    }
    case 'gearset':{
      var gs_out=[];
      var gn=p.gsNumber||'1';
      if(p.addMicon){
        var mt2=p.miconType||'gearset';
        gs_out.push(mt2==='gearset'?'/micon '+gn+' gearset':'/micon "'+p.miconName+'" '+mt2);
      }
      gs_out.push('/gs '+(p.gsAction||'change')+' '+gn);
      if(p.addEcho&&p.echoMsg){
        var ge='/e '+p.echoMsg;
        if(p.echoSe) ge+=seStr(p.echoSe);
        gs_out.push(ge);
      }
      return gs_out;
    }
    case 'itemsort':{
      var is_out=[];
      var areas=p.areas||[];
      var conds=p.conditions||[];
      areas.forEach(function(area){
        if(p.useClear) is_out.push('/itemsort clear '+area);
        conds.forEach(function(c){
          var ic='/itemsort condition '+area+' '+c.criterion;
          var cdef=IS_C.filter(function(x){return x.v===c.criterion;})[0];
          if(cdef&&cdef.o!==false) ic+=' '+(c.order||'des');
          is_out.push(ic);
        });
        is_out.push('/itemsort execute '+area);
      });
      if(p.echoMsg){
        var ie2='/e '+p.echoMsg;
        if(p.echoSe) ie2+=seStr(p.echoSe);
        is_out.push(ie2);
      }
      return is_out.length?is_out:['（道具整理：請選擇整理目標）'];
    }
    case 'visor': return['/visor'];
    case 'gpose': return['/gpose'];
    case 'hud':{
      var hud_out=[];
      var hw=p.windows||[];
      var ht=p.toggle||'toggle';
      hw.forEach(function(w){
        hud_out.push(ht==='toggle'?'/hud "'+w+'"':'/hud "'+w+'" '+ht);
      });
      return hud_out.length?hud_out:['（UI視窗：請選擇視窗）'];
    }
    case 'battleeffect':{
      var bet=p.target2||'self', bel=p.level||'all';
      return['/battleeffect '+bet+' '+bel];
    }
    case 'nameplatedisp':{
      var npt=p.target3||'all', npl=p.level||'4';
      return['/nameplatedisp '+npt+' '+npl];
    }
    case 'levelsync':{
      var lst=p.toggle||'toggle';
      return[lst==='toggle'?'/levelsync':'/levelsync '+lst];
    }
    case 'statusoff':{
      var sn=p.statusName||'';
      return['/statusoff "'+sn+'"'];
    }
    case 'countdown_sys':{
      return[p.cdSec?'/cd '+p.cdSec:'/cd'];
    }
    case 'readycheck':{
      var rc_out=[];
      if(p.preMsg){var rcpre='/'+(p.preChannel||'p')+' '+p.preMsg;if(p.preSe)rcpre+=seStr(p.preSe);rc_out.push(rcpre);}
      rc_out.push('/readycheck');
      return rc_out;
    }
    case 'ready': return['/rd'];
    case 'notready': return['/nr'];
    case 'hotbar':{
      var hz=p.zone==='pvp';
      return[(hz?'/pvphotbar':'/hotbar')+' change '+(p.num||'1')];
    }
    case 'micon':{
      var mit=p.miconType||'action';
      return[mit==='gearset'?'/micon '+(p.miconName||'1')+' gearset':'/micon "'+(p.miconName||'')+'" '+mit];
    }
    case 'mlock': return['/mlock'];
    case 'merror_line': return['/merror '+(p.onOff||'off')];
    case 'wait_line': return['/wait '+(parseInt(p.secs)||1)];
    case 'random': return[p.max?'/random '+p.max:'/random'];
    case 'custom': return[p.text||''];
    default: return[''];
  }
}

/* ── Render preserving scroll position ── */
function renderKeepScroll(){
  var frame=document.querySelector('.macro-root-frame');
  var st=frame?frame.scrollTop:0;
  render();
  if(frame) frame.scrollTop=st;
}
function getAllOutput(){
  var out=[];
  if(globalCfg.mlock) out.push('/mlock');
  if(globalCfg.merrorOff) out.push('/merror off');
  lines.forEach(function(l){buildLines(l).forEach(function(s){out.push(s);});});
  return out;
}

function getTotalLines(){return getAllOutput().length;}

/* ── Per-line preview ── */
function linePreview(line){return buildLines(line).join(' | ');}
function lineCount(line){return buildLines(line).length;}

/* ════════════════════════════════════════════════
   VALIDATION
════════════════════════════════════════════════ */
function validate(){
  var W=[], total=getTotalLines();
  if(total>MAX) W.push({lv:'error',msg:'行數超出上限：目前共 '+total+' 行（最多 '+MAX+' 行）。請刪除部分行或使用「分割巨集」功能。'});
  getAllOutput().forEach(function(s,i){var c=cc(s);if(c>MAX_C)W.push({lv:'error',msg:'第 '+(i+1)+' 行字元超出上限（'+c+'/180）'});});
  var mlockLine=lines.findIndex(function(l){return l.type==='mlock';});
  if(mlockLine>0&&!globalCfg.mlock) W.push({lv:'warn',msg:'/mlock 在第 '+(mlockLine+1)+' 行，前面的行仍可能被中斷。建議移至第1行，或使用上方全局設定。'});
  var miconCount=lines.filter(function(l){return l.type==='micon';}).length;
  if(miconCount>1) W.push({lv:'warn',msg:'巨集中有 '+miconCount+' 個 /micon，只有第一個圖示生效，其餘被忽略。'});
  var hasNorm=lines.some(function(l){return l.type==='hotbar'&&l.params.zone!=='pvp';});
  var hasPvp=lines.some(function(l){return l.type==='hotbar'&&l.params.zone==='pvp';});
  if(hasNorm&&hasPvp) W.push({lv:'warn',msg:'同時包含一般熱鍵欄（非戰鬥區）和 PvP 熱鍵欄（對戰區），兩者無法在同一場景生效。'});
  // 必填名稱欄位檢查：避免欄位留空時輸出空白或無效指令卻沒有任何提示
  lines.forEach(function(l,i){
    var p=l.params||{}, ln=i+1, miss=null;
    switch(l.type){
      case 'tell': if(!p.target) miss='悄悄話對象尚未填寫'; break;
      case 'skill': case 'generalskill': case 'blueaction':
      case 'pvpaction': case 'petaction': case 'companionaction':
        if(!p.skillName) miss='技能／動作名稱尚未填寫'; break;
      case 'item': if(!p.itemName) miss='道具名稱尚未填寫'; break;
      case 'mount': if(!p.mountName) miss='坐騎名稱尚未填寫'; break;
      case 'minion': if(!p.minionName) miss='寵物名稱尚未填寫'; break;
      case 'statusoff': if(!p.statusName) miss='狀態名稱尚未填寫'; break;
      case 'micon': if(p.miconType!=='gearset'&&!p.miconName) miss='/micon 的技能名稱尚未填寫'; break;
      case 'emote': if(p.emoteName==='custom'&&!p.emoteCustom) miss='自訂情感動作指令名稱尚未填寫'; break;
      case 'em': if(p.addMotion&&p.motionEmote==='custom'&&!p.motionCustom) miss='自訂行禮動作指令名稱尚未填寫'; break;
    }
    if(miss) W.push({lv:'error',msg:'第 '+ln+' 行：'+miss+'。'});
  });
  var hasSkill=lines.some(function(l){return l.type==='skill'||l.type==='generalskill';});
  if(hasSkill) W.push({lv:'info',msg:'技能巨集提示：巨集無法配合 GCD 時機，可能打斷技能循環。建議只用於低頻或非高強度戰鬥場景。'});
  return W;
}

/* ════════════════════════════════════════════════
   FIELD RENDERERS
════════════════════════════════════════════════ */
function fRow(label,content,hint){return '<div class="mf-row"><span class="mf-lbl">'+label+'</span><div class="mf-cnt">'+content+(hint?'<span class="mf-unit">'+hint+'</span>':'')+'</div></div>';}
function fInp(id,key,ph,val,type,extra){type=type||'text';extra=extra||'';return '<input class="mf-inp" data-id="'+id+'" data-key="'+key+'" type="'+type+'" placeholder="'+esc(ph)+'" value="'+esc(val||'')+'" '+extra+'>';}
function fSel(id,key,opts,cur,cls){return '<select class="mf-sel'+(cls?' '+cls:'')+'" data-id="'+id+'" data-key="'+key+'">'+so(opts,cur)+'</select>';}
function fChk(id,key,label,checked){return '<label class="mf-check"><input type="checkbox" data-id="'+id+'" data-key="'+key+'"'+(checked?' checked':'')+'><span>'+label+'</span></label>';}
function fHint(msg){return '<div class="mf-hint">'+msg+'</div>';}
function fSep(label){return '<div class="mf-sep"><span>'+label+'</span></div>';}
function fTgt(id,key,cur){
  var sel=fSel(id,key,TGT,cur);
  var custom=cur==='custom'?fInp(id,'targetCustom','自訂代名詞（如 <2>）',''):'' ;
  return sel+custom;
}
function fSE(id,key,cur){return fSel(id,key,SE,cur||'');}
function fCH(id,key,cur){return fSel(id,key,CH,cur||'p');}

/* 訊息輸入框 + 內嵌代名詞選擇器 */
var MSG_PROS=[
  {v:'<t>',l:'當前目標'},{v:'<me>',l:'自己'},{v:'<f>',l:'焦點目標'},
  {v:'<tt>',l:'目標的目標'},{v:'<1>',l:'小隊1號'},{v:'<2>',l:'小隊2號'},
  {v:'<3>',l:'小隊3號'},{v:'<4>',l:'小隊4號'},{v:'<5>',l:'小隊5號'},
  {v:'<6>',l:'小隊6號'},{v:'<7>',l:'小隊7號'},{v:'<8>',l:'小隊8號'},
  {v:'<r>',l:'最後悄悄話者'},{v:'<mo>',l:'滑鼠指向'},{v:'<hp>',l:'自身HP'},
  {v:'<hpp>',l:'HP%'},{v:'<mp>',l:'魔力'},{v:'<mpp>',l:'魔力%'},
  {v:'<pos>',l:'坐標'},{v:'<job>',l:'職業'},
  {v:'<targethpp>',l:'目標HP%'},{v:'<focushpp>',l:'焦點HP%'},
  {v:'<se.1>',l:'音效1'},{v:'<se.2>',l:'音效2'},{v:'<se.3>',l:'音效3'},
  {v:'<recast."技能名">',l:'冷卻時間'},
];
function fMsgInp(id,key,ph,val){
  var chips=MSG_PROS.map(function(p){
    return '<span class="inline-pro" data-sym="'+esc(p.v)+'" title="'+esc(p.l)+'">'+esc(p.v)+'</span>';
  }).join('');
  return '<div class="msg-inp-wrap">'
    +'<input class="mf-inp msg-inp" data-id="'+id+'" data-key="'+key+'" placeholder="'+esc(ph)+'" value="'+esc(val||'')+'">'
    +'<div class="inline-pro-row">'+chips+'</div>'
    +'</div>';
}

function renderFields(line){
  var p=line.params||{}, id=line.id;
  switch(line.type){
    case 'chat': return fHint('在選定頻道發送訊息。點擊下方代名詞可直接插入到訊息中。')+
      fRow('頻道',fCH(id,'channel',p.channel))+
      fRow('訊息內容',fMsgInp(id,'message','訊息內容',p.message))+
      fRow('音效（選填）',fSE(id,'se',p.se),'小隊/默語頻道才有效')+
      fRow('內嵌等待',fInp(id,'inlineWait','0',p.inlineWait,'number','min="0" max="60"'),'秒（0＝不等待，加在行末）');
    case 'chatcountdown': return fHint('產生多行倒數訊息。例如：「準備！」→「3...」→「2...」→「1...」→「出發！」')+
      fRow('頻道',fCH(id,'channel',p.channel))+
      fRow('起始訊息',fInp(id,'startMsg','如：準備好了嗎？（可留空）',p.startMsg))+
      fRow('起始音效',fSE(id,'startSe',p.startSe))+
      fRow('倒數從幾開始',fInp(id,'from','3',p.from,'number','min="1" max="10"'))+
      fRow('顯示數字倒數',fChk(id,'showNumbers','顯示 3... 2... 1... 的倒數數字',p.showNumbers!==false))+
      fRow('每行音效',fSE(id,'lineSe',p.lineSe))+
      fRow('每行等待秒數',fInp(id,'waitPerLine','1',p.waitPerLine,'number','min="0" max="60"'),'秒')+
      fRow('結束訊息',fInp(id,'endMsg','如：出發！（可留空）',p.endMsg))+
      fRow('結束音效',fSE(id,'endSe',p.endSe));
    case 'echo': return fHint('只有自己能看到的提示訊息。點擊下方代名詞可直接插入。常用於確認提示，或搭配 &lt;recast."技能名"&gt; 顯示冷卻時間。')+
      fRow('訊息內容',fMsgInp(id,'message','如：整理完成！或 【技能名】剩餘冷卻：<recast."技能名"> 秒',p.message))+
      fRow('音效（選填）',fSE(id,'se',p.se));
    case 'tell': return fHint('傳送私人訊息給指定玩家。跨服只對好友或正在招募的隊長有效。點擊下方代名詞可插入訊息。')+
      fRow('對象',fInp(id,'target','玩家名稱@伺服器名稱',p.target))+
      fRow('訊息內容',fMsgInp(id,'message','訊息內容',p.message));
    case 'reply': return fHint('回覆最後一則向你發送悄悄話的玩家。點擊下方代名詞可插入訊息。')+
      fRow('訊息內容',fMsgInp(id,'message','回覆內容',p.message))+
      fRow('音效（選填）',fSE(id,'se',p.se));
    case 'em': return fHint('第三人稱自訂動作文字。執行後顯示：「你的名字 [文字內容]」。點擊下方代名詞可插入目標名稱等。')+
      fRow('文字內容',fMsgInp(id,'text','如：向 <t> 深深一鞠躬。',p.text||'向 <t> 深深一鞠躬。'))+
      fRow('音效（選填）',fSE(id,'se',p.se))+
      fSep('選填：搭配情感動作（在文字前插入一行動作指令）')+
      fRow('',fChk(id,'addMotion','搭配情感動作（角色播放動作動畫）',p.addMotion))+
      (p.addMotion?fRow('動作名稱',
        fSel(id,'motionEmote',[{v:'custom',l:'自訂輸入...'}].concat(EMOTES.map(function(e){return{v:e.v,l:e.l+' ('+e.v+')'};})),p.motionEmote||'bow')+
        (p.motionEmote==='custom'?fInp(id,'motionCustom','輸入情感動作的英文指令名',p.motionCustom):'')
      ,'motion 子命令會加在行末，讓角色播放動作但不顯示動作文字'):'');
    case 'skill': return renderSkillFields(line,'skill');
    case 'generalskill': return renderSkillFields(line,'generalskill');
    case 'blueaction': return renderSkillFields(line,'blueaction');
    case 'pvpaction': return renderSkillFields(line,'pvpaction');
    case 'petaction': return renderSkillFields(line,'petaction');
    case 'companionaction': return renderSkillFields(line,'companionaction');
    case 'item': return renderItemFields(line);
    case 'emote': return renderEmoteFields(line);
    case 'abilityrotation': return renderAbilityRotation(line);
    case 'targeting': return renderTargetingFields(line);
    case 'assist': return fHint('選中目標正在攻擊的對象。例如 /as &lt;2&gt; 可選中小隊2號的目標。常用於跟打指令。')+
      fRow('目標（選填）',fTgt(id,'target',p.target||''));
    case 'focustarget': return fHint('將指定目標設為焦點目標。常用：/focustarget &lt;t&gt; 將當前目標設為焦點。')+
      fRow('設為焦點',fTgt(id,'target',p.target||'<t>'));
    case 'facetarget': return fHint('讓角色轉向面對當前選中的目標方向。');
    case 'lockon': return fHint('鎖定或解除鎖定當前選中的目標，使鏡頭自動跟隨。')+
      fRow('操作',fSel(id,'toggle',[{v:'toggle',l:'切換（鎖定↔解除）'},{v:'on',l:'鎖定目標'},{v:'off',l:'解除鎖定'}],p.toggle||'toggle'));
    case 'marking': return renderMarkingFields(line);
    case 'waymark': return renderWaymarkFields(line);

    case 'automove': return fHint('開啟後角色自動向前行走，直至關閉或到達目的地。跳跳樂巨集常用。')+
      fRow('操作',fSel(id,'toggle',[{v:'toggle',l:'切換（開↔關）'},{v:'on',l:'開始自動前進'},{v:'off',l:'停止自動前進'}],p.toggle||'toggle'));
    case 'follow': return fHint('自動跟隨當前選中的玩家。');
    case 'mount': return fHint('騎上指定坐騎。騎乘狀態下則下馬。名稱需與遊戲完全一致。')+
      fRow('坐騎名稱',fInp(id,'mountName','坐騎名稱（與遊戲完全一致）',p.mountName));
    case 'minion': return fHint('召喚指定寵物。已召喚相同寵物時則收回。名稱需與遊戲完全一致。')+
      fRow('寵物名稱',fInp(id,'minionName','寵物名稱（與遊戲完全一致）',p.minionName));
    case 'battlemode': return fHint('切換拔刀（戰鬥姿態）和收刀（平常姿態）。')+
      fRow('操作',fSel(id,'toggle',[{v:'toggle',l:'切換（拔刀↔收刀）'},{v:'on',l:'拔出武器'},{v:'off',l:'收回武器'}],p.toggle||'toggle'));
    case 'gearset': return renderGearsetFields(line);
    case 'itemsort': return renderItemsortFields(line);
    case 'visor': return fHint('切換可以開合的頭部裝備狀態（如頭盔護目鏡）。');
    case 'gpose': return fHint('進入集體動作模式，用於拍照留念。');
    case 'hud': return renderHudFields(line);
    case 'battleeffect': return fHint('控制戰鬥特效的顯示程度，可降低視覺干擾。')+
      fRow('對象',fSel(id,'target2',BE_T,p.target2||'self'))+
      fRow('顯示設定',fSel(id,'level',BE_L,p.level||'all'));
    case 'nameplatedisp': return fHint('控制角色名牌的顯示方式。')+
      fRow('對象',fSel(id,'target3',NP_T,p.target3||'all'))+
      fRow('顯示方式',fSel(id,'level',NP_L,p.level||'4'));
    case 'levelsync': return fHint('控制等級同步，通常用於危命任務等有等級限制的內容。')+
      fRow('操作',fSel(id,'toggle',[{v:'toggle',l:'切換（開↔關）'},{v:'on',l:'開啟等級同步'},{v:'off',l:'關閉等級同步'}],p.toggle||'toggle'));
    case 'statusoff': return fHint('解除自身的指定強化狀態效果。名稱需與遊戲完全一致。')+
      fRow('狀態名稱',fInp(id,'statusName','強化狀態名稱（與遊戲完全一致）',p.statusName));
    case 'countdown_sys': return fHint('使用遊戲內建的戰鬥倒計時系統（5~30秒），顯示在所有隊員螢幕上。留空則開啟設定視窗。')+
      fRow('倒計時秒數',fInp(id,'cdSec','留空＝開啟設定視窗；填 5~30＝直接倒計時',p.cdSec,'number','min="5" max="30"'));
    case 'readycheck': return fHint('發起準備確認，全隊成員都能看到。')+
      fRow('',fChk(id,'preMsg_on','發起前先在頻道公告',p.preMsg_on))+
      (p.preMsg_on?fRow('公告訊息',fInp(id,'preMsg','如：請確認準備狀態！',p.preMsg))+
        fRow('頻道',fCH(id,'preChannel',p.preChannel))+fRow('音效',fSE(id,'preSe',p.preSe)):'');
    case 'ready': return fHint('回應準備確認為「已準備好」。');
    case 'notready': return fHint('回應準備確認為「未準備好」。');
    case 'hotbar': return fHint('切換熱鍵欄到指定編號。一般版只在非PvP區生效，PvP版只在對戰區生效。')+
      fRow('區域',fSel(id,'zone',[{v:'normal',l:'一般（非戰鬥區）'},{v:'pvp',l:'PvP（對戰區）'}],p.zone||'normal'))+
      fRow('切換至熱鍵欄',fInp(id,'num','1',p.num,'number','min="1" max="10"'),'（1~10）');
    case 'micon': return fHint('設定巨集在熱鍵欄上顯示的圖示。同一巨集只有第一個 /micon 生效，其餘被忽略。建議放在第一行。')+
      fRow('圖示類型',fSel(id,'miconType',MICON_T,p.miconType||'action'))+
      fRow(p.miconType==='gearset'?'套裝編號':'名稱',fInp(id,'miconName',p.miconType==='gearset'?'套裝編號（數字）':'名稱（與遊戲完全一致）',p.miconName));
    case 'merror_line': return fHint('控制巨集執行時是否顯示錯誤訊息。巨集結束後自動恢復為顯示狀態，無需手動開啟。')+
      fRow('設定',fSel(id,'onOff',[{v:'off',l:'關閉錯誤提示（適合技能輪換、整理類巨集）'},{v:'on',l:'開啟錯誤提示'}],p.onOff||'off'));
    case 'wait_line': return fHint('讓巨集暫停指定秒數再執行下一行。建議優先使用「內嵌等待」節省行數：將等待秒數填入其他指令行的「等待秒數」欄位即可。')+
      fRow('等待秒數',fInp(id,'secs','1',p.secs,'number','min="1" max="60"'),'（1~60秒）');
    case 'random': return fHint('隨機抽取一個數字並在說話範圍內廣播。省略上限值時從 0~999 中抽取。')+
      fRow('上限值（選填）',fInp(id,'max','省略則從 0~999 抽取；填入數字則從 1~N 抽取',p.max,'number','min="2" max="999"'));
    case 'custom': return fHint('直接輸入任何完整指令，原樣輸出。請確保語法完全正確，工具不做任何處理。')+
      fRow('完整指令',fInp(id,'text','輸入完整指令，如：/ta <t>',p.text));
    default: return fHint('選擇行類型以顯示設定選項。');
  }
}

function renderSkillFields(line,type){
  var p=line.params||{}, id=line.id;
  var labelMap={'skill':'職業技能（需要學會才能使用，如：治癒、神聖領域）',
    'generalskill':'通用技能（所有職業都有的動作，如：跳躍、衝刺、極限技）',
    'blueaction':'青魔法技能（青魔法師專用，需設定為有效技能）',
    'pvpaction':'PvP技能（只在對戰區生效）',
    'petaction':'召喚獸技能（控制召喚師的召喚獸）',
    'companionaction':'搭擋技能（控制陸行鳥搭擋）'};
  var cmdMap={'skill':'/ac','generalskill':'/gaction','blueaction':'/blueaction',
    'pvpaction':'/pvpaction','petaction':'/petaction','companionaction':'/companionaction'};
  return fHint(labelMap[type])+
    fRow('技能名稱',fInp(id,'skillName','技能名稱（與遊戲完全一致）',p.skillName))+
    (type!=='companionaction'?fRow('目標',fTgt(id,'target',p.target||'<t>')):'')+
    fRow('等待秒數',fInp(id,'inlineWait','0',p.inlineWait,'number','min="0" max="60"'),'秒（0＝不等待，加在行末 &lt;wait.X&gt;）')+
    (type==='skill'?'<div class="mf-combat-warn">⚠ 職業技能巨集可能干擾 GCD 循環，建議只用於低頻技能或非高強度戰鬥</div>':'')+
    fSep('附加選項（每勾選一項增加一行輸出）')+
    fRow('',fChk(id,'preAnnounce','施放前預告（先在頻道發出訊息，等待後再施放）',p.preAnnounce))+
    (p.preAnnounce?
      fRow('預告訊息',fInp(id,'preAnnounceMsg','即將施放技能！',p.preAnnounceMsg))+
      fRow('頻道',fCH(id,'preAnnounceChannel',p.preAnnounceChannel))+
      fRow('等待秒數',fInp(id,'preAnnounceWait','2',p.preAnnounceWait,'number','min="0" max="60"'),'秒（等待後再施放）')+
      fRow('音效',fSE(id,'preAnnounceSe',p.preAnnounceSe)):'')+
    fRow('',fChk(id,'postNotify','施放後立即在頻道通知',p.postNotify))+
    (p.postNotify?
      fRow('通知訊息',fInp(id,'postNotifyMsg','技能已施放！',p.postNotifyMsg))+
      fRow('頻道',fCH(id,'postNotifyChannel',p.postNotifyChannel))+
      fRow('音效',fSE(id,'postNotifySe',p.postNotifySe)):'')+
    fRow('',fChk(id,'postEcho','施放後自我提示（僅自己看到）',p.postEcho))+
    (p.postEcho?
      fRow('提示訊息',fInp(id,'postEchoMsg','技能使用完畢',p.postEchoMsg))+
      fRow('音效',fSE(id,'postEchoSe',p.postEchoSe)):'')+
    fRow('',fChk(id,'recastNotify','施放後顯示冷卻時間（使用 &lt;recast&gt; 代名詞）',p.recastNotify))+
    (p.recastNotify?
      fRow('前綴文字',fInp(id,'recastPrefix','留空則自動填入【技能名】剩餘冷卻：',p.recastPrefix))+
      fRow('後綴文字',fInp(id,'recastSuffix',' 秒',p.recastSuffix||' 秒'))+
      fRow('發送到',fSel(id,'recastChannel',[{v:'e',l:'默語（僅自己）'},{v:'p',l:'小隊'},{v:'fc',l:'部隊'}],p.recastChannel||'e'))+
      fRow('音效',fSE(id,'recastSe',p.recastSe)):''
    );
}

function renderItemFields(line){
  var p=line.params||{}, id=line.id;
  return fHint('使用背包中的指定道具。道具必須在背包裡才能執行，名稱需與遊戲完全一致。')+
    fRow('道具名稱',fInp(id,'itemName','道具名稱（與遊戲完全一致，如：高級乙太藥）',p.itemName))+
    fRow('目標',fTgt(id,'target',p.target||'<me>'))+
    fSep('附加選項')+
    fRow('',fChk(id,'postEcho','使用後顯示確認訊息（僅自己看到）',p.postEcho))+
    (p.postEcho?fRow('確認訊息',fInp(id,'postEchoMsg','已使用：'+(p.itemName||'道具名稱'),p.postEchoMsg))+fRow('音效',fSE(id,'postEchoSe',p.postEchoSe)):'');
}

function renderEmoteFields(line){
  var p=line.params||{}, id=line.id;
  var emoteOpts=[{v:'custom',l:'自訂輸入情感動作指令名'}].concat(
    EMOTES.map(function(e){return{v:e.v,l:e.l+'（'+e.v+'）'};}));
  return fHint('播放指定情感動作。勾選「僅播動作」後加上 motion 子命令，只播放動作動畫但不顯示文字提示。')+
    fRow('情感動作',fSel(id,'emoteName',emoteOpts,p.emoteName||'bow')+
      (p.emoteName==='custom'?fInp(id,'emoteCustom','輸入情感動作的英文指令名（如 bow）',p.emoteCustom):''))+
    fRow('',fChk(id,'motionOnly','僅播動作，不顯示文字提示（加上 motion）',p.motionOnly))+
    fSep('選填：同時發出感情表現文字')+
    fHint('情感動作後緊接 /em 文字，效果：角色播放動作，同時顯示第三人稱自訂文字。')+
    fRow('',fChk(id,'addEm','附加感情表現文字（/em）',p.addEm))+
    (p.addEm?fRow('文字內容',fInp(id,'emText','如：向 <t> 深深一鞠躬。',p.emText))+fRow('音效',fSE(id,'emSe',p.emSe)):'');
}

function renderAbilityRotation(line){
  var p=line.params||{}, id=line.id;
  var skills=p.skills||['','',''];
  var skillInputs=skills.map(function(s,i){
    return '<div class="ar-skill-row"><span class="ar-num">'+(i+1)+'</span>'+
      '<input class="mf-inp ar-skill" data-id="'+id+'" data-ar-idx="'+i+'" placeholder="技能名稱（與遊戲完全一致）" value="'+esc(s)+'">'+'<button class="ar-del" data-id="'+id+'" data-ar-idx="'+i+'">✕</button></div>';
  }).join('');
  return fHint('將多個能力技（不佔 GCD 的技能）排在一起。反覆按下此巨集，會依序嘗試施放每個技能，冷卻中的會跳過（建議搭配全局 /merror off 或在上方勾選）。')+
    '<div class="mf-combat-warn">⚠ 此功能需要技能均為「能力技」（不佔 GCD 的瞬發技），若放入佔 GCD 的技能會影響循環。</div>'+
    fRow('目標',fTgt(id,'target',p.target||'<t>'))+
    fRow('等待秒數',fInp(id,'inlineWait','0',p.inlineWait,'number','min="0" max="60"'),'秒（一般能力技不需等待）')+
    fSep('技能列表（按上至下順序排列）')+
    '<div class="ar-list" id="ar-list-'+id+'">'+skillInputs+'</div>'+
    '<button class="ar-add" data-id="'+id+'">＋ 新增技能</button>';
}

function renderTargetingFields(line){
  var p=line.params||{}, id=line.id;
  var cmds=[
    {v:'/bt',l:'/bt　選中最近敵視目標（最常用）'},
    {v:'/ta',l:'/ta　選中指定目標（搭配代名詞）'},
    {v:'/tpc',l:'/tpc　選中最近玩家'},
    {v:'/tnpc',l:'/tnpc　選中最近 NPC'},
    {v:'/tenemy',l:'/tenemy　選中最近敵人'},
    {v:'/nt',l:'/nt　向右順次選中下一個目標'},
    {v:'/previoustarget',l:'/previoustarget　向左選中上一個目標'},
    {v:'/tlt',l:'/tlt　重新選中上次目標'},
    {v:'/tle',l:'/tle　重新選中前次敵人'}
  ];
  return fHint('選中指定種類的目標。')+
    fRow('指令',fSel(id,'targetCmd',cmds,p.targetCmd||'/bt'))+
    ((!p.targetCmd||p.targetCmd==='/bt'||p.targetCmd==='/ta'||p.targetCmd==='/as')?
      fRow('目標（選填）',fTgt(id,'targetParam',p.targetParam||'')):'');
}

function renderMarkingFields(line){
  var p=line.params||{}, id=line.id;
  var mkTypes=[
    {v:'attack',l:'攻擊（自動下一個編號）'},{v:'attack1',l:'攻擊1'},{v:'attack2',l:'攻擊2'},
    {v:'attack3',l:'攻擊3'},{v:'attack4',l:'攻擊4'},{v:'attack5',l:'攻擊5'},
    {v:'bind',l:'止步（自動下一個編號）'},{v:'bind1',l:'止步1'},{v:'bind2',l:'止步2'},{v:'bind3',l:'止步3'},
    {v:'stop',l:'禁止（自動下一個編號）'},{v:'stop1',l:'禁止1'},{v:'stop2',l:'禁止2'},
    {v:'square',l:'方塊'},{v:'circle',l:'圓圈'},{v:'cross',l:'叉'},{v:'triangle',l:'三角'},
    {v:'clear',l:'清除所有標記'}
  ];
  return fHint('給目標加上攻擊順序或形狀標記。小隊成員都能看到標記。')+
    fRow('標記種類',fSel(id,'markType',mkTypes,p.markType||'attack1'))+
    (p.markType!=='clear'?fRow('標記目標',fTgt(id,'markTarget',p.markTarget||'<t>')):'')+
    fSep('選填：完成後通知')+
    fRow('',fChk(id,'notify','完成後在頻道通知',p.notify))+
    (p.notify?fRow('訊息',fInp(id,'notifyMsg','標記已設定！',p.notifyMsg))+fRow('頻道',fCH(id,'notifyChannel',p.notifyChannel))+fRow('音效',fSE(id,'notifySe',p.notifySe)):'');
}

function renderWaymarkFields(line){
  var p=line.params||{}, id=line.id;
  return fHint('設置場景標記（A/B/C/D 或 1~4），讓隊友知道站位或集合點。')+
    fRow('標記',fSel(id,'waymarkName',[{v:'A',l:'A'},{v:'B',l:'B'},{v:'C',l:'C'},{v:'D',l:'D'},{v:'1',l:'1'},{v:'2',l:'2'},{v:'3',l:'3'},{v:'4',l:'4'}],p.waymarkName||'A'))+
    fRow('模式',fSel(id,'waymarkAction',
      [{v:'toggle',l:'切換（已設定則撤除）'},{v:'target',l:'設在當前目標腳下（<t>）'},{v:'clear',l:'清除所有場景標記'}],
      p.waymarkAction||'toggle'))+
    fSep('選填：完成後通知')+
    fRow('',fChk(id,'notify','完成後在頻道通知',p.notify))+
    (p.notify?fRow('訊息',fInp(id,'notifyMsg','場景標記已設置！',p.notifyMsg))+fRow('頻道',fCH(id,'notifyChannel',p.notifyChannel))+fRow('音效',fSE(id,'notifySe',p.notifySe)):'');
}



function renderGearsetFields(line){
  var p=line.params||{}, id=line.id;
  return fHint('切換、儲存或查看裝備套裝（最多100組）。可附加圖示和確認訊息，讓熱鍵欄視覺效果統一。')+
    fRow('動作',fSel(id,'gsAction',[{v:'change',l:'切換套裝'},{v:'save',l:'儲存當前裝備至此編號'},{v:'view',l:'查看套裝內容'}],p.gsAction||'change'))+
    fRow('套裝編號',fInp(id,'gsNumber','1',p.gsNumber,'number','min="1" max="100"'),'（1~100）')+
    fSep('附加選項')+
    fRow('',fChk(id,'addMicon','加入巨集圖示（/micon，讓熱鍵欄顯示套裝圖示）',p.addMicon))+
    (p.addMicon?fRow('圖示類型',fSel(id,'miconType',MICON_T,p.miconType||'gearset')):'')+
    fRow('',fChk(id,'addEcho','加入切換確認訊息（僅自己看到）',p.addEcho))+
    (p.addEcho?fRow('確認訊息',fInp(id,'echoMsg','已切換至套裝 '+(p.gsNumber||'1'),p.echoMsg))+fRow('音效',fSE(id,'echoSe',p.echoSe)):'');
}

function renderItemsortFields(line){
  var p=line.params||{}, id=line.id;
  var areaChecks=IS_AREAS.map(function(a){
    var checked=(p.areas||[]).indexOf(a.v)>=0;
    return '<label class="is-area-lbl'+(checked?' checked':'')+'"><input type="checkbox" class="is-area-cb" data-id="'+id+'" data-area="'+a.v+'"'+(checked?' checked':'')+'>'+a.l+'</label>';
  }).join('');
  var conds=p.conditions||[];
  var condRows=conds.map(function(c,ci){
    var cdef=IS_C.filter(function(x){return x.v===c.criterion;})[0];
    return '<div class="is-cond-row">'+
      '<select class="mf-sel is-crit-sel" data-id="'+id+'" data-ci="'+ci+'">'+
        IS_C.map(function(x){return'<option value="'+x.v+'"'+(x.v===c.criterion?' selected':'')+'>'+x.l+'</option>';}).join('')+
      '</select>'+
      (cdef&&cdef.o?'<select class="mf-sel is-ord-sel" data-id="'+id+'" data-ci="'+ci+'"><option value="des"'+(c.order==='des'?' selected':'')+'>降序（高→低）</option><option value="asc"'+(c.order==='asc'?' selected':'')+'>升序（低→高）</option></select>':'<span class="mf-unit">（無升降序）</span>')+
      '<button class="is-del-cond" data-id="'+id+'" data-ci="'+ci+'">✕</button>'+
    '</div>';
  }).join('');
  return fHint('按設定條件整理指定區域的物品。每個區域依照排序條件的順序（上方優先）重新排列。')+
    fSep('整理目標（可多選）')+
    '<div class="is-area-wrap">'+
      '<button class="is-sel-common" data-id="'+id+'">常用整理（背包＋兵裝庫＋鞍囊）</button>'+
      '<button class="is-sel-all" data-id="'+id+'">全選</button>'+
      '<button class="is-sel-none" data-id="'+id+'">全不選</button>'+
    '</div>'+
    '<div class="is-areas" id="is-areas-'+id+'">'+areaChecks+'</div>'+
    fRow('',fChk(id,'useClear','每個區域排序前先執行 /itemsort clear（清除舊設定，使結果更乾淨）',p.useClear!==false))+
    fSep('排序條件（由上至下優先順序）')+
    '<div class="is-conds" id="is-conds-'+id+'">'+condRows+'</div>'+
    '<button class="is-add-cond" data-id="'+id+'">＋ 新增條件</button>'+
    fSep('完成後確認訊息（選填）')+
    fRow('訊息',fInp(id,'echoMsg','整理完成！（留空則不輸出）',p.echoMsg))+
    fRow('音效',fSE(id,'echoSe',p.echoSe));
}

function renderHudFields(line){
  var p=line.params||{}, id=line.id;
  var wins=p.windows||[];
  var winChecks=HUD_W.map(function(w){
    var checked=wins.indexOf(w.v)>=0;
    return '<label class="is-area-lbl'+(checked?' checked':'')+'"><input type="checkbox" class="hud-win-cb" data-id="'+id+'" data-win="'+w.v+'"'+(checked?' checked':'')+'>'+w.l+'</label>';
  }).join('');
  return fHint('一次控制多個 UI 視窗的顯示狀態。勾選要操作的視窗，再選擇統一的操作方式。')+
    fRow('操作方式',fSel(id,'toggle',[{v:'toggle',l:'切換（開↔關）'},{v:'on',l:'全部顯示'},{v:'off',l:'全部隱藏'}],p.toggle||'toggle'))+
    fSep('選擇要操作的視窗（可多選）')+
    '<div class="is-areas" id="hud-wins-'+id+'">'+winChecks+'</div>';
}

/* ════════════════════════════════════════════════
   LINE ROW HTML
════════════════════════════════════════════════ */
function lineSummary(line){
  var def=TDEFS[line.type]||{icon:'?',label:'未知'};
  var prev=linePreview(line);var cnt=lineCount(line);
  var cmds=buildLines(line);
  var r=parseInt(line.repeat)||1;
  return '<span class="ml-icon">'+def.icon+'</span>'+
    '<span class="ml-type-name">'+def.label+'</span>'+
    (cnt>1?'<span class="ml-blk-badge">'+cnt+'行</span>':'')+
    (r>1?'<span class="ml-rep-badge">×'+r+'</span>':'')+
    '<span class="ml-preview">'+esc(prev.length>60?prev.slice(0,60)+'…':prev)+'</span>';
}

function lineHTML(line,idx){
  var def=TDEFS[line.type]||{icon:'?',label:'未知'};
  var cmds=buildLines(line);
  var hdr_chars=cc(cmds[0]||'');
  var char_class=hdr_chars>MAX_C?' ml-chars-over':hdr_chars>WARN_C?' ml-chars-warn':'';
  var isFirst=idx===0, isLast=idx===lines.length-1;
  var isActive=line.id===activeLineId;
  return '<div class="ml-row'+(isActive?' ml-active':'')+'" data-id="'+line.id+'" data-expanded="'+(line.expanded?'1':'0')+'">'
    +'<div class="ml-head" data-toggle-id="'+line.id+'">'
      +'<div class="ml-left">'
        +'<span class="ml-num">'+(idx+1)+'</span>'
        +'<div class="ml-reorder">'
          +'<button class="ml-mv" data-id="'+line.id+'" data-dir="up"'+(isFirst?' disabled':'')+'>▲</button>'
          +'<button class="ml-mv" data-id="'+line.id+'" data-dir="down"'+(isLast?' disabled':'')+'>▼</button>'
        +'</div>'
      +'</div>'
      +'<div class="ml-summary">'+lineSummary(line)+'</div>'
      +'<div class="ml-right">'
        +'<span class="ml-chars'+char_class+'">'+hdr_chars+'/180</span>'
        +'<span class="ml-exp-icon">'+(line.expanded?'▲':'▼')+'</span>'
        +'<button class="ml-del" data-id="'+line.id+'" title="刪除此行">✕</button>'
      +'</div>'
    +'</div>'
    +(line.expanded?'<div class="ml-body">'
        +'<div class="ml-type-row">'
          +'<span class="ml-type-lbl">行類型</span>'
          +'<select class="ml-type-sel" data-id="'+line.id+'">'
            +Object.keys(TDEFS).map(function(k){var d=TDEFS[k];return '<option value="'+k+'"'+(k===line.type?' selected':'')+'>'+d.icon+' '+d.label+'</option>';}).join('')
          +'</select>'
        +'</div>'
        +'<div class="ml-fields">'+renderFields(line)+'</div>'
        +(def.isBlock?'<button class="ml-expand-btn" data-id="'+line.id+'">展開為獨立行（可個別編輯）</button>':
          '<div class="ml-repeat-row"><span class="ml-repeat-lbl">重複次數</span><input class="ml-repeat-inp" type="number" min="1" max="15" data-id="'+line.id+'" value="'+(line.repeat||1)+'"><span class="ml-repeat-hint">（此行在輸出中重複幾次）</span></div>'
        )
        +'<div class="ml-note-wrap"><input class="ml-note" data-id="'+line.id+'" placeholder="備註（僅此工具顯示，不輸出到巨集）" value="'+esc(line.note||'')+'"></div>'
        +'<div class="ml-cmd-preview">'+cmds.map(function(s){return esc(s);}).join('<br>')+'</div>'
      +'</div>':'')
    +'</div>';
}

/* ════════════════════════════════════════════════
   CATEGORY PICKER
════════════════════════════════════════════════ */
function pickerHTML(){
  if(!pickerCat){
    return '<div class="mt-picker"><div class="mt-picker-title">選擇要新增的行類型：</div>'
      +'<div class="mt-picker-cats">'
      +CATS.map(function(c){return '<button class="mt-cat-btn" data-cat="'+c.id+'">'+c.icon+'<span class="mt-cat-lbl">'+c.label+'</span><span class="mt-cat-desc">'+c.desc+'</span></button>';}).join('')
      +'</div></div>';
  }
  var types=Object.keys(TDEFS).filter(function(k){return TDEFS[k].cat===pickerCat;});
  var catDef=CATS.filter(function(c){return c.id===pickerCat;})[0]||{icon:'',label:''};
  return '<div class="mt-picker"><div class="mt-picker-title">'
    +'<button class="mt-picker-back">← 返回</button>'
    +catDef.icon+' '+catDef.label+'</div>'
    +'<div class="mt-picker-types">'
    +types.map(function(k){var d=TDEFS[k];return '<button class="mt-type-btn" data-type="'+k+'">'+d.icon+' '+d.label+'</button>';}).join('')
    +'</div></div>';
}

/* ════════════════════════════════════════════════
   TOOL HTML
════════════════════════════════════════════════ */
function toolHTML(){
  return '<h2 class="unified-gold-header small">⚙ 巨集建立工具</h2>'
    +'<div class="fancy-divider mini"><div class="long-silk-line-short"></div></div>'
    +'<p class="mt-intro">FF14 巨集上限 <b>15 行</b>，每行上限 <b>180 字元</b>（中文字每個佔3字元，英文/符號/空格各佔1字元）。工具即時計算並提示問題。每一行均可自由修改、增刪及調換順序。模板供快速開始亦可自由修改。</p>'
    +'<div class="mt-steps"><span class="mt-step active">① 選擇模板或新增行</span><span class="mt-step-arr">→</span><span class="mt-step">② 展開各行進行設定</span><span class="mt-step-arr">→</span><span class="mt-step">③ 確認後複製貼入遊戲</span></div>'
    // Global settings
    +'<div class="mt-global-bar">'
      +'<span class="mt-global-ttl">全局設定（自動加入巨集開頭）</span>'
      +'<label class="mt-glbl-chk" title="執行完畢前不允許其他巨集打斷，建議複雜巨集使用"><input type="checkbox" id="g-mlock"'+(globalCfg.mlock?' checked':'')+'> /mlock　鎖定巨集</label>'
      +'<label class="mt-glbl-chk" title="關閉執行中的錯誤提示，巨集結束後自動恢復，技能輪換及整理類巨集建議開啟"><input type="checkbox" id="g-merror"'+(globalCfg.merrorOff?' checked':'')+'>  /merror off　關閉錯誤提示</label>'
    +'</div>'
    // Templates
    +'<div class="mt-sec">'
      +'<div class="mt-sec-hdr"><span class="mt-sec-lbl">▸ 模板快速開始</span>'
      +'<button class="mt-clearall" id="mt-clearall">清空所有行</button></div>'
      +'<div class="mt-tpl-row">'
        +TEMPLATES.map(function(t){return '<div class="mt-tpl-card" data-tpl="'+t.id+'"><div class="mt-tpl-icon">'+t.icon+'</div><div class="mt-tpl-info"><div class="mt-tpl-name">'+t.label+'</div><div class="mt-tpl-desc">'+t.desc+'</div></div></div>';}).join('')
      +'</div>'
    +'</div>'
    // Line editor
    +'<div class="mt-sec mt-editor-sec">'
      +'<div class="mt-sec-hdr">'
        +'<span class="mt-sec-lbl">▸ 行編輯器</span>'
        +'<span class="mt-lc" id="mt-lc">0 / 15 行</span>'
      +'</div>'
      +'<div class="mt-lines" id="mt-lines"><div class="mt-empty">尚無行 — 選擇模板，或按「＋ 新增行」</div></div>'
      +'<div id="mt-picker-wrap"></div>'
      +'<button class="mt-addbtn" id="mt-addbtn">＋ 新增行</button>'
    +'</div>'
    // Warnings
    +'<div class="mt-sec mt-warn-sec" id="mt-warn-sec" style="display:none">'
      +'<div class="mt-sec-lbl">▸ 提示與警告</div><div id="mt-warns"></div>'
    +'</div>'
    // Preview
    +'<div class="mt-sec" id="mt-preview-sec">'
      +'<div class="mt-sec-hdr"><span class="mt-sec-lbl">▸ 巨集預覽</span>'
      +'<div style="display:flex;gap:8px;">'
      +'<button class="mt-edit-toggle" id="mt-edit-toggle">切換編輯</button>'
      +'<button class="mt-copybtn" id="mt-copybtn">複製巨集</button>'
      +'</div></div>'
      +'<div id="mt-preview-wrap"><pre class="mt-preview" id="mt-preview">（巨集為空）</pre></div>'
      +'<div id="mt-split-area"></div>'
    +'</div>'
    // Pronouns
    +'<div class="mt-sec">'
      +'<div class="mt-sec-lbl">▸ 常用指令代名詞 <span class="mt-prosub">（點擊可複製）</span></div>'
      +'<div class="mt-prorow">'+PRONS.map(function(p){return '<span class="mt-pro" title="'+esc(p.d)+'">'+esc(p.s)+'</span>';}).join('')+'</div>'
    +'</div>';
}

/* ════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════ */
function render(){
  var el=document.getElementById('mt-lines');
  if(!el) return;
  el.innerHTML=lines.length?lines.map(function(l,i){return lineHTML(l,i);}).join('')
    :'<div class="mt-empty">尚無行 — 選擇模板，或按「＋ 新增行」</div>';
  var lc=document.getElementById('mt-lc');
  if(lc){var t=getTotalLines();lc.textContent=t+' / 15 行';lc.className='mt-lc'+(t>MAX?' over':t>12?' warn':'');}
  var ab=document.getElementById('mt-addbtn');if(ab) ab.disabled=getTotalLines()>=MAX;
  var pw=document.getElementById('mt-picker-wrap');
  if(pw){
    var showPicker=(pickerCat!==null)||(pickerCat===null&&!!pw.dataset.open);
    pw.innerHTML=showPicker?pickerHTML():'';
    if(showPicker)bindPickerEvents();
  }
  bindLineEvents();
  updatePreview();
}

function updatePreview(){
  var out=getAllOutput();
  // Don't overwrite if user is editing
  if(!previewEditable){
    var pre=document.getElementById('mt-preview');
    if(pre) pre.textContent=out.length?out.join('\n'):'（巨集為空）';
  }
  var warns=validate();
  var ws=document.getElementById('mt-warn-sec'),wc=document.getElementById('mt-warns');
  if(ws&&wc){
    if(!warns.length){ws.style.display='none';}
    else{ws.style.display='';wc.innerHTML=warns.map(function(w){
      return '<div class="mt-warn '+w.lv+'">'+(w.lv==='error'?'⛔':w.lv==='warn'?'⚠️':'ℹ️')+' '+esc(w.msg)+'</div>';
    }).join('');}
  }
  // Split button
  var sa=document.getElementById('mt-split-area');
  if(sa){
    if(out.length>MAX){
      splitData=doSplit(out);
      var overflowNote=splitData.overflow>0
        ?'<div class="mt-split-note mt-split-error">⛔ 內容過長，即使分割成兩個巨集仍放不下，巨集 2 已被截斷，少了 '+splitData.overflow+' 行（未包含在下方輸出中）！請先刪減部分內容，或將巨集2的內容再拆成更多自訂行/巨集。</div>'
        :'';
      sa.innerHTML='<div class="mt-split-note">⚠ 此巨集超過 '+MAX+' 行，已自動分割成兩個巨集。兩個都需分別複製使用，請依序執行巨集1 → 巨集2。</div>'
        +overflowNote
        +'<div class="mt-dual">'
          +'<div class="mt-dual-col"><div class="mt-dual-hdr">巨集 1（'+splitData.m1.length+'/'+MAX+' 行）</div><pre class="mt-split-pre">'+esc(splitData.m1.join('\n'))+'</pre><button class="mt-split-copy" data-which="1">複製巨集 1</button></div>'
          +'<div class="mt-dual-col"><div class="mt-dual-hdr">巨集 2（'+splitData.m2.length+'/'+MAX+' 行'+(splitData.overflow>0?'，另有 '+splitData.overflow+' 行被截斷':'')+'）</div><pre class="mt-split-pre">'+esc(splitData.m2.join('\n'))+'</pre><button class="mt-split-copy" data-which="2">複製巨集 2</button></div>'
        +'</div>';
      document.getElementById('mt-copybtn').style.display='none';
    } else {
      splitData=null;sa.innerHTML='';
      var cb=document.getElementById('mt-copybtn');if(cb)cb.style.display='';
    }
  }
}

function updateRow(id){
  var line=lines.find(function(l){return l.id===id;});if(!line)return;
  var row=document.querySelector('.ml-row[data-id="'+id+'"]');if(!row)return;
  var cmds=buildLines(line);var hdr_chars=cc(cmds[0]||'');
  var cc_class=hdr_chars>MAX_C?' ml-chars-over':hdr_chars>WARN_C?' ml-chars-warn':'';
  var charEl=row.querySelector('.ml-chars');if(charEl){charEl.textContent=hdr_chars+'/180';charEl.className='ml-chars'+cc_class;}
  var sumEl=row.querySelector('.ml-summary');if(sumEl)sumEl.innerHTML=lineSummary(line);
  var cmdEl=row.querySelector('.ml-cmd-preview');if(cmdEl)cmdEl.innerHTML=cmds.map(function(s){return esc(s);}).join('<br>');
}

/* ── Split logic ── */
function doSplit(allLines){
  var header=[];
  if(globalCfg.mlock) header.push('/mlock');
  if(globalCfg.merrorOff) header.push('/merror off');
  // find micon in lines
  var miconLine=allLines.filter(function(s){return s.startsWith('/micon');})[0];
  var m1=allLines.slice(0,MAX);
  var rawM2=allLines.slice(MAX);
  var m2header=[];
  header.forEach(function(h){m2header.push(h);});
  if(miconLine&&m2header.indexOf(miconLine)<0) m2header.push(miconLine);
  var m2full=m2header.concat(rawM2);
  var overflow=Math.max(0,m2full.length-MAX);
  var m2=m2full.slice(0,MAX);
  return{m1:m1,m2:m2,overflow:overflow};
}

/* ── Force exit preview edit mode (call before any major content replacement) ── */
function exitPreviewEdit(){
  if(!previewEditable) return;
  previewEditable=false;
  var etBtn=document.getElementById('mt-edit-toggle');
  if(etBtn){etBtn.textContent='切換編輯';etBtn.classList.remove('active');}
  var wrap=document.getElementById('mt-preview-wrap');
  if(wrap) wrap.innerHTML='<pre class="mt-preview" id="mt-preview"></pre>';
}

/* ════════════════════════════════════════════════
   EVENTS
════════════════════════════════════════════════ */
function bindRoot(){
  // Global settings
  var gm=document.getElementById('g-mlock');
  if(gm)gm.addEventListener('change',function(){globalCfg.mlock=gm.checked;render();});
  var ge=document.getElementById('g-merror');
  if(ge)ge.addEventListener('change',function(){globalCfg.merrorOff=ge.checked;render();});
  // Templates
  var tr=document.querySelector('.mt-tpl-row');
  if(tr)tr.addEventListener('click',function(e){
    var card=e.target.closest('.mt-tpl-card');if(!card)return;
    var tpl=TEMPLATES.filter(function(t){return t.id===card.dataset.tpl;})[0];if(!tpl)return;
    if(lines.length>0&&!confirm('套用「'+tpl.label+'」模板將取代現有所有行，確認？'))return;
    exitPreviewEdit();
    lines=tpl.lines.map(function(l){return Object.assign({},l,{id:nextId++,params:dc(l.params),expanded:false});});
    render();
  });
  // Add line button
  var ab=document.getElementById('mt-addbtn');
  if(ab)ab.addEventListener('click',function(){
    var pw=document.getElementById('mt-picker-wrap');
    if(!pw) return;
    if(pw.dataset.open){delete pw.dataset.open;pw.innerHTML='';pickerCat=null;return;}
    pw.dataset.open='1';pickerCat=null;pw.innerHTML=pickerHTML();
    bindPickerEvents();
  });
  // Clear all
  var ca=document.getElementById('mt-clearall');
  if(ca)ca.addEventListener('click',function(){
    if(!lines.length)return;if(!confirm('確定清空所有行？'))return;
    exitPreviewEdit();
    lines=[];render();
  });
  // Copy button
  var cb=document.getElementById('mt-copybtn');
  if(cb)cb.addEventListener('click',function(){
    var out;
    if(previewEditable){
      var ta=document.getElementById('mt-preview-edit');
      out=ta?ta.value:'';
    } else {
      out=getAllOutput().join('\n');
    }
    if(!out.trim()){alert('巨集為空，請先新增內容');return;}
    copyText(out,cb,'複製巨集');
  });
  // Edit toggle
  var etBtn=document.getElementById('mt-edit-toggle');
  if(etBtn)etBtn.addEventListener('click',function(){
    previewEditable=!previewEditable;
    var wrap=document.getElementById('mt-preview-wrap');
    if(!wrap)return;
    if(previewEditable){
      var pre=document.getElementById('mt-preview');
      var content=pre?pre.textContent:'';
      var rect=pre?pre.getBoundingClientRect():{width:0,height:0};
      var w=Math.round(rect.width)||wrap.offsetWidth||0;
      var h=Math.max(Math.round(rect.height),160);
      var ta=document.createElement('textarea');
      ta.id='mt-preview-edit';ta.className='mt-preview-edit';
      ta.value=content;
      ta.style.cssText='height:'+h+'px;width:'+w+'px;max-width:100%;box-sizing:border-box;resize:both;';
      wrap.innerHTML='';wrap.appendChild(ta);
      etBtn.textContent='鎖定預覽';etBtn.classList.add('active');
      ta.focus();
    } else {
      var ta2=document.getElementById('mt-preview-edit');
      wrap.innerHTML='<pre class="mt-preview" id="mt-preview"></pre>';
      etBtn.textContent='切換編輯';etBtn.classList.remove('active');
      updatePreview();
    }
  });
  // Pronouns
  document.querySelectorAll('.mt-pro').forEach(function(chip){
    chip.addEventListener('click',function(){
      var s=chip.textContent;
      if(navigator.clipboard)navigator.clipboard.writeText(s).catch(function(){});
      chip.classList.add('copied');setTimeout(function(){chip.classList.remove('copied');},700);
    });
  });
  // Inline pronoun insert
  document.addEventListener('click',function(e){
    var chip=e.target.closest('.inline-pro');
    if(!chip) return;
    var sym=chip.dataset.sym;if(!sym) return;
    var wrap=chip.closest('.msg-inp-wrap');
    var inp=wrap?wrap.querySelector('.msg-inp'):_lastMsgInput;
    if(inp) insertAtCursor(inp,sym);
  });
  document.addEventListener('focusin',function(e){
    if(e.target&&e.target.classList&&e.target.classList.contains('msg-inp'))
      _lastMsgInput=e.target;
  });
}

function bindPickerEvents(){
  var pw=document.getElementById('mt-picker-wrap');if(!pw)return;
  var backBtn=pw.querySelector('.mt-picker-back');
  if(backBtn)backBtn.addEventListener('click',function(){pickerCat=null;pw.innerHTML=pickerHTML();bindPickerEvents();});
  pw.querySelectorAll('.mt-cat-btn').forEach(function(btn){
    btn.addEventListener('click',function(){pickerCat=btn.dataset.cat;pw.innerHTML=pickerHTML();bindPickerEvents();});
  });
  pw.querySelectorAll('.mt-type-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(getTotalLines()>=MAX){alert('已達 '+MAX+' 行上限。');return;}
      addLine(btn.dataset.type);
      delete pw.dataset.open;pw.innerHTML='';pickerCat=null;
    });
  });
}

function addLine(type){
  var newId=nextId;
  activeLineId=newId;
  lines.push({id:nextId++,type:type,params:{},note:'',expanded:true,repeat:1});
  render();
  setTimeout(function(){
    var newRow=document.querySelector('.ml-row[data-id="'+newId+'"]');
    if(newRow){
      newRow.classList.add('ml-new');
      newRow.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(function(){newRow.classList.remove('ml-new');},900);
    }
  },60);
}

function bindLineEvents(){
  var el=document.getElementById('mt-lines');if(!el)return;
  // Toggle expand — only the clicked line becomes active (bright)
  el.querySelectorAll('.ml-head[data-toggle-id]').forEach(function(hdr){
    hdr.addEventListener('click',function(e){
      if(e.target.closest('.ml-del')||e.target.closest('.ml-mv'))return;
      var id=+hdr.dataset.toggleId;
      var line=lines.find(function(l){return l.id===id;});
      if(!line)return;
      line.expanded=!line.expanded;
      activeLineId=line.expanded?id:null;
      renderKeepScroll();
    });
  });
  // Delete
  el.querySelectorAll('.ml-del').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;lines=lines.filter(function(l){return l.id!==id;});render();
    });
  });
  // Move
  el.querySelectorAll('.ml-mv').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id,dir=btn.dataset.dir;
      var idx=-1;lines.forEach(function(l,i){if(l.id===id)idx=i;});if(idx<0)return;
      if(dir==='up'&&idx>0){var t=lines[idx-1];lines[idx-1]=lines[idx];lines[idx]=t;}
      if(dir==='down'&&idx<lines.length-1){var t2=lines[idx+1];lines[idx+1]=lines[idx];lines[idx]=t2;}
      render();
    });
  });
  // Type selector
  el.querySelectorAll('.ml-type-sel').forEach(function(sel){
    sel.addEventListener('change',function(e){
      var id=+sel.dataset.id;var line=lines.find(function(l){return l.id===id;});
      if(!line)return;line.type=sel.value;line.params={};render();
    });
  });
  // Text/number inputs
  el.querySelectorAll('.mf-inp').forEach(function(inp){
    inp.addEventListener('input',function(){
      var id=+inp.dataset.id,key=inp.dataset.key;
      var line=lines.find(function(l){return l.id===id;});if(!line||!key)return;
      line.params[key]=inp.value;updateRow(id);updatePreview();
    });
  });
  // Selects
  el.querySelectorAll('.mf-sel').forEach(function(sel){
    sel.addEventListener('change',function(){
      var id=+sel.dataset.id,key=sel.dataset.key;
      var line=lines.find(function(l){return l.id===id;});if(!line||!key)return;
      line.params[key]=sel.value;
      var NR=['target','markTarget','targetParam','motionEmote','miconType','gsAction','gsNumber','waymarkAction','markType','toggle','preMsg_on','postNotify','postEcho','recastNotify','preAnnounce','targetCmd','zone','addMicon','addEcho'];
      if(NR.indexOf(key)>=0) render(); else{updateRow(id);updatePreview();}
    });
  });
  // Checkboxes
  el.querySelectorAll('input[type="checkbox"][data-id]').forEach(function(cb){
    cb.addEventListener('change',function(){
      var id=+cb.dataset.id,key=cb.dataset.key;
      var line=lines.find(function(l){return l.id===id;});if(!line||!key)return;
      line.params[key]=cb.checked;render();
    });
  });
  // Notes
  el.querySelectorAll('.ml-note').forEach(function(inp){
    inp.addEventListener('input',function(){
      var id=+inp.dataset.id;var line=lines.find(function(l){return l.id===id;});
      if(line)line.note=inp.value;
    });
  });
  // Repeat
  el.querySelectorAll('.ml-repeat-inp').forEach(function(inp){
    inp.addEventListener('input',function(){
      var id=+inp.dataset.id;var line=lines.find(function(l){return l.id===id;});
      if(!line)return;line.repeat=Math.max(1,parseInt(inp.value)||1);updateRow(id);updatePreview();
    });
  });
  // Expand block to individual lines
  el.querySelectorAll('.ml-expand-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});
      if(!line)return;
      var cmds=buildLines(line);var idx=-1;lines.forEach(function(l,i){if(l.id===id)idx=i;});
      if(idx<0)return;
      var newLines=cmds.map(function(cmd){return{id:nextId++,type:'custom',params:{text:cmd},note:'',expanded:false,repeat:1};});
      lines.splice.apply(lines,[idx,1].concat(newLines));render();
    });
  });
  // ItemSort specific
  el.querySelectorAll('.is-area-cb').forEach(function(cb){
    cb.addEventListener('change',function(){
      var id=+cb.dataset.id,area=cb.dataset.area;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var arr=line.params.areas||[];
      if(cb.checked){if(arr.indexOf(area)<0)arr.push(area);}else{arr=arr.filter(function(a){return a!==area;});}
      line.params.areas=arr;updateRow(id);updatePreview();
      var lbl=cb.parentNode;if(lbl)lbl.className='is-area-lbl'+(cb.checked?' checked':'');
    });
  });
  el.querySelectorAll('.is-sel-common').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});if(!line)return;
      line.params.areas=['inventory','armourychest','saddlebag'];render();
    });
  });
  el.querySelectorAll('.is-sel-all').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});if(!line)return;
      line.params.areas=IS_AREAS.map(function(a){return a.v;});render();
    });
  });
  el.querySelectorAll('.is-sel-none').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});if(!line)return;
      line.params.areas=[];render();
    });
  });
  el.querySelectorAll('.is-crit-sel').forEach(function(sel){
    sel.addEventListener('change',function(){
      var id=+sel.dataset.id,ci=+sel.dataset.ci;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var conds=line.params.conditions||[];if(!conds[ci])return;
      conds[ci].criterion=sel.value;line.params.conditions=conds;render();
    });
  });
  el.querySelectorAll('.is-ord-sel').forEach(function(sel){
    sel.addEventListener('change',function(){
      var id=+sel.dataset.id,ci=+sel.dataset.ci;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var conds=line.params.conditions||[];if(!conds[ci])return;
      conds[ci].order=sel.value;line.params.conditions=conds;updateRow(id);updatePreview();
    });
  });
  el.querySelectorAll('.is-del-cond').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id,ci=+btn.dataset.ci;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      line.params.conditions=(line.params.conditions||[]).filter(function(_,i){return i!==ci;});render();
    });
  });
  el.querySelectorAll('.is-add-cond').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var conds=line.params.conditions||[];conds.push({criterion:'itemlevel',order:'des'});
      line.params.conditions=conds;render();
    });
  });
  // HUD windows
  el.querySelectorAll('.hud-win-cb').forEach(function(cb){
    cb.addEventListener('change',function(){
      var id=+cb.dataset.id,win=cb.dataset.win;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var arr=line.params.windows||[];
      if(cb.checked){if(arr.indexOf(win)<0)arr.push(win);}else{arr=arr.filter(function(w){return w!==win;});}
      line.params.windows=arr;updateRow(id);updatePreview();
      var lbl=cb.parentNode;if(lbl)lbl.className='is-area-lbl'+(cb.checked?' checked':'');
    });
  });
  // Ability rotation
  el.querySelectorAll('.ar-skill').forEach(function(inp){
    inp.addEventListener('input',function(){
      var id=+inp.dataset.id,idx=+inp.dataset.arIdx;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var skills=line.params.skills||[];skills[idx]=inp.value;line.params.skills=skills;updateRow(id);updatePreview();
    });
  });
  el.querySelectorAll('.ar-del').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id,idx=+btn.dataset.arIdx;
      var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var skills=line.params.skills||[];skills.splice(idx,1);line.params.skills=skills;render();
    });
  });
  el.querySelectorAll('.ar-add').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();
      var id=+btn.dataset.id;var line=lines.find(function(l){return l.id===id;});if(!line)return;
      var skills=line.params.skills||[];skills.push('');line.params.skills=skills;render();
    });
  });
  // Split copy buttons
  var sa=document.getElementById('mt-split-area');
  if(sa)sa.querySelectorAll('.mt-split-copy').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!splitData)return;
      var which=btn.dataset.which;
      var out=(which==='1'?splitData.m1:splitData.m2).join('\n');
      copyText(out,btn,'複製巨集 '+which);
    });
  });
}

function copyText(text,btn,originalLabel){
  var copy=function(){
    var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);
  };
  var done=function(){
    var o=originalLabel||'複製';
    btn.textContent='✓ 已複製！';btn.classList.add('copied');
    setTimeout(function(){btn.textContent=o;btn.classList.remove('copied');},2000);
  };
  if(navigator.clipboard&&navigator.clipboard.writeText)
    navigator.clipboard.writeText(text).then(done).catch(function(){copy();done();});
  else{copy();done();}
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
var initialized=false;
function init(){
  var root=document.getElementById('macro-root');if(!root)return;
  root.innerHTML=toolHTML();bindRoot();render();
}
function tryInit(){
  var sc=document.getElementById('macro');if(!sc)return;
  if(!initialized&&sc.classList.contains('active')){initialized=true;init();}
}
document.addEventListener('DOMContentLoaded',function(){
  var sc=document.getElementById('macro');if(!sc)return;
  tryInit();new MutationObserver(tryInit).observe(sc,{attributes:true,attributeFilter:['class']});
});
})();
