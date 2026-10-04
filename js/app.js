/* Cumbam Academy of Acupuncture — app logic (vanilla JS, no build step) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROUTES = ['home','acupuncture','about','healers','courses','books','videos','classes','articles','contact'];
  const TITLES = {home:'Home',acupuncture:'Acupuncture',about:'About',healers:'Acu Healers',courses:'Courses',books:'Books',videos:'Videos',classes:'2 & 4 Days Class',articles:'Medical Articles',contact:'Contact'};
  const store = {
    get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  };

  /* ---------- IMAGES: auto-detect extension from asset/<name>.* ---------- */
  const EXTS = ['png','jpg','jpeg','webp','avif','jfif'];
  function loadImg(img){
    const base = img.dataset.src; let i = 0;
    img.onerror = () => {
      i++;
      if (i < EXTS.length) img.src = `asset/${base}.${EXTS[i]}`;
      else { img.onerror = null; img.classList.add('missing'); img.closest('.imgbox')?.classList.add('noimg'); }
    };
    img.src = `asset/${base}.${EXTS[0]}`;
  }
  $$('img[data-src]').forEach(loadImg);

  /* ---------- LANGUAGE (EN / தமிழ்) ---------- */
  $$('[data-ta]').forEach(e => e.dataset.en = e.innerHTML);
  function setLang(l){
    document.documentElement.lang = l === 'ta' ? 'ta' : 'en';
    $$('[data-ta]').forEach(e => e.innerHTML = l === 'ta' ? e.dataset.ta : e.dataset.en);
    $('#langBtn').textContent = l === 'ta' ? 'EN' : 'தமிழ்';
    store.set('lang', l);
  }
  $('#langBtn').addEventListener('click', () => setLang(store.get('lang') === 'ta' ? 'en' : 'ta'));
  if (store.get('lang') === 'ta') setLang('ta');

  /* ---------- ROUTER (hash based, GitHub Pages friendly) ---------- */
  function route(){
    let r = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
    if (!ROUTES.includes(r)) r = 'home';
    $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + r));
    const tabs = ['home','courses','videos','contact'];
    $$('[data-route]').forEach(a => a.classList.toggle('active', a.dataset.route === r));
    $('#moreBtn').classList.toggle('active', !tabs.includes(r));
    document.title = (r === 'home' ? '' : TITLES[r] + ' · ') + 'Cumbam Academy of Acupuncture';
    closeSheet();
    window.scrollTo({top:0, behavior:'instant'});
    if (r === 'acupuncture') setTimeout(() => $('#mer')?.classList.add('in'), 200);
  }
  addEventListener('hashchange', route);
  route();

  /* ---------- MORE SHEET ---------- */
  const sheet = $('#sheet'), scrim = $('#scrim');
  function openSheet(){ sheet.classList.add('open'); scrim.classList.add('open'); }
  function closeSheet(){ sheet.classList.remove('open'); scrim.classList.remove('open'); }
  $('#moreBtn').addEventListener('click', openSheet);
  scrim.addEventListener('click', closeSheet);
  let sy = 0;
  sheet.addEventListener('touchstart', e => sy = e.touches[0].clientY, {passive:true});
  sheet.addEventListener('touchend', e => { if (e.changedTouches[0].clientY - sy > 70) closeSheet(); });

  /* ---------- SCROLL: progress bar + reveal + counters ---------- */
  const prog = $('#progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  }, {passive:true});

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.12});
  $$('.reveal').forEach(el => io.observe(el));

  function countUp(el){
    const to = el.dataset.years ? new Date().getFullYear() - +el.dataset.years : +el.dataset.to;
    if (reduce){ el.textContent = to; return; }
    const t0 = performance.now(), dur = 1600;
    (function step(t){
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); }
  }), {threshold:.6});
  $$('.count').forEach(el => cio.observe(el));

  /* ---------- BUTTON RIPPLE ---------- */
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn'); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const s = document.createElement('span'); s.className = 'ripple';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d/2}px;top:${e.clientY - r.top - d/2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 650);
  });

  /* ---------- HERO PARTICLES ---------- */
  (function particles(){
    const c = $('#particles'); if (!c || reduce) return;
    const x = c.getContext('2d'); let w, h, ps = [];
    function size(){ w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; }
    size(); addEventListener('resize', size);
    for (let i = 0; i < 46; i++) ps.push({x:Math.random()*2000, y:Math.random()*1200, r:Math.random()*2.4+.6, v:Math.random()*.5+.15, a:Math.random()*.6+.2, s:Math.random()*Math.PI*2});
    (function draw(){
      x.clearRect(0, 0, w, h);
      ps.forEach(p => {
        p.y -= p.v; p.s += .01; p.x += Math.sin(p.s) * .3;
        if (p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
        x.beginPath(); x.arc(p.x % w, p.y, p.r, 0, 7);
        x.fillStyle = `rgba(255,215,122,${p.a})`; x.shadowColor = '#ffd77a'; x.shadowBlur = 8; x.fill();
      });
      requestAnimationFrame(draw);
    })();
  })();

  /* ---------- CAROUSEL ---------- */
  (function carousel(){
    const t = $('#track'), d = $('#dots'); if (!t) return;
    const slides = $$('.slide', t);
    slides.forEach((_, i) => { const n = document.createElement('i'); d.appendChild(n); });
    const dots = $$('i', d);
    function upd(){
      const i = Math.round(t.scrollLeft / (slides[0].offsetWidth + 14));
      dots.forEach((x, k) => x.classList.toggle('on', k === Math.min(i, dots.length - 1)));
    }
    t.addEventListener('scroll', upd, {passive:true}); upd();
    let paused = false;
    t.addEventListener('touchstart', () => paused = true, {passive:true});
    t.addEventListener('mouseenter', () => paused = true);
    t.addEventListener('mouseleave', () => paused = false);
    if (!reduce) setInterval(() => {
      if (paused || document.hidden || !t.offsetParent) return;
      const step = slides[0].offsetWidth + 14;
      if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 8) t.scrollTo({left:0, behavior:'smooth'});
      else t.scrollBy({left:step, behavior:'smooth'});
    }, 3800);
  })();

  /* ---------- MERIDIAN POINTS ---------- */
  $$('.pt').forEach(p => p.addEventListener('click', () => {
    $('#ptInfo').innerHTML = `<b class="gold">${p.dataset.n}</b><br><span class="muted">${p.dataset.d}</span>`;
  }));

  /* ---------- BOOKS (from Puthuyir Pathippagam price list) ---------- */
  const BOOKS = [
    ['அக்குபங்ச்சர் ஒரு வாழ்க்கை அறிவியல்',10],['உடலின் மொழி (புதிய பதிப்பு)',80],['உணவோடு உரையாடல் (புதிய பதிப்பு)',40],
    ['உடல் நலம் உங்கள் கையில் (புதிய பதிப்பு)',80],['வீட்டுக்கு ஒரு மருத்துவர் (புதிய பதிப்பு)',250],['இந்திய அக்குபங்சர்',150],
    ['நோய்களிலிருந்து விடுதலை',70],['உங்களுக்குள் ஒரு மருத்துவர்',50],['தடுப்பூசி – வெளிப்படும் உண்மைகள்',40],
    ['மருத்துவ ஆய்வுக்கூடங்களில் நடப்பது என்ன?',50],['தொடு சிகிச்சை கற்போம்',70],['அக்குபங்சர் - சட்டம் சொல்வது என்ன?',90],
    ['உண்ணுவதெல்லாம் உணவல்ல',50],['மனம் என்னும் மாமருந்து',50],['மருத்துவத்தின் அரசியல்',50],['குணமாக்கும் கலை (புதிய பதிப்பு)',60],
    ['உடலோடு பேசுவோம்',70],['கிருமிகள் உலகில் மனிதர்கள்',90],['வீட்டுப் பிரசவம் எளிது',160],['உணவின்றி அமையாது உலகு (புதிய வெளியீடு)',110],
    ['எது மருத்துவம்?',10],['எமர்ஜென்சி',50],['மருத்துவக் கலைச் சொல்லியல்',50],['நான் நலமாக இருக்கிறேனா?',40],
    ['அக்குபங்சர் மூலப் புள்ளிகள்',50],['Indian Acupuncture',150],['Behind the Closed Door of Medical Laboratories',50],
    ['Acupuncture Meridian Charts (pictures)',200]
  ];
  const bl = $('#bookList');
  function renderBooks(q = ''){
    const f = BOOKS.filter(b => b[0].toLowerCase().includes(q.toLowerCase()));
    bl.innerHTML = f.length ? f.map(b => `<div class="book"><span class="t">${b[0]}</span><span class="p">₹${b[1]}</span></div>`).join('')
      : '<p class="muted center">No match. Check the full price list below.</p>';
  }
  renderBooks();
  $('#bookSearch').addEventListener('input', e => renderBooks(e.target.value.trim()));

  /* ---------- VIDEOS ---------- */
  const VIDEOS = ['nK6I7FX2Nuc','D6vRmYza4Js','BkUCknkf6-A'];
  const PLAYLISTS = [
    'PLLcjMxkA9esNh8WCyeX3o-Qd_bORXH90A','PL8uPJomd2ztEsZq_usMS8gUbthwMqELkv','PLvWBwQfkSVep1RRXsQqq4wSWteBeB-NdN',
    'PLDq6EEZdehKgPebMSyAKlEltFLKVX7IBC','PLDq6EEZdehKgeqtcaKjoN8wgTysNSTSLs','PLDq6EEZdehKgZxJwGMEWMzkqc1TC7jP0G',
    'PLDq6EEZdehKi66FqbSUim81NXsyGoGrYY','PLDq6EEZdehKgwxN9psDEjBhkgfNmsCtrU','PLDq6EEZdehKjcQBl6qPR7gk54sbQlgNpI',
    'PLDq6EEZdehKho9SxArdMWCRGVvwBLW-nY','PLL4-CH3jJYsCd3Pbw5eVAr4mZKkk6WVnd'
  ];
  const PLAY_SVG = '<span class="pl"><i><svg class="icon" style="width:22px;height:22px"><use href="#i-play"/></svg></i></span>';
  function renderVideos(kind){
    const g = $('#vgrid');
    g.innerHTML = kind === 'videos'
      ? VIDEOS.map((id, i) => `<button class="vcard" data-v="${id}"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">${PLAY_SVG}<span class="lb">Video ${i + 1}</span></button>`).join('')
      : PLAYLISTS.map((id, i) => `<button class="vcard" data-l="${id}">${PLAY_SVG}<span class="lb">Playlist ${i + 1}</span></button>`).join('');
  }
  renderVideos('videos');
  $('#vtabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#vtabs button').forEach(x => x.classList.toggle('on', x === b)); renderVideos(b.dataset.t);
  });
  $('#vgrid').addEventListener('click', e => {
    const c = e.target.closest('.vcard'); if (!c) return;
    const src = c.dataset.v
      ? `https://www.youtube-nocookie.com/embed/${c.dataset.v}?autoplay=1&rel=0`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${c.dataset.l}&autoplay=1&rel=0`;
    openModal(`<div class="vwrap"><iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`);
  });

  /* ---------- MODAL / ZOOM ---------- */
  const modal = $('#modal'), box = $('#modalBox');
  function openModal(html){ box.innerHTML = html; modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal(){ modal.classList.remove('open'); box.innerHTML = ''; document.body.style.overflow = ''; }
  $('#modalX').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.addEventListener('click', e => {
    const z = e.target.closest('.zoomable'); if (!z) return;
    const img = $('img', z); if (img && !img.classList.contains('missing')) openModal(`<img class="big" src="${img.src}" alt="">`);
  });

  /* ---------- ENQUIRY FORM -> WhatsApp ---------- */
  $('#enqForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = `Hello Cumbam Academy,\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nTopic: ${f.get('topic')}\nMessage: ${f.get('msg') || '-'}`;
    window.open('https://wa.me/919788223366?text=' + encodeURIComponent(text), '_blank');
    e.target.style.display = 'none'; $('#success').classList.add('show');
  });

  /* ---------- PWA ---------- */
  $('#yr').textContent = new Date().getFullYear();
  let deferred;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#installBtn').style.display = 'inline-block'; });
  $('#installBtn').addEventListener('click', async () => {
    if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBtn').style.display = 'none';
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
