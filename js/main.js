/* IAIDO.SEC — навигация, скролл-анимация клинка, вспомогательный UI */
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
    '.virtue, .arsenal-cat, .seal-card, .waza-panels, .oath-inner, .section-head'
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

  /* ---------- scroll-linked katana draw ---------- */
  var stage = document.getElementById('draw');
  var sticky = stage ? stage.querySelector('.draw-sticky') : null;
  var sword = document.getElementById('bladeGroup');
  var saya = document.getElementById('sayaGroup');
  var caps = document.querySelectorAll('.draw-cap');

  if (stage && sticky){
    if (reduceMotion){
      stage.style.height = '100svh';
      saya && saya.style.setProperty('transform', 'translateY(700px)');
      sticky.classList.add('is-complete');
    } else {
      var ticking = false;

      var updateDraw = function(){
        ticking = false;
        var rect = stage.getBoundingClientRect();
        var total = stage.offsetHeight - window.innerHeight;
        var progress = total > 0 ? (-rect.top) / total : 0;
        progress = Math.min(1, Math.max(0, progress));

        var eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        if (saya) saya.style.transform = 'translateY(' + (eased * 700).toFixed(1) + 'px)';

        sticky.classList.toggle('is-complete', progress > 0.94);

        var ranges = [[0.04, 0.29], [0.37, 0.62], [0.70, 1.01]];
        caps.forEach(function(cap){
          var stepIndex = parseInt(cap.getAttribute('data-cap'), 10);
          var r = ranges[stepIndex - 1];
          cap.classList.toggle('is-visible', progress >= r[0] && progress < r[1]);
        });
      };

      var onScroll = function(){
        if (!ticking){ requestAnimationFrame(updateDraw); ticking = true; }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      updateDraw();
    }
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
