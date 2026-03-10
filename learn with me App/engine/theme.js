// ============================================================
// THEME ENGINE — 6 animated world themes
// Each theme: CSS vars, mascot, sky gradient, particles, praise
// ============================================================

const Theme = (() => {
  const STORE = 'ylmd_theme';

  const THEMES = {
    dino: {
      name:'דינוזאורים', emoji:'🦕', mascot:'🦕',
      bg:'#1a4a0a',
      sky:'linear-gradient(180deg,#3ab8e8 0%,#7dd4f5 35%,#a8e08a 60%,#5a9e2a 80%,#2d6010 100%)',
      ground:'#2d6010',
      cardBg:'linear-gradient(145deg,#1a4a0a,#4a8a1a,#8bc34a)',
      dark:false, avatar:'🦕', accent:'#4CAF50',
      particles:[
        { e:'☁️', top:'12%', left:'15%', size:'2.2rem', dur:'6s',  delay:'0s',   op:0.75, anim:'cloudDrift' },
        { e:'☁️', top:'20%', left:'60%', size:'1.8rem', dur:'8s',  delay:'2s',   op:0.65, anim:'cloudDrift' },
        { e:'🍃', top:'55%', left:'72%', size:'1.6rem', dur:'4s',  delay:'1.2s', op:0.55, anim:'cloudDrift' },
        { e:'🌿', top:'70%', left:'8%',  size:'1.9rem', dur:'5s',  delay:'3s',   op:0.50, anim:'cloudDrift' },
      ],
      praise:['גאוות הדינוזאורים!','גדול כמו טי-רקס!','דינוזאור אלוף!','וואו, מדהים!','חכם וגדול!']
    },
    volcano: {
      name:'הר הגעש', emoji:'🌋', mascot:'🌋',
      bg:'#1a0000',
      sky:'linear-gradient(180deg,#1a0000 0%,#7a1500 35%,#c03000 60%,#2a0505 100%)',
      ground:'#1a0505',
      cardBg:'linear-gradient(145deg,#1a0000,#7a1500,#ff4500)',
      dark:true, avatar:'🌋', accent:'#FF4500',
      particles:[
        { e:'🔥', top:'30%', left:'20%', size:'1.8rem', dur:'2.5s', delay:'0s',   op:0.80, anim:'emberFloat' },
        { e:'✨', top:'18%', left:'65%', size:'1.4rem', dur:'3s',   delay:'0.8s', op:0.70, anim:'emberFloat' },
        { e:'🔥', top:'62%', left:'78%', size:'2.2rem', dur:'2.2s', delay:'1.5s', op:0.85, anim:'emberFloat' },
        { e:'💫', top:'75%', left:'10%', size:'1.6rem', dur:'3.5s', delay:'0.4s', op:0.60, anim:'emberFloat' },
      ],
      praise:['הר הגעש מתפרץ!','לוהט!','כוח אדיר!','אש!','גיבור הלבה!']
    },
    ocean: {
      name:'אוקיינוס', emoji:'🐠', mascot:'🐠',
      bg:'#003060',
      sky:'linear-gradient(180deg,#001a3a 0%,#0077b6 40%,#00b4d8 70%,#90e0ef 100%)',
      ground:'#023e8a',
      cardBg:'linear-gradient(145deg,#003060,#0077b6,#48cae4)',
      dark:true, avatar:'🐬', accent:'#00B4D8',
      particles:[
        { e:'🐟', top:'25%', left:'18%', size:'1.8rem', dur:'5s',  delay:'0s',   op:0.70, anim:'fishSwim' },
        { e:'💧', top:'15%', left:'70%', size:'1.4rem', dur:'4s',  delay:'1.4s', op:0.55, anim:'fishSwim' },
        { e:'🐚', top:'65%', left:'75%', size:'1.7rem', dur:'6s',  delay:'0.7s', op:0.60, anim:'fishSwim' },
        { e:'🌊', top:'78%', left:'8%',  size:'2rem',   dur:'3.5s',delay:'2.2s', op:0.65, anim:'fishSwim' },
      ],
      praise:['הדגים שמחים!','מלך האוקיינוס!','גלים מדהימים!','שייט אלוף!','עמוק ומדהים!']
    },
    space: {
      name:'חלל', emoji:'🚀', mascot:'🚀',
      bg:'#050520',
      sky:'linear-gradient(180deg,#000005 0%,#050520 40%,#1a1a6e 80%,#050520 100%)',
      ground:'#050520',
      cardBg:'linear-gradient(145deg,#050520,#1a1a6e,#7b2fbe)',
      dark:true, avatar:'🚀', accent:'#6B7FFF',
      particles:[
        { e:'⭐', top:'12%', left:'22%', size:'1.5rem', dur:'4s',  delay:'0s',   op:0.80, anim:'starTwinkle' },
        { e:'🌟', top:'20%', left:'68%', size:'1.8rem', dur:'5s',  delay:'1s',   op:0.75, anim:'starTwinkle' },
        { e:'✨', top:'60%', left:'80%', size:'1.3rem', dur:'3.5s',delay:'2s',   op:0.65, anim:'starTwinkle' },
        { e:'🌙', top:'72%', left:'5%',  size:'2rem',   dur:'6s',  delay:'0.5s', op:0.60, anim:'starTwinkle' },
      ],
      praise:['שיגרת רקטה!','אסטרונאוט אלוף!','סופרנובה!','גלקסיה!','כוכב-על!']
    },
    forest: {
      name:'יער', emoji:'🦉', mascot:'🦉',
      bg:'#0a1f0a',
      sky:'linear-gradient(180deg,#061406 0%,#1b5e20 35%,#43a047 65%,#2d6010 100%)',
      ground:'#1b3a0a',
      cardBg:'linear-gradient(145deg,#0a1f0a,#1b5e20,#43a047)',
      dark:true, avatar:'🦉', accent:'#66BB6A',
      particles:[
        { e:'🍃', top:'18%', left:'15%', size:'1.7rem', dur:'4.5s', delay:'0s',   op:0.70, anim:'cloudDrift' },
        { e:'🌿', top:'25%', left:'72%', size:'1.5rem', dur:'5.5s', delay:'1.8s', op:0.60, anim:'cloudDrift' },
        { e:'🦋', top:'55%', left:'80%', size:'1.6rem', dur:'3.8s', delay:'0.9s', op:0.65, anim:'cloudDrift' },
        { e:'🍂', top:'74%', left:'7%',  size:'1.8rem', dur:'4s',   delay:'2.5s', op:0.55, anim:'cloudDrift' },
      ],
      praise:['ינשוף חכם!','גיבור היער!','חזק כעץ!','טבע מדהים!','חקרת הכל!']
    },
    dragon: {
      name:'דרקונים', emoji:'🐉', mascot:'🐉',
      bg:'#1a0500',
      sky:'linear-gradient(180deg,#1a0500 0%,#6b1a00 40%,#ff6d00 60%,#1a0500 100%)',
      ground:'#1a0500',
      cardBg:'linear-gradient(145deg,#1a0500,#6b1a00,#ff6d00)',
      dark:true, avatar:'🐉', accent:'#FF6D00',
      particles:[
        { e:'🔥', top:'15%', left:'20%', size:'1.9rem', dur:'2.8s', delay:'0s',   op:0.80, anim:'emberFloat' },
        { e:'💫', top:'22%', left:'70%', size:'1.5rem', dur:'3.5s', delay:'0.7s', op:0.70, anim:'emberFloat' },
        { e:'⚡', top:'58%', left:'78%', size:'1.7rem', dur:'2.5s', delay:'1.4s', op:0.75, anim:'emberFloat' },
        { e:'🔥', top:'72%', left:'6%',  size:'2.1rem', dur:'3s',   delay:'2s',   op:0.85, anim:'emberFloat' },
      ],
      praise:['הדרקון גאה בך!','אש ועוצמה!','לוחם דרקונים!','כנפיים נפרשות!','אגדי!']
    },
  };

  function apply(id) {
    const t = THEMES[id] || THEMES.dino;
    localStorage.setItem(STORE, id);
    // Set .t-{theme} on body so CSS mascot/particle selectors work
    document.body.className = document.body.className.replace(/\bt-\w+/g, '').trim();
    document.body.classList.add('t-' + (THEMES[id] ? id : 'dino'));
    const r = document.documentElement.style;
    r.setProperty('--bg', t.bg);
    if (t.dark) {
      r.setProperty('--dark',             '#e8eeff');
      r.setProperty('--text-muted',       '#a0a8c8');
      r.setProperty('--bg-surface',       'rgba(255,255,255,0.10)');
      r.setProperty('--bg-surface-solid', '#1e2240');
      r.setProperty('--surface-border',   'rgba(255,255,255,0.15)');
    } else {
      r.setProperty('--dark',             '#1A1A2E');
      r.setProperty('--text-muted',       '#556');
      r.setProperty('--bg-surface',       'white');
      r.setProperty('--bg-surface-solid', 'white');
      r.setProperty('--surface-border',   'transparent');
    }
  }

  function getAvatar()  { return (THEMES[getCurrent()] || THEMES.dino).avatar; }
  function getCurrent() { return localStorage.getItem(STORE) || 'dino'; }
  function getAll()     { return THEMES; }
  function init()       { apply(getCurrent()); }

  function getPraise() {
    const list = (THEMES[getCurrent()] || THEMES.dino).praise;
    return list[Math.floor(Math.random() * list.length)];
  }

  return { apply, getAvatar, getCurrent, getAll, getPraise, init };
})();
