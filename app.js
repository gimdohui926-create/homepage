/* =========================================================
   BeautyPalette 공통 스크립트
   - 각 HTML의 <body data-page="..."> 값에 따라 해당 페이지 기능을 실행
   - 로그인/결과 저장은 localStorage 사용 (백엔드 연동 전 임시 구현)
   ========================================================= */

const STORAGE = {
  users: 'bp_users',
  session: 'bp_session',
  result: 'bp_result',
};

/* ---------- localStorage 헬퍼 ---------- */
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 저장 불가 환경 무시 */ }
}
function remove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* 무시 */ }
}

/* ---------- 로그인 ---------- */
function currentUser() {
  return load(STORAGE.session, null);
}

function signup(name, email, password) {
  const users = load(STORAGE.users, []);
  if (users.some(u => u.email === email)) return '이미 가입된 이메일이에요.';
  users.push({ name, email, password });
  save(STORAGE.users, users);
  save(STORAGE.session, { name, email });
  return null;
}

function login(email, password) {
  const users = load(STORAGE.users, []);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return '이메일 또는 비밀번호가 올바르지 않아요.';
  save(STORAGE.session, { name: user.name, email: user.email });
  return null;
}

function logout() {
  remove(STORAGE.session);
  location.href = 'index.html';
}

/* ---------- 공통 헤더 / 푸터 ---------- */
function renderLayout() {
  const page = document.body.dataset.page;
  const user = currentUser();
  const links = [
    ['test', 'test.html', 'Test'],
    ['analysis', 'analysis.html', 'Analysis'],
    ['result', 'result.html', 'Result'],
    ['recommend', 'recommend.html', 'Recommend'],
  ];

  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="container">
      <a href="index.html" class="logo">Beauty<span>Palette</span></a>
      <button class="menu-toggle" aria-label="메뉴 열기">☰</button>
      <nav class="nav">
        ${links.map(([key, href, label]) =>
          `<a href="${href}" class="${page === key ? 'active' : ''}">${label}</a>`).join('')}
        ${user
          ? `<div class="nav-user"><span>${escapeHtml(user.name)} 님</span><span class="logout">로그아웃</span></div>`
          : `<a href="login.html" class="btn btn-sm">LOGIN</a>`}
      </nav>
    </div>`;
  document.body.prepend(header);

  const nav = header.querySelector('.nav');
  header.querySelector('.menu-toggle').addEventListener('click', () => nav.classList.toggle('open'));
  const logoutBtn = header.querySelector('.logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (page !== 'login' && page !== 'signup') {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <span>© 2026 BeautyPalette · 개인 맞춤형 뷰티 & 스타일링 추천</span>
        <span>본 진단은 셀프 체크 기반 참고용 결과입니다.</span>
      </div>`;
    document.body.append(footer);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- 진단 로직 ----------
   1) 각 답변의 score를 합산해 웜/쿨, 라이트/딥을 판정
   2) 두 축을 조합해 4계절 타입 결정
   3) 얼굴 분석·추구미 값은 set을 그대로 모아 저장                */
function computeResult(answers) {
  const score = { warm: 0, cool: 0, light: 0, deep: 0 };
  const profile = {};

  QUESTIONS.forEach((q, i) => {
    const opt = q.options[answers[i]];
    if (opt.score) {
      for (const key in opt.score) score[key] += opt.score[key];
    }
    if (opt.set) Object.assign(profile, opt.set);
  });

  const temp = score.warm >= score.cool ? 'warm' : 'cool';
  const depth = score.light >= score.deep ? 'light' : 'deep';
  const season = {
    warm: { light: 'spring', deep: 'autumn' },
    cool: { light: 'summer', deep: 'winter' },
  }[temp][depth];

  return { season, score, ...profile, date: new Date().toISOString() };
}

/* 0~100 비율 (두 값이 모두 0이면 50) */
function ratio(a, b) {
  return a + b === 0 ? 50 : Math.round((a / (a + b)) * 100);
}

