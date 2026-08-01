/* IAIDO.SEC — навигация, скролл-эффекты, вспомогательный UI */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      var open = siteNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        siteNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop){
    toTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', function(){
      toTop.hidden = window.scrollY < 800;
      toTop.classList.toggle('is-visible', window.scrollY >= 800);
    }, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.virtue, .arsenal-cat, .waza-panels, .oath-inner, .section-head'
  );
  revealTargets.forEach(function(el){ el.classList.add('reveal'); });

  if ('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ---------- preview strip cards open matching tool tab ---------- */
  document.querySelectorAll('[data-open-tool]').forEach(function(card){
    card.addEventListener('click', function(){
      var btn = document.getElementById(card.getAttribute('data-open-tool'));
      if (btn) setTimeout(function(){ btn.click(); }, reduceMotion ? 0 : 400);
    });
  });

  /* ---------- waza (tool) tab switching ---------- */
  var wazaBtns = document.querySelectorAll('.waza-btn');
  var wazaPanels = document.querySelectorAll('.waza-panel');
  wazaBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      wazaBtns.forEach(function(b){ b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      wazaPanels.forEach(function(p){ p.hidden = true; p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      var target = document.getElementById(btn.getAttribute('data-target'));
      if (target){ target.hidden = false; target.classList.add('is-active'); }
    });
  });

  /* ---------- generic inline tab switcher (cipher / convert) ---------- */
  window.IAIDO_setupInlineTabs = function(containerId, attr, onChange){
    var container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.tab-inline').forEach(function(btn){
      btn.addEventListener('click', function(){
        container.querySelectorAll('.tab-inline').forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        onChange(btn.getAttribute(attr));
      });
    });
  };

  /* ---------- copy to clipboard ---------- */
  document.querySelectorAll('[data-copy-target]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var el = document.getElementById(btn.getAttribute('data-copy-target'));
      if (!el) return;
      var text = el.value !== undefined ? el.value : el.textContent;
      if (!text || /нажмите/i.test(text)) return;
      var done = function(){
        var old = btn.textContent;
        btn.textContent = 'Скопировано ✓';
        setTimeout(function(){ btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done)['catch'](function(){ fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });
  });

  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
  }

})();
