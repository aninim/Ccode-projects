// ============================================================
// THEME ENGINE
// 7 visual worlds (default + 6 themed). Each theme sets CSS
// variables on :root, changing the background and journey avatar.
// ============================================================

const Theme = (() => {
  const STORE = 'ylmd_theme';

  // praise: theme-specific praise strings (used by Theme.getPraise())
  const THEMES = {
    default: { name:'ברירת מחדל', emoji:'🌈', bg:'#FFF9F0',  dark:false, avatar:'⭐',  accent:'#FF6B35',
      praise: ['כל הכבוד!', 'מעולה!', 'יפה מאוד!', 'וואו!', 'נהדר!'] },
    space:   { name:'חלל',        emoji:'🚀', bg:'#080c2a',  dark:true,  avatar:'🚀',  accent:'#6B7FFF',
      praise: ['שיגרת רקטה!', 'סופרנובה!', 'אסטרונאוט!', 'מסע כוכבים!', 'גלקסיה!'] },
    racing:  { name:'מירוצים',    emoji:'🏎️', bg:'#1a0505',  dark:true,  avatar:'🏎️',  accent:'#FF3535',
      praise: ['מהיר כרוח!', 'ניצחת!', 'גיבור המירוץ!', 'פניישר!', 'אלוף הכביש!'] },
    jungle:  { name:"ג'ונגל",     emoji:'🌴', bg:'#041a04',  dark:true,  avatar:'🦁',  accent:'#4CAF50',
      praise: ['האריה גאה בך!', "גיבור הג'ונגל!", 'חזק ואמיץ!', 'שאגת ניצחון!', 'מדהים!'] },
    ocean:   { name:'אוקיינוס',   emoji:'🌊', bg:'#020b18',  dark:true,  avatar:'🐬',  accent:'#00B4D8',
      praise: ['הדולפין שמח!', 'גלים מדהימים!', 'מלך האוקיינוס!', 'שייט!', 'עומק הים!'] },
    ninja:   { name:"נינג'ה",     emoji:'🥷', bg:'#0a0a0a',  dark:true,  avatar:'🥷',  accent:'#C9A84C',
      praise: ["נינג'ה מסטר!", 'מהיר כרוח!', 'שקט ועוצמתי!', 'לוחם אגדי!', 'מושלם!'] },
    pirate:  { name:'פיראט',      emoji:'🏴‍☠️', bg:'#1a0f00', dark:true,  avatar:'⚓',  accent:'#FF9800',
      praise: ['יו-הו!', 'אוצר מצאת!', 'קפטן גיבור!', 'ימאי אלוף!', 'הפיראט המנצח!'] },
  };

  function apply(id) {
    const t = THEMES[id] || THEMES.default;
    localStorage.setItem(STORE, id);
    const r = document.documentElement.style;
    r.setProperty('--bg', t.bg);
    if (t.dark) {
      r.setProperty('--dark',          '#e8eeff');
      r.setProperty('--text-muted',    '#a0a8c8');
      r.setProperty('--bg-surface',    'rgba(255,255,255,0.10)');
      r.setProperty('--bg-surface-solid', '#1e2240');
      r.setProperty('--surface-border','rgba(255,255,255,0.15)');
    } else {
      r.setProperty('--dark',          '#1A1A2E');
      r.setProperty('--text-muted',    '#666');
      r.setProperty('--bg-surface',    'white');
      r.setProperty('--bg-surface-solid', 'white');
      r.setProperty('--surface-border','transparent');
    }
  }

  function getAvatar()  { return (THEMES[getCurrent()] || THEMES.default).avatar; }
  function getCurrent() { return localStorage.getItem(STORE) || 'default'; }
  function getAll()     { return THEMES; }
  function init()       { apply(getCurrent()); }

  // Returns a random praise string for the current theme
  function getPraise() {
    const praiseList = (THEMES[getCurrent()] || THEMES.default).praise;
    return praiseList[Math.floor(Math.random() * praiseList.length)];
  }

  return { apply, getAvatar, getCurrent, getAll, getPraise, init };
})();
