/* IAIDO.SEC — додзё инструментов. Всё честно: логика, без театра. */
(function(){
  'use strict';

  var enc = new TextEncoder();
  var dec = new TextDecoder();

  function bytesToHex(buf){
    var b = new Uint8Array(buf), s = '';
    for (var i=0;i<b.length;i++) s += b[i].toString(16).padStart(2,'0');
    return s;
  }
  function bytesToBase64(bytes){
    var bin = '';
    for (var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function base64ToBytes(b64){
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  async function sha(algo, data){
    var buf = typeof data === 'string' ? enc.encode(data) : data;
    var digest = await crypto.subtle.digest(algo, buf);
    return bytesToHex(digest);
  }

  /* =====================================================
     1. Генератор паролей — crypto.getRandomValues, rejection sampling
     ===================================================== */
  (function passwordGenerator(){
    var lenInput = document.getElementById('genLen');
    var lenVal = document.getElementById('genLenVal');
    var btn = document.getElementById('genBtn');
    var out = document.getElementById('genOutput');
    var entropyEl = document.getElementById('genEntropy');
    if (!btn) return;

    var SETS = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      digits: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{}<>?/.,:;'
    };
    var AMBIGUOUS = /[l1IO0]/;

    lenInput.addEventListener('input', function(){ lenVal.textContent = lenInput.value; });

    function secureRandomIndex(max){
      // rejection sampling to avoid modulo bias
      var range = 256 - (256 % max);
      var arr = new Uint8Array(1);
      do { crypto.getRandomValues(arr); } while (arr[0] >= range);
      return arr[0] % max;
    }

    btn.addEventListener('click', function(){
      var pool = '';
      if (document.getElementById('genLower').checked) pool += SETS.lower;
      if (document.getElementById('genUpper').checked) pool += SETS.upper;
      if (document.getElementById('genDigits').checked) pool += SETS.digits;
      if (document.getElementById('genSymbols').checked) pool += SETS.symbols;
      if (document.getElementById('genAmbiguous').checked) pool = pool.split('').filter(function(c){ return !AMBIGUOUS.test(c); }).join('');

      if (!pool){ out.textContent = 'выберите хотя бы один набор символов'; return; }

      var length = parseInt(lenInput.value, 10);
      var chars = [];
      for (var i=0;i<length;i++) chars.push(pool[secureRandomIndex(pool.length)]);
      var pass = chars.join('');
      out.textContent = pass;

      var bits = Math.log2(pool.length) * length;
      entropyEl.textContent = 'Энтропия: ' + bits.toFixed(1) + ' бит из алфавита ' + pool.length + ' символов — при 10¹⁰ попыток/сек подбор займёт ~' + crackTimeHuman(bits, 1e10) + '.';
    });
  })();

  /* =====================================================
     2. Анализ прочности пароля
     ===================================================== */
  var COMMON_PASSWORDS = ['123456','123456789','qwerty','password','12345','12345678','111111','1234567','sunshine','qwerty123',
    '1q2w3e','000000','iloveyou','abc123','letmein','monkey','dragon','football','baseball','welcome',
    'admin','login','passw0rd','master','hello','freedom','whatever','trustno1','password1','starwars',
    'qazwsx','qwertyuiop','zaq12wsx','123123','654321','666666','7777777','1qaz2wsx','1234','12345',
    'россия','пароль','привет','любовь','123321','qweasd','йцукен','ytrewq','qwerty1','superman'];

  function crackTimeHuman(bits, guessesPerSecond){
    var seconds = Math.pow(2, bits) / guessesPerSecond / 2; // average case
    if (seconds < 1) return 'мгновенно';
    var units = [
      ['век', 3153600000], ['год', 31536000], ['день', 86400], ['час', 3600], ['минуту', 60], ['секунду', 1]
    ];
    for (var i=0;i<units.length;i++){
      if (seconds >= units[i][1] || i === units.length-1){
        var val = seconds / units[i][1];
        if (val > 1e6) return '>' + val.toExponential(1) + ' ' + units[i][0];
        return Math.round(val).toLocaleString('ru-RU') + ' ' + units[i][0];
      }
    }
  }

  (function strengthAnalyzer(){
    var input = document.getElementById('strengthInput');
    var toggle = document.getElementById('strengthToggle');
    var fill = document.getElementById('meterFill');
    var verdict = document.getElementById('strengthVerdict');
    var table = document.getElementById('crackTable');
    if (!input) return;

    toggle.addEventListener('click', function(){
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    input.addEventListener('input', function(){
      var pw = input.value;
      if (!pw){
        fill.style.width = '0%'; fill.style.background = 'var(--red)';
        verdict.textContent = '—'; table.innerHTML = '';
        return;
      }

      var poolSize = 0;
      if (/[a-z]/.test(pw)) poolSize += 26;
      if (/[A-Z]/.test(pw)) poolSize += 26;
      if (/[0-9]/.test(pw)) poolSize += 10;
      if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 33;
      if (poolSize === 0) poolSize = 1;

      var bits = pw.length * Math.log2(poolSize);

      var penalty = 0;
      var notes = [];
      if (COMMON_PASSWORDS.indexOf(pw.toLowerCase()) !== -1){
        penalty += 60; notes.push('входит в список самых распространённых утечек — не используйте');
      }
      if (/(.)\1{2,}/.test(pw)){ penalty += 12; notes.push('повторяющиеся символы подряд'); }
      if (/0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv|йцук|фыва/i.test(pw)){
        penalty += 18; notes.push('последовательность/клавиатурный шаблон');
      }
      if (/^\d+$/.test(pw)){ penalty += 10; notes.push('только цифры'); }

      var effectiveBits = Math.max(0, bits - penalty);

      var pct = Math.min(100, (effectiveBits / 80) * 100);
      fill.style.width = pct + '%';
      var color = effectiveBits < 28 ? 'var(--red)' : effectiveBits < 45 ? '#c98a2a' : effectiveBits < 65 ? '#c9b93a' : '#5aa05a';
      fill.style.background = color;

      var label = effectiveBits < 28 ? 'очень слабый' : effectiveBits < 45 ? 'слабый' : effectiveBits < 65 ? 'средний' : effectiveBits < 90 ? 'сильный' : 'клинок высшей закалки';
      verdict.innerHTML = '<b>' + effectiveBits.toFixed(0) + ' бит энтропии</b> — ' + label + (notes.length ? '. ' + notes.join('; ') + '.' : '.');

      var scenarios = [
        ['офлайн, быстрый хеш (MD5/SHA1), 10¹⁰/с', 1e10],
        ['онлайн-перебор с лимитом, 100/с', 100],
        ['офлайн, bcrypt/Argon2, 10⁴/с', 1e4]
      ];
      table.innerHTML = scenarios.map(function(s){
        return '<li><span>' + s[0] + '</span><b>' + crackTimeHuman(effectiveBits, s[1]) + '</b></li>';
      }).join('');
    });
  })();

  /* =====================================================
     3. Hash Forge
     ===================================================== */
  (function hashForge(){
    var textEl = document.getElementById('hashText');
    var results = document.getElementById('hashResults');
    var fileInput = document.getElementById('hashFile');
    var fileDrop = document.getElementById('fileDrop');
    var fileLabel = document.getElementById('fileDropLabel');
    var compareInput = document.getElementById('hashCompare');
    var compareResult = document.getElementById('hashCompareResult');
    if (!textEl) return;

    var lastHashes = {};

    function render(hashes){
      lastHashes = hashes;
      results.innerHTML = Object.keys(hashes).map(function(algo){
        return '<div class="hash-row"><span class="hlabel">' + algo + '</span><span class="hval">' + hashes[algo] + '</span></div>';
      }).join('');
      checkCompare();
    }

    async function hashAll(data){
      var out = {};
      for (var algo of ['SHA-1','SHA-256','SHA-384','SHA-512']){
        out[algo] = await sha(algo, data);
      }
      return out;
    }

    var debounceTimer;
    textEl.addEventListener('input', function(){
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async function(){
        if (!textEl.value){ results.innerHTML = ''; lastHashes = {}; checkCompare(); return; }
        render(await hashAll(textEl.value));
      }, 150);
    });

    function handleFile(file){
      if (!file) return;
      fileLabel.textContent = 'вычисление контрольной суммы: ' + file.name + ' …';
      var reader = new FileReader();
      reader.onload = async function(e){
        var buf = e.target.result;
        fileLabel.textContent = file.name + ' (' + (file.size/1024).toFixed(1) + ' КБ)';
        render(await hashAll(buf));
      };
      reader.readAsArrayBuffer(file);
    }
    fileInput.addEventListener('change', function(){ handleFile(fileInput.files[0]); });
    ['dragover','dragenter'].forEach(function(ev){
      fileDrop.addEventListener(ev, function(e){ e.preventDefault(); fileDrop.classList.add('is-drag'); });
    });
    ['dragleave','drop'].forEach(function(ev){
      fileDrop.addEventListener(ev, function(e){ fileDrop.classList.remove('is-drag'); });
    });
    fileDrop.addEventListener('drop', function(e){
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    function checkCompare(){
      var val = compareInput.value.trim().toLowerCase().replace(/\s+/g,'');
      if (!val){ compareResult.textContent = ''; compareResult.className = 'badge'; return; }
      var match = Object.values(lastHashes).some(function(h){ return h.toLowerCase() === val; });
      if (Object.keys(lastHashes).length === 0){ compareResult.textContent = 'нет хеша для сравнения'; compareResult.className = 'badge'; return; }
      compareResult.textContent = match ? 'СОВПАДАЕТ ✓' : 'НЕ СОВПАДАЕТ ✕';
      compareResult.className = 'badge ' + (match ? 'ok' : 'bad');
    }
    compareInput.addEventListener('input', checkCompare);
  })();

  /* =====================================================
     4. Проверка утечек (HIBP k-anonymity)
     ===================================================== */
  (function pwnedCheck(){
    var input = document.getElementById('pwnedInput');
    var btn = document.getElementById('pwnedBtn');
    var result = document.getElementById('pwnedResult');
    if (!btn) return;

    btn.addEventListener('click', async function(){
      var pw = input.value;
      if (!pw){ result.textContent = 'введите пароль'; return; }
      result.textContent = 'считаем SHA-1 локально и запрашиваем диапазон…';
      try {
        var hashHex = (await sha('SHA-1', pw)).toUpperCase();
        var prefix = hashHex.slice(0,5), suffix = hashHex.slice(5);
        var res = await fetch('https://api.pwnedpasswords.com/range/' + prefix, { headers: { 'Add-Padding': 'true' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var text = await res.text();
        var lines = text.split('\n');
        var found = null;
        for (var i=0;i<lines.length;i++){
          var parts = lines[i].trim().split(':');
          if (parts[0] === suffix){ found = parseInt(parts[1],10); break; }
        }
        if (found){
          result.innerHTML = '<span class="badge bad">НАЙДЕН В УТЕЧКАХ</span> — встречается ' + found.toLocaleString('ru-RU') + ' раз(а) в известных базах. Смените пароль.';
        } else {
          result.innerHTML = '<span class="badge ok">не найден</span> в базе Have I Been Pwned. Это хороший знак, но не абсолютная гарантия — используйте менеджер паролей и уникальные пароли.';
        }
      } catch(err){
        result.textContent = 'не удалось связаться с сервисом проверки (' + err.message + '). Проверьте соединение и попробуйте снова.';
      }
    });
  })();

  /* =====================================================
     5. Cipher Dojo: Caesar / Vigenère / XOR / AES-256-GCM
     ===================================================== */
  (function cipherDojo(){
    var textEl = document.getElementById('cipherText');
    var keyEl = document.getElementById('cipherKey');
    var keyLabel = document.getElementById('cipherKeyLabel');
    var outEl = document.getElementById('cipherOutput');
    var metaEl = document.getElementById('cipherMeta');
    var encBtn = document.getElementById('cipherEncrypt');
    var decBtn = document.getElementById('cipherDecrypt');
    if (!textEl) return;

    var mode = 'caesar';
    var LABELS = { caesar: 'Сдвиг (число)', vigenere: 'Ключевое слово', xor: 'Ключ (текст)', aes: 'Пароль-фраза' };
    var PLACEHOLDER = { caesar: '3', vigenere: 'katana', xor: 'секретный ключ', aes: 'длинная пароль-фраза' };

    window.IAIDO_setupInlineTabs('cipherTabs', 'data-cipher', function(val){
      mode = val;
      keyLabel.textContent = LABELS[mode];
      keyEl.placeholder = PLACEHOLDER[mode];
      metaEl.textContent = mode === 'aes'
        ? 'PBKDF2-SHA256 (250 000 итераций) → AES-256-GCM. Формат результата: base64(salt · iv · шифротекст).'
        : 'Учебный шифр — не используйте для защиты реальных данных.';
    });
    metaEl.textContent = 'Учебный шифр — не используйте для защиты реальных данных.';

    function shiftAlphabet(str, shift, alphabet){
      var A = alphabet, n = A.length;
      var map = {};
      for (var i=0;i<n;i++) map[A[i]] = A[(((i+shift)%n)+n)%n];
      return str.split('').map(function(ch){
        var lower = ch.toLowerCase();
        var isUpper = ch !== lower;
        var target = map[lower];
        if (target === undefined) return ch;
        return isUpper ? target.toUpperCase() : target;
      }).join('');
    }
    var LAT = 'abcdefghijklmnopqrstuvwxyz';
    var CYR = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';

    function caesar(str, shift){
      var out = shiftAlphabet(str, shift, LAT);
      out = shiftAlphabet(out, shift, CYR);
      return out;
    }

    function vigenere(str, key, decrypt){
      key = key.toLowerCase().replace(/[^a-zа-яё]/gi, '');
      if (!key) return str;
      var ki = 0, out = '';
      for (var i=0;i<str.length;i++){
        var ch = str[i], lower = ch.toLowerCase();
        var alphabet = LAT.indexOf(lower) !== -1 ? LAT : (CYR.indexOf(lower) !== -1 ? CYR : null);
        if (!alphabet){ out += ch; continue; }
        var kch = key[ki % key.length];
        var kAlphabet = LAT.indexOf(kch) !== -1 ? LAT : CYR;
        var shift = kAlphabet.indexOf(kch);
        var idx = alphabet.indexOf(lower);
        var newIdx = ((idx + (decrypt ? -shift : shift)) % alphabet.length + alphabet.length) % alphabet.length;
        var res = alphabet[newIdx];
        out += (ch !== lower) ? res.toUpperCase() : res;
        ki++;
      }
      return out;
    }

    function xorEncode(str, key){
      var data = enc.encode(str), keyBytes = enc.encode(key || '');
      if (!keyBytes.length) return '';
      var outBytes = new Uint8Array(data.length);
      for (var i=0;i<data.length;i++) outBytes[i] = data[i] ^ keyBytes[i % keyBytes.length];
      return bytesToHex(outBytes);
    }
    function xorDecode(hex, key){
      var keyBytes = enc.encode(key || '');
      if (!keyBytes.length || !/^[0-9a-f]*$/i.test(hex) || hex.length % 2) return '(некорректный hex или пустой ключ)';
      var bytes = new Uint8Array(hex.length/2);
      for (var i=0;i<bytes.length;i++) bytes[i] = parseInt(hex.substr(i*2,2),16);
      var outBytes = new Uint8Array(bytes.length);
      for (var i2=0;i2<bytes.length;i2++) outBytes[i2] = bytes[i2] ^ keyBytes[i2 % keyBytes.length];
      return dec.decode(outBytes);
    }

    async function aesDeriveKey(pass, salt){
      var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 250000, hash: 'SHA-256' },
        keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt','decrypt']
      );
    }
    async function aesEncrypt(plaintext, pass){
      var salt = crypto.getRandomValues(new Uint8Array(16));
      var iv = crypto.getRandomValues(new Uint8Array(12));
      var key = await aesDeriveKey(pass, salt);
      var ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv: iv }, key, enc.encode(plaintext));
      var combined = new Uint8Array(salt.length + iv.length + ct.byteLength);
      combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(ct), salt.length + iv.length);
      return bytesToBase64(combined);
    }
    async function aesDecrypt(b64, pass){
      var combined = base64ToBytes(b64);
      var salt = combined.slice(0,16), iv = combined.slice(16,28), ct = combined.slice(28);
      var key = await aesDeriveKey(pass, salt);
      var pt = await crypto.subtle.decrypt({ name:'AES-GCM', iv: iv }, key, ct);
      return dec.decode(pt);
    }

    encBtn.addEventListener('click', async function(){
      var text = textEl.value, key = keyEl.value;
      try {
        if (mode === 'caesar') outEl.value = caesar(text, parseInt(key || '0', 10));
        else if (mode === 'vigenere') outEl.value = vigenere(text, key, false);
        else if (mode === 'xor') outEl.value = xorEncode(text, key);
        else if (mode === 'aes'){
          if (!key){ outEl.value = ''; metaEl.textContent = 'введите пароль-фразу'; return; }
          outEl.value = await aesEncrypt(text, key);
        }
      } catch(e){ outEl.value = 'ошибка: ' + e.message; }
    });
    decBtn.addEventListener('click', async function(){
      var text = textEl.value, key = keyEl.value;
      try {
        if (mode === 'caesar') outEl.value = caesar(text, -parseInt(key || '0', 10));
        else if (mode === 'vigenere') outEl.value = vigenere(text, key, true);
        else if (mode === 'xor') outEl.value = xorDecode(text.trim(), key);
        else if (mode === 'aes'){
          if (!key){ outEl.value = ''; metaEl.textContent = 'введите пароль-фразу'; return; }
          outEl.value = await aesDecrypt(text.trim(), key);
        }
      } catch(e){ outEl.value = 'ошибка расшифровки: неверный ключ или повреждённые данные'; }
    });
  })();

  /* =====================================================
     6. Конвертер Base64 / Hex / URL
     ===================================================== */
  (function converter(){
    var input = document.getElementById('convertInput');
    var output = document.getElementById('convertOutput');
    var encodeBtn = document.getElementById('convertEncode');
    var decodeBtn = document.getElementById('convertDecode');
    if (!input) return;
    var mode = 'base64';

    window.IAIDO_setupInlineTabs('convertTabs', 'data-convert', function(v){ mode = v; });

    encodeBtn.addEventListener('click', function(){
      try {
        var v = input.value;
        if (mode === 'base64') output.value = bytesToBase64(enc.encode(v));
        else if (mode === 'hex') output.value = bytesToHex(enc.encode(v));
        else if (mode === 'url') output.value = encodeURIComponent(v);
      } catch(e){ output.value = 'ошибка: ' + e.message; }
    });
    decodeBtn.addEventListener('click', function(){
      try {
        var v = input.value.trim();
        if (mode === 'base64') output.value = dec.decode(base64ToBytes(v));
        else if (mode === 'hex') {
          var bytes = new Uint8Array(v.length/2);
          for (var i=0;i<bytes.length;i++) bytes[i] = parseInt(v.substr(i*2,2),16);
          output.value = dec.decode(bytes);
        }
        else if (mode === 'url') output.value = decodeURIComponent(v);
      } catch(e){ output.value = 'ошибка: некорректные входные данные для выбранного формата'; }
    });
  })();

  /* =====================================================
     7. JWT Инспектор
     ===================================================== */
  (function jwtInspector(){
    var input = document.getElementById('jwtInput');
    var grid = document.getElementById('jwtGrid');
    var headerEl = document.getElementById('jwtHeader');
    var payloadEl = document.getElementById('jwtPayload');
    var meta = document.getElementById('jwtMeta');
    if (!input) return;

    function b64urlDecode(str){
      str = str.replace(/-/g,'+').replace(/_/g,'/');
      while (str.length % 4) str += '=';
      return dec.decode(base64ToBytes(str));
    }

    input.addEventListener('input', function(){
      var token = input.value.trim();
      if (!token){ grid.hidden = true; meta.textContent = ''; return; }
      var parts = token.split('.');
      if (parts.length < 2){ grid.hidden = true; meta.textContent = 'это не похоже на JWT (нужно 3 части через точку)'; return; }
      try {
        var header = JSON.parse(b64urlDecode(parts[0]));
        var payload = JSON.parse(b64urlDecode(parts[1]));
        headerEl.textContent = JSON.stringify(header, null, 2);
        payloadEl.textContent = JSON.stringify(payload, null, 2);
        grid.hidden = false;

        var notes = ['Подпись не проверялась.'];
        if (header.alg === 'none') notes.push('⚠ alg=none — токен без подписи вообще.');
        var now = Math.floor(Date.now()/1000);
        if (payload.exp){
          notes.push(payload.exp < now ? 'истёк ' + new Date(payload.exp*1000).toLocaleString('ru-RU') : 'действителен до ' + new Date(payload.exp*1000).toLocaleString('ru-RU'));
        }
        if (payload.nbf && payload.nbf > now) notes.push('ещё не активен (nbf в будущем)');
        meta.textContent = notes.join(' ');
      } catch(e){
        grid.hidden = true;
        meta.textContent = 'не удалось разобрать токен: ' + e.message;
      }
    });
  })();

  /* =====================================================
     8. Разведка (recon self)
     ===================================================== */
  (function recon(){
    var btn = document.getElementById('reconBtn');
    var list = document.getElementById('reconList');
    if (!btn) return;

    // Строим DOM через textContent, а не innerHTML со строковой конкатенацией —
    // navigator.userAgent и особенно ответ внешнего API (ip) НЕ доверенные данные,
    // и не должны попадать в разметку без экранирования.
    function row(label, value){
      var wrap = document.createElement('div');
      wrap.className = 'recon-row';
      var dt = document.createElement('dt');
      dt.textContent = label;
      var dd = document.createElement('dd');
      dd.textContent = (value === undefined || value === null || value === '') ? '—' : value;
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      return wrap;
    }

    btn.addEventListener('click', async function(){
      btn.disabled = true; btn.textContent = 'сканирование…';
      var rows = [];
      rows.push(row('User-Agent', navigator.userAgent));
      rows.push(row('Платформа', navigator.platform || '—'));
      rows.push(row('Язык(и)', (navigator.languages || [navigator.language]).join(', ')));
      rows.push(row('Экран', screen.width + '×' + screen.height + ' @' + (window.devicePixelRatio||1) + 'x, ' + screen.colorDepth + '-бит'));
      rows.push(row('Часовой пояс', Intl.DateTimeFormat().resolvedOptions().timeZone));
      rows.push(row('Cookies включены', navigator.cookieEnabled ? 'да' : 'нет'));
      rows.push(row('Do Not Track', navigator.doNotTrack || 'не задан'));
      rows.push(row('Ядер CPU (заявлено)', navigator.hardwareConcurrency || '—'));
      if (navigator.deviceMemory) rows.push(row('Память устройства (заявлено)', navigator.deviceMemory + ' ГБ'));
      if (navigator.connection) rows.push(row('Тип соединения', navigator.connection.effectiveType || '—'));

      var ipRow;
      try {
        var res = await fetch('https://api.ipify.org?format=json');
        var data = await res.json();
        var ip = typeof data.ip === 'string' ? data.ip : '—';
        ipRow = row('Публичный IP', ip);
      } catch(e){
        ipRow = row('Публичный IP', 'не удалось получить (нет сети или сервис недоступен)');
      }
      rows.unshift(ipRow);

      list.textContent = '';
      rows.forEach(function(r){ list.appendChild(r); });
      btn.disabled = false; btn.textContent = 'Обновить разведку';
    });
  })();

})();
