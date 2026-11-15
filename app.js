(() => {
  'use strict';

  const WORKS = window.WLR_WORKS || [];
  const SETTINGS = window.WLR_SETTINGS || {};
  const params = new URLSearchParams(location.search);
  const MODE = params.get('mode') || SETTINGS.openMode || 'frame';
  const KIOSK = params.has('kiosk');

  const list = document.getElementById('works');
  const enterBtn = document.getElementById('enter');
  const viewer = document.getElementById('viewer');
  const veil = document.getElementById('viewerVeil');
  const viewerName = document.getElementById('viewerName');
  const viewerSub = document.getElementById('viewerSub');
  const backBtn = document.getElementById('back');

  const touchOnly = window.matchMedia('(hover: none)').matches;

  /* ───────── Render ───────── */

  const items = WORKS.map((w) => {
    const li = document.createElement('li');
    li.className = 'work';
    li.innerHTML = `
      <a class="work-link" href="${w.url}" data-id="${w.id}" aria-label="${w.name} — ${w.subtitle}">
        <div class="stage">
          <div class="object">
            <img alt="${w.name} 오브제"
                 src="/assets/works/${w.image}-1400.webp"
                 srcset="/assets/works/${w.image}-720.webp 720w, /assets/works/${w.image}-1400.webp 1400w"
                 sizes="(max-width: 820px) 36vw, 30vw"
                 decoding="async" draggable="false" />
          </div>
        </div>
        <div class="caption">
          <p class="work-name">${w.name}</p>
          <p class="work-sub">${w.subtitle}</p>
          <p class="work-line">${w.line}</p>
        </div>
      </a>`;
    list.appendChild(li);
    const link = li.querySelector('.work-link');
    const stage = li.querySelector('.stage');
    const obj = li.querySelector('.object');
    const img = li.querySelector('img');
    return { work: w, li, link, stage, obj, img, ratio: 0 };
  });

  /* ───────── Visual presence ─────────
   * 이미지 가로폭을 맞추지 않고, 화면에 보이는 '면적'이 비슷해지도록 크기를 정합니다.
   * 세로로 긴 오브제는 높이 한계에 먼저 닿으므로 면적 목표를 조금 더 크게 줍니다.
   */
  const AREA = 0.37;     // 무대 면적 대비 기본 점유율
  const MAX_W = 0.92;
  const MAX_H = 0.97;

  function layout() {
    items.forEach((it) => {
      if (!it.ratio) return;
      const sw = it.stage.clientWidth;
      const sh = it.stage.clientHeight;
      if (!sw || !sh) return;
      const p = it.work.presence || 1;
      const area = AREA * sw * sh * p * p;
      let w = Math.sqrt(area * it.ratio);
      let h = w / it.ratio;
      const k = Math.min(1, (sw * MAX_W) / w, (sh * MAX_H) / h);
      w *= k; h *= k;
      it.obj.style.width = `${Math.round(w)}px`;
      it.obj.style.height = `${Math.round(h)}px`;
    });
  }

  let loaded = 0;
  items.forEach((it) => {
    const done = () => {
      it.ratio = it.img.naturalWidth / it.img.naturalHeight || 1;
      layout();
      if (++loaded === items.length) reveal();
    };
    if (it.img.complete && it.img.naturalWidth) done();
    else {
      it.img.addEventListener('load', done, { once: true });
      it.img.addEventListener('error', () => { it.ratio = 1; if (++loaded === items.length) reveal(); }, { once: true });
    }
  });

  let revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    document.documentElement.classList.add('is-ready');
  }

  // Safari 뒤로가기(페이지 캐시) 복원 시에도 갤러리가 보이도록
  window.addEventListener('pageshow', (e) => {
    document.documentElement.classList.add('is-ready');
    if (e.persisted && current) close(true);
  });
  setTimeout(reveal, 2500); // 느린 네트워크에서도 화면은 나타나도록

  let rT;
  window.addEventListener('resize', () => { cancelAnimationFrame(rT); rT = requestAnimationFrame(layout); });
  if ('ResizeObserver' in window) new ResizeObserver(() => layout()).observe(list);

  /* ───────── Hover / focus ───────── */

  function setFocus(it) {
    items.forEach((o) => o.link.classList.toggle('is-focus', o === it));
    list.classList.toggle('has-focus', !!it);
  }

  if (!touchOnly) {
    items.forEach((it) => {
      it.link.addEventListener('pointerenter', () => setFocus(it));
      it.link.addEventListener('pointerleave', () => {
        setFocus(null);
        it.obj.style.setProperty('--px', '0px');
        it.obj.style.setProperty('--py', '0px');
      });
      // 아주 작은 시차 — 커서를 따라 몇 픽셀만 움직임
      it.link.addEventListener('pointermove', (e) => {
        const r = it.stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        it.obj.style.setProperty('--px', `${(nx * 6).toFixed(2)}px`);
        it.obj.style.setProperty('--py', `${(ny * 4).toFixed(2)}px`);
      });
    });
  }
  items.forEach((it) => {
    it.link.addEventListener('focus', () => setFocus(it));
    it.link.addEventListener('blur', () => setFocus(null));
  });

  /* ───────── Open a work ───────── */

  let frame = null;
  let current = null;

  items.forEach((it) => {
    it.link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // 새 탭 열기는 그대로
      e.preventDefault();
      open(it.work, true);
    });
  });

  function open(work, push) {
    if (MODE === 'link') {
      document.documentElement.classList.remove('is-ready');
      setTimeout(() => { location.href = work.url; }, 450);
      return;
    }
    current = work;
    viewerName.textContent = work.name;
    viewerSub.textContent = work.subtitle;
    veil.classList.remove('is-hidden');

    frame = document.createElement('iframe');
    frame.title = `${work.name} — ${work.subtitle}`;
    frame.allow = (work.allow || SETTINGS.permissions || '').split(';')
      .map((s) => s.trim()).filter(Boolean).map((p) => `${p} *`).join('; ');
    // 작품 자체의 전체화면 버튼은 막음 — 작품만 전체화면이 되면 BACK TO GALLERY가 가려지기 때문.
    // 전체화면은 갤러리(ENTER EXHIBITION / 키오스크)가 담당하고, 작품을 오가도 유지됨.
    frame.addEventListener('load', () => {
      setTimeout(() => {
        frame && frame.classList.add('is-loaded');
        veil.classList.add('is-hidden');
        try { frame && frame.focus(); } catch (_) {}
      }, 350);
    }, { once: true });
    const f0 = frame;
    setTimeout(() => { if (frame === f0) { f0.classList.add('is-loaded'); veil.classList.add('is-hidden'); } }, 9000);
    frame.src = work.url;
    viewer.insertBefore(frame, veil);

    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    setFocus(null);
    if (push) history.pushState({ work: work.id }, '', `#${work.id}`);
  }

  function close(fromPop) {
    if (!current) return;
    current = null;
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    const f = frame; frame = null;
    // 작품(마이크·사운드 등)을 완전히 종료
    setTimeout(() => { if (f) { f.src = 'about:blank'; f.remove(); } }, 720);
    if (!fromPop && location.hash) history.back();
  }

  backBtn.addEventListener('click', () => close(false));
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    const w = WORKS.find((x) => x.id === id);
    if (w && !current) open(w, false);
    else if (!w) close(true);
  });

  // 주소에 #eros 처럼 작품이 지정되어 있으면 갤러리로 정리
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);

  // 작품 사이트가 갤러리 복귀를 요청할 수 있도록 (선택 사항)
  window.addEventListener('message', (e) => {
    if (e.data === 'wlr:back-to-gallery' || (e.data && e.data.type === 'wlr:back-to-gallery')) close(false);
  });

  /* ───────── Fullscreen ───────── */

  const fsSupported = document.fullscreenEnabled || document.webkitFullscreenEnabled;

  function isFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    // 크롬 전체화면(⌃⌘F)·키오스크 모드도 감지
    return Math.abs(window.innerHeight - screen.height) < 2 && Math.abs(window.innerWidth - screen.width) < 2;
  }

  function syncEnter() {
    enterBtn.hidden = KIOSK || !fsSupported || touchOnly || isFullscreen();
  }

  enterBtn.addEventListener('click', () => {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(el, { navigationUI: 'hide' })).catch(() => {});
  });

  document.addEventListener('fullscreenchange', syncEnter);
  document.addEventListener('webkitfullscreenchange', syncEnter);
  window.addEventListener('resize', syncEnter);
  syncEnter();
})();