/* ---------- 제품 카드 HTML ---------- */
function productCard(p, mineStyle) {
  const match = mineStyle && p.styles.includes(mineStyle);
  return `
    <article class="product-card">
      <div class="product-thumb">
        ${match ? '<span class="badge">추구미 MATCH</span>' : ''}
        <div class="swatch-blob" style="background:${p.color}"></div>
      </div>
      <div class="product-body">
        <span class="product-cat">${CATEGORIES[p.cat].toUpperCase()}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-tags">
          ${p.tones.length === 4 ? '<span>모든 톤</span>' : p.tones.map(t => `<span>${SEASONS[t].ko}</span>`).join('')}
          ${p.styles.map(s => `<span>#${STYLES[s].name}</span>`).join('')}
        </div>
      </div>
    </article>`;
}

/* =========================================================
   페이지별 기능
   ========================================================= */

/* ---------- 홈 ---------- */
function initHome() {
  // 트렌드 카드 슬라이드
  const card = document.getElementById('trend');
  const dots = document.getElementById('trend-dots');
  let idx = 0;

  function show(i) {
    idx = i;
    const t = TRENDS[i];
    card.querySelector('.tag').textContent = t.tag;
    card.querySelector('h3').innerHTML = t.title.replace('\n', '<br>');
    document.getElementById('trend-desc').textContent = `〈 ${t.desc} 〉`;
    dots.querySelectorAll('button').forEach((d, j) => d.classList.toggle('on', j === i));
  }
  dots.innerHTML = TRENDS.map((_, i) => `<button aria-label="트렌드 ${i + 1}"></button>`).join('');
  dots.querySelectorAll('button').forEach((d, i) => d.addEventListener('click', () => show(i)));
  show(0);
  setInterval(() => show((idx + 1) % TRENDS.length), 4500);

  // 인기 제품 4개
  const picks = ['코랄 글로우 틴트', '로즈 MLBB 벨벳 틴트', '브릭 벨벳 립스틱', '체리 레드 매트 립'];
  document.getElementById('popular-list').innerHTML =
    PRODUCTS.filter(p => picks.includes(p.name)).map(p => productCard(p)).join('');

  // 진단 결과가 있으면 CTA 문구 변경
  if (load(STORAGE.result, null)) {
    document.getElementById('hero-cta-text').textContent = '내 결과 다시 보기';
    document.getElementById('hero-cta').href = 'result.html';
  }
}

/* ---------- 로그인 / 회원가입 ---------- */
function initAuth(mode) {
  const form = document.getElementById('auth-form');
  const msg = document.getElementById('form-msg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let error;

    if (mode === 'signup') {
      if (data.password.length < 6) error = '비밀번호는 6자 이상 입력해 주세요.';
      else error = signup(data.name.trim(), data.email.trim(), data.password);
    } else {
      error = login(data.email.trim(), data.password);
    }

    if (error) {
      msg.textContent = error;
      return;
    }
    location.href = load(STORAGE.result, null) ? 'result.html' : 'test.html';
  });
}

/* ---------- 진단 (설문) ---------- */
function initTest() {
  const answers = new Array(QUESTIONS.length).fill(null);
  let cur = 0;

  const $ = id => document.getElementById(id);
  const sectionKeys = Object.keys(SECTIONS);

  function render() {
    const q = QUESTIONS[cur];

    // 단계 표시
    $('steps').innerHTML = sectionKeys.map((key, i) => {
      const curIdx = sectionKeys.indexOf(q.section);
      const cls = i === curIdx ? 'on' : i < curIdx ? 'done' : '';
      return `<span class="${cls}">STEP ${i + 1} · ${SECTIONS[key]}</span>`;
    }).join('');

    $('progress').style.width = `${((cur + 1) / QUESTIONS.length) * 100}%`;
    $('q-count').textContent = `${String(cur + 1).padStart(2, '0')} / ${QUESTIONS.length}`;
    $('q-title').textContent = q.title;
    $('q-hint').textContent = q.hint || '';

    $('options').innerHTML = q.options.map((o, i) => `
      <button class="option ${answers[cur] === i ? 'selected' : ''}" data-i="${i}">
        ${o.color ? `<span class="dot" style="background:${o.color}"></span>` : ''}
        <span>${o.label}${o.sub ? `<small>${o.sub}</small>` : ''}</span>
      </button>`).join('');

    $('options').querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', () => {
        answers[cur] = Number(btn.dataset.i);
        render();
        // 마지막 문항이 아니면 자동으로 다음 문항으로
        if (cur < QUESTIONS.length - 1) setTimeout(() => { cur++; render(); }, 280);
      });
    });

    $('prev').disabled = cur === 0;
    $('restart').style.visibility = answers.some(a => a !== null) ? 'visible' : 'hidden';
    $('next').disabled = answers[cur] === null;
    $('next').innerHTML = cur === QUESTIONS.length - 1
      ? '결과 보기 <span class="arrow">→</span>'
      : '다음 <span class="arrow">→</span>';
  }

  // 처음부터 다시 하기 : 답변을 모두 지우고 1번 문항으로
  $('restart').onclick = () => {
    if (!confirm('지금까지 고른 답이 모두 지워져요. 처음부터 다시 할까요?')) return;
    answers.fill(null);
    cur = 0;
    render();
  };
  $('prev').addEventListener('click', () => { if (cur > 0) { cur--; render(); } });
  $('next').addEventListener('click', () => {
    if (answers[cur] === null) return;
    if (cur < QUESTIONS.length - 1) {
      cur++;
      render();
    } else {
      save(STORAGE.result, computeResult(answers));
      location.href = 'result.html';
    }
  });

  render();
}

/* ---------- 분석 원리 ---------- */
function initAnalysis() {
  document.getElementById('season-list').innerHTML = Object.values(SEASONS).map(s => `
    <article class="season-card">
      <div class="arch">${s.palette.map(c => `<i style="background:${c.hex}"></i>`).join('')}</div>
      <div class="body">
        <h3>${s.en}</h3>
        <h4>${s.ko} · ${s.keywords.join(' · ')}</h4>
        <p>${s.desc}</p>
      </div>
    </article>`).join('');
}

/* ---------- 결과 ---------- */
function initResult() {
  const r = load(STORAGE.result, null);
  const root = document.getElementById('result-root');

  if (!r) {
    root.innerHTML = `
      <div class="empty">
        <p class="eyebrow">No Result Yet</p>
        <h1 class="section-title k">아직 진단 결과가 없어요</h1>
        <p>12개의 간단한 질문으로 나만의 팔레트를 찾아보세요.</p>
        <a href="test.html" class="btn">진단하러 가기 <span class="arrow">→</span></a>
      </div>`;
    return;
  }

  const s = SEASONS[r.season];
  const st = STYLES[r.style];
  const face = FACE_SHAPES[r.shape];
  const user = currentUser();
  const warmPct = ratio(r.score.warm, r.score.cool);
  const lightPct = ratio(r.score.light, r.score.deep);

  root.innerHTML = `
    <section class="container result-hero">
      <div class="result-arch">
        ${s.palette.map(c => `<div style="background:${c.hex};color:${r.season === 'winter' ? '#fff' : '#3A2E29'}">${c.name} ${c.hex}</div>`).join('')}
      </div>
      <div>
        <p class="eyebrow">${user ? escapeHtml(user.name) + ' 님의 ' : ''}Beauty Palette Result</p>
        <h1 class="result-type">${s.en}</h1>
        <p class="result-kor">${s.ko} × ${IMPRESSIONS[r.impression].name} ${face.name} × ${st.name} 추구미</p>
        <div class="result-keywords">${s.keywords.map(k => `<span>#${k}</span>`).join('')}<span>#${st.name}</span></div>
        <p style="color:var(--muted)">${s.desc}</p>
        <div class="meter">
          <div class="meter-label"><span>WARM ${warmPct}%</span><span>COOL ${100 - warmPct}%</span></div>
          <div class="meter-bar"><div style="width:${warmPct}%"></div></div>
        </div>
        <div class="meter">
          <div class="meter-label"><span>LIGHT ${lightPct}%</span><span>DEEP ${100 - lightPct}%</span></div>
          <div class="meter-bar"><div style="width:${lightPct}%"></div></div>
        </div>
      </div>
    </section>

    <section class="container info-grid">
      <article class="info-card">
        <p class="eyebrow">Personal Color</p>
        <h3>${s.ko} 컬러 가이드</h3>
        <div class="palette-row">
          ${s.palette.map(c => `<div class="sw"><i style="background:${c.hex}"></i>${c.name}</div>`).join('')}
        </div>
        <ul>
          <li><b>BEST</b>${s.best}</li>
          <li><b>AVOID</b>${s.avoid}</li>
          <li><b>HAIR COLOR</b>${s.hair}</li>
        </ul>
      </article>

      <article class="info-card">
        <p class="eyebrow">Face Analysis</p>
        <h3>${face.name} · ${EYE_TIPS[r.eye].name}</h3>
        <ul>
          <li><b>얼굴형</b>${face.tip}</li>
          <li><b>${RATIO_TIPS[r.ratio].name}</b>${RATIO_TIPS[r.ratio].tip}</li>
          <li><b>눈매</b>${EYE_TIPS[r.eye].tip}</li>
          <li><b>인상 (${IMPRESSIONS[r.impression].name})</b>${IMPRESSIONS[r.impression].tip}</li>
        </ul>
      </article>

      <article class="info-card">
        <p class="eyebrow">Style Guide</p>
        <h3>${s.ko}의 ${st.name} 메이크업</h3>
        <ul>
          <li><b>BASE</b>${st.base}</li>
          <li><b>EYE</b>${st.eye}</li>
          <li><b>CHEEK</b>${st.cheek}</li>
          <li><b>LIP</b>${st.lip} — 추천 컬러: <strong>${st.lipBySeason[r.season]}</strong></li>
        </ul>
      </article>
    </section>

    <div class="result-actions">
      <a href="recommend.html" class="btn">추천 제품 보러가기 <span class="arrow">→</span></a>
      <a href="test.html" class="btn-restart">
        <span class="icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>
        </span>
        처음부터 다시 하기
      </a>
    </div>`;
}

/* ---------- 추천 ---------- */
function initRecommend() {
  const r = load(STORAGE.result, null);
  let tone = r ? r.season : 'spring';
  let cat = 'all';
  let styleSel = r ? r.style : 'pure';
  const $ = id => document.getElementById(id);

  $('notice').textContent = r
    ? `진단 결과(${SEASONS[r.season].ko} · ${STYLES[r.style].name})를 기준으로 추천해 드려요.`
    : '아직 진단 전이에요. 톤을 직접 선택하거나 진단을 먼저 받아 보세요.';

  function renderProducts() {
    $('tone-tabs').innerHTML = Object.entries(SEASONS).map(([key, s]) =>
      `<button class="tab ${key === tone ? 'on' : ''}" data-tone="${key}">${s.ko}${r && r.season === key ? ' ★' : ''}</button>`).join('');
    $('cat-chips').innerHTML = Object.entries(CATEGORIES).map(([key, label]) =>
      `<button class="chip ${key === cat ? 'on' : ''}" data-cat="${key}">${label}</button>`).join('');

    const list = PRODUCTS
      .filter(p => p.tones.includes(tone) && (cat === 'all' || p.cat === cat))
      // 추구미가 맞는 제품을 앞으로 정렬
      .sort((a, b) => r ? b.styles.includes(r.style) - a.styles.includes(r.style) : 0);

    $('product-list').innerHTML = list.length
      ? list.map(p => productCard(p, r && r.style)).join('')
      : '<p class="notice" style="grid-column:1/-1">해당 카테고리 제품이 없어요.</p>';

    $('tone-tabs').querySelectorAll('.tab').forEach(b =>
      b.addEventListener('click', () => { tone = b.dataset.tone; renderProducts(); renderTips(styleSel); }));
    $('cat-chips').querySelectorAll('.chip').forEach(b =>
      b.addEventListener('click', () => { cat = b.dataset.cat; renderProducts(); }));
  }

  function renderTips(selected) {
    styleSel = selected;
    $('tip-list').innerHTML = Object.entries(STYLES).map(([key, st]) => `
      <article class="tip-card ${r && r.style === key ? 'mine' : ''}" data-style="${key}">
        <p class="eyebrow">${st.en}${r && r.style === key ? ' · MY STYLE' : ''}</p>
        <h3>${st.name}</h3>
        <p>${st.summary}</p>
      </article>`).join('');

    $('tip-list').querySelectorAll('.tip-card').forEach(c =>
      c.addEventListener('click', () => renderTips(c.dataset.style)));

    const st = STYLES[selected];
    const detail = $('tip-detail');
    detail.classList.add('open');
    detail.innerHTML = `
      <h3>${SEASONS[tone].ko} × ${st.name} 메이크업 가이드</h3>
      <div class="tip-steps">
        <div><b>01</b><span>BASE</span><p>${st.base}</p></div>
        <div><b>02</b><span>EYE</span><p>${st.eye}</p></div>
        <div><b>03</b><span>CHEEK</span><p>${st.cheek}</p></div>
        <div><b>04</b><span>LIP</span><p>${st.lip}<br><strong>추천 컬러: ${st.lipBySeason[tone]}</strong></p></div>
      </div>`;
  }

  renderProducts();
  renderTips(styleSel);
}

/* ---------- 실행 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  const page = document.body.dataset.page;
  const init = {
    home: initHome,
    login: () => initAuth('login'),
    signup: () => initAuth('signup'),
    test: initTest,
    analysis: initAnalysis,
    result: initResult,
    recommend: initRecommend,
  }[page];
  if (init) init();
});
