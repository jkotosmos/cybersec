/* IAIDO.SEC — рендер страницы отдельного инструмента арсенала */
(function(){
  'use strict';

  function el(tag, className, text){
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('t');
  var registry = window.IAIDO_TOOLS || {};
  // hasOwnProperty guards against slugs like "constructor"/"__proto__" resolving
  // to inherited Object.prototype members instead of a real (or missing) entry.
  var data = (slug && Object.prototype.hasOwnProperty.call(registry, slug)) ? registry[slug] : undefined;

  var content = document.getElementById('toolContent');
  var notFound = document.getElementById('toolNotFound');

  if (!data){
    notFound.hidden = false;
    document.title = 'Инструмент не найден — IAIDO.SEC';
  } else {
    document.title = data.name + ' — IAIDO.SEC';
    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', data.name + ': ' + data.tagline);

    document.getElementById('toolCategoryJp').textContent = data.categoryJp || '';
    document.getElementById('toolCategory').textContent = data.category || '';
    document.getElementById('toolName').textContent = data.name;
    document.getElementById('toolTagline').textContent = data.tagline;

    var officialLink = document.getElementById('toolOfficial');
    if (data.official){
      officialLink.href = data.official;
    } else {
      officialLink.remove();
    }

    document.getElementById('toolDescription').textContent = data.description;

    var legalEl = document.getElementById('toolLegal');
    if (data.legal){
      legalEl.textContent = '⚠ ' + data.legal;
    } else {
      legalEl.remove();
    }

    var usageBlock = document.getElementById('toolUsageBlock');
    var installEl = document.getElementById('toolInstall');
    var cmdList = document.getElementById('toolCommands');

    if (!data.install && (!data.commands || !data.commands.length)){
      usageBlock.remove();
    } else {
      if (data.install){
        installEl.innerHTML = 'Установка: <code>' + data.install.replace(/</g,'&lt;') + '</code>';
      } else {
        installEl.remove();
      }

      if (data.commands && data.commands.length){
        data.commands.forEach(function(c){
          var li = el('li', 'cmd-item');
          var code = el('code', 'cmd-code', c.cmd);
          var note = el('p', 'cmd-note', c.note);
          li.appendChild(code);
          li.appendChild(note);
          cmdList.appendChild(li);
        });
      } else {
        cmdList.remove();
      }
    }

    function renderLinks(listEl, items){
      if (!items || !items.length){ listEl.closest('div').remove(); return; }
      items.forEach(function(r){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = r.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = r.label;
        li.appendChild(a);
        if (r.note){
          var p = el('p', null, r.note);
          li.appendChild(p);
        }
        listEl.appendChild(li);
      });
    }
    renderLinks(document.getElementById('toolResources'), data.resources);
    renderLinks(document.getElementById('toolReports'), data.reports);

    content.hidden = false;
  }
})();
