const fs = require('fs');
const { execSync } = require('child_process');

// Read current HTML (everything before <script>)
const html = fs.readFileSync('index.html', 'utf8');
const htmlBeforeScript = html.substring(0, html.indexOf('<script>'));
const htmlAfterScript = html.substring(html.indexOf('</script>') + '</script>'.length);

// Clean JavaScript with window assignments
const cleanJS = `
(function(){
    // ============================================================
    // 1. MATRIX RAIN BACKGROUND
    // ============================================================
    var c = document.getElementById('matrixCanvas');
    var ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var cols = Math.floor(c.width / 14);
    var drops = [];
    for(var i = 0; i < cols; i++){ drops[i] = Math.floor(Math.random() * -100); }
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]|&^%$#@!';
    function drawMatrix(){
        ctx.fillStyle = 'rgba(10,0,0,.05)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#cc0000';
        ctx.font = '12px monospace';
        for(var i = 0; i < drops.length; i++){
            var text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = i % 2 === 0 ? '#cc0000' : '#661111';
            ctx.fillText(text, i * 14, drops[i] * 14);
            if(drops[i] * 14 > c.height && Math.random() > .975){ drops[i] = 0; }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 60);
    window.addEventListener('resize', function(){
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        cols = Math.floor(c.width / 14);
        drops.length = cols;
        for(var i = 0; i < cols; i++){ drops[i] = Math.floor(Math.random() * -100); }
    });

    // ============================================================
    // 2. TYPING EFFECT
    // ============================================================
    var typingText = document.getElementById('typingText');
    var phrases = [
        'Inteligencia de fuentes abiertas y análisis OSINT.',
        'Desarrollo web con estándares de seguridad avanzados.',
        'Operaciones de privacidad digital para particulares.',
        'Auditoría de huella digital y exposición en internet.',
        'Herramientas a medida y scripts de monitoreo.'
    ];
    var pIdx = 0, cIdx = 0, isDeleting = false;
    function typeEffect(){
        var current = phrases[pIdx];
        if(!isDeleting){
            typingText.textContent = current.substring(0, cIdx + 1);
            cIdx++;
            if(cIdx === current.length){ isDeleting = true; setTimeout(typeEffect, 2000); return; }
            setTimeout(typeEffect, 40 + Math.random() * 60);
        } else {
            typingText.textContent = current.substring(0, cIdx - 1);
            cIdx--;
            if(cIdx === 0){
                isDeleting = false;
                pIdx = (pIdx + 1) % phrases.length;
                setTimeout(typeEffect, 500); return;
            }
            setTimeout(typeEffect, 20 + Math.random() * 30);
        }
    }
    setTimeout(typeEffect, 1000);

    // ============================================================
    // 3. SERVICES DATA
    // ============================================================
    var services = [
        { icon: '♦', name: 'Auditoría de Huella Digital', desc: 'Investigación exhaustiva mediante fuentes abiertas para mapear toda la información pública existente en internet.' },
        { icon: '♦', name: 'Chequeo de Credenciales (Dark Web)', desc: 'Verificación remota en bases de datos y repositorios de filtraciones masivas para comprobar cuentas comprometidas.' },
        { icon: '♦', name: 'Análisis Forense en Sandbox', desc: 'Recepción controlada de archivos o ejecutables dudosos para analizarlos en un entorno aislado y seguro.' },
        { icon: '♦', name: 'Simulación de Phishing', desc: 'Ejecución controlada de campañas de ingeniería social simulada para evaluar vulnerabilidades ante estafas.' },
        { icon: '♦', name: 'Auditoría Web Personal', desc: 'Pruebas de penetración superficial a sitios web propios para detectar fallos de configuración o cabeceras inseguras.' },
        { icon: '♦', name: 'Endurecimiento y Privacidad', desc: 'Sesión guiada a distancia para configurar 2FA, gestores de contraseñas y blindaje de navegadores.' },
        { icon: '♦', name: 'Limpieza de Metadatos', desc: 'Inspección digital de documentos e imágenes para extraer y eliminar metadatos ocultos como coordenadas GPS.' },
        { icon: '♦', name: 'Scripts de Monitoreo', desc: 'Creación de herramientas personalizadas en Python/Bash para vigilar carpetas críticas y detectar accesos.' },
        { icon: '♦', name: 'Bots de Telegram', desc: 'Desarrollo de bots cifrados para notificaciones instantáneas de inicio de sesión y control remoto.' },
        { icon: '♦', name: 'Escaneo Web Ligero', desc: 'Scripts rápidos para comprobar certificados SSL, cabeceras de seguridad o puertos abiertos en dominios.' },
        { icon: '♦', name: 'Criptografía Local', desc: 'Creación de programas para encriptar, desencriptar o destruir de forma segura archivos sensibles en disco.' },
        { icon: '♦', name: 'Entornos de Prueba (Sandbox)', desc: 'Configuración automatizada de contenedores o VMs ligeras para probar scripts sin arriesgar el sistema.' },
        { icon: '♦', name: 'Venta de Números Virtuales', desc: 'Líneas virtuales temporales para verificación de cuentas, alta privacidad y gestión de registros digitales.' },
        { icon: '♦', name: 'Creación de Páginas Web', desc: 'Diseño y desarrollo de sitios web modernos, portafolios, landing pages y plataformas estáticas.' },
        { icon: '♦', name: 'PoCs Educativas', desc: 'Desarrollo controlado de pruebas de concepto y scripts demostrativos con fines estrictamente académicos.' }
    ];
    var grid = document.getElementById('servicesGrid');
    services.forEach(function(s, i){
        var card = document.createElement('div');
        card.className = 'card reveal';
        card.style.transitionDelay = ((i % 5) * 0.08) + 's';
        card.innerHTML = '<span class="icon">' + s.icon + '</span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="card-number">' + String(i+1).padStart(2,'0') + '</span><span class="card-corner tl"></span><span class="card-corner tr"></span><span class="card-corner bl"></span><span class="card-corner br"></span>';
        grid.appendChild(card);
    });

    // ============================================================
    // 4. SCROLL REVEAL
    // ============================================================
    var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){ e.target.classList.add('visible'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

    // ============================================================
    // 5. STATS COUNTER
    // ============================================================
    var statsObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){
                var numEl = e.target.querySelector('.stat-number');
                if(numEl && !numEl.dataset.counted){
                    numEl.dataset.counted = 'true';
                    var target = parseInt(numEl.dataset.target);
                    var current = 0;
                    var step = Math.ceil(target / 40);
                    var interval = setInterval(function(){
                        current += step;
                        if(current >= target){ current = target; clearInterval(interval); }
                        numEl.textContent = current + (target === 100 ? '%' : target === 24 ? '/7' : target === 15 ? '' : '%');
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-item').forEach(function(el){ statsObserver.observe(el); });

    // ============================================================
    // 6. NAVBAR SCROLL EFFECT
    // ============================================================
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function(){
        if(window.scrollY > 50){ navbar.classList.add('scrolled'); }
        else { navbar.classList.remove('scrolled'); }
        document.getElementById('scrollTop').style.display = window.scrollY > 500 ? 'flex' : 'none';
    });

    // ============================================================
    // 7. NAV TOGGLE (exposed to window for onclick handlers)
    // ============================================================
    function toggleNav(){
        document.getElementById('navLinks').classList.toggle('open');
    }
    function closeNav(){
        document.getElementById('navLinks').classList.remove('open');
    }
    window.toggleNav = toggleNav;
    window.closeNav = closeNav;

    // ============================================================
    // 8. CHAT SYSTEM (exposed to window for onclick handlers)
    // ============================================================
    var STORAGE_KEY = "secure_user_tickets";
    var DATE_KEY = "secure_token_date";
    var SESSION_KEY = "active_ticket_id";
    var lastMsgTime = 0;
    var _currTkt = localStorage.getItem(SESSION_KEY);

    function _getTzDate(){
        try { return new Intl.DateTimeFormat('en-CA', { timeZone: "America/Caracas" }).format(new Date()); }
        catch(e) { return new Date().toISOString().split('T')[0]; }
    }

    function toggleChat(){
        var panel = document.getElementById('chatPanel');
        panel.classList.toggle('open');
        if(panel.classList.contains('open')){ _initSession(); }
    }
    window.toggleChat = toggleChat;

    function _initSession(){
        var today = _getTzDate();
        var savedDate = localStorage.getItem(DATE_KEY);
        var tickets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if(savedDate !== today){ localStorage.setItem(DATE_KEY, today); }
        document.getElementById('chatDateDisplay').textContent = today;
        if(!_currTkt || !tickets.find(function(t){ return t.id === _currTkt; })){
            var todayTickets = tickets.filter(function(t){ return t.date === today; });
            if(todayTickets.length >= 25){
                _appendSysMsg('system', 'Límite diario de consultas alcanzado (25/25). Intente nuevamente mañana.');
                document.getElementById('chatInput').disabled = true;
                return;
            }
            _currTkt = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            localStorage.setItem(SESSION_KEY, _currTkt);
            tickets.push({
                id: _currTkt,
                date: today,
                timestamp: Date.now(),
                status: 'open',
                messages: [{ sender: 'system', text: 'Sesión iniciada. Un operador atenderá su solicitud.', time: new Date().toLocaleTimeString() }]
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        }
        _renderMsgs();
    }

    function _appendSysMsg(sender, text){
        var body = document.getElementById('chatBody');
        var div = document.createElement('div');
        div.className = 'msg ' + sender;
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function _renderMsgs(){
        var tickets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        var ticket = tickets.find(function(t){ return t.id === _currTkt; });
        if(!ticket) return;
        var body = document.getElementById('chatBody');
        var today = _getTzDate();
        body.innerHTML = '<div class="chat-date">' + today + '</div>';
        ticket.messages.forEach(function(m){
            var div = document.createElement('div');
            div.className = 'msg ' + m.sender;
            div.textContent = m.text;
            body.appendChild(div);
        });
        body.scrollTop = body.scrollHeight;
        if(ticket.status === 'closed'){
            document.getElementById('chatTitle').textContent = 'Soporte (Cerrado)';
            document.getElementById('chatInput').disabled = true;
        } else {
            document.getElementById('chatTitle').textContent = 'Soporte ' + ticket.id;
            document.getElementById('chatInput').disabled = false;
        }
    }

    function sendClientMsg(){
        var now = Date.now();
        if(now - lastMsgTime < 3000){
            alert("Rate Limit: Por favor espere 3 segundos entre cada mensaje.");
            return;
        }
        lastMsgTime = now;
        var input = document.getElementById('chatInput');
        var txt = input.value.trim();
        if(!txt) return;
        var tickets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        var ticket = tickets.find(function(t){ return t.id === _currTkt; });
        if(!ticket || ticket.status === 'closed') return;
        ticket.messages.push({ sender: 'client', text: txt, time: new Date().toLocaleTimeString() });
        ticket.timestamp = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        input.value = '';
        _renderMsgs();
        var ti = document.getElementById('typingIndicator');
        ti.style.display = 'block';
        setTimeout(function(){ ti.style.display = 'none'; }, 2000);
    }
    window.sendClientMsg = sendClientMsg;

    document.getElementById('chatInput').addEventListener('keypress', function(e){
        if(e.key === 'Enter'){ sendClientMsg(); }
    });

    setInterval(function(){
        if(document.getElementById('chatPanel').classList.contains('open') && _currTkt){ _renderMsgs(); }
    }, 1500);

    // ============================================================
    // 9. SECURITY MEASURES
    // ============================================================
    document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    document.addEventListener('keydown', function(e){
        if(e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')){
            e.preventDefault();
            document.getElementById('firewallOverlay').style.display = 'flex';
        }
    });
    var devtools = /./;
    devtools.toString = function(){
        document.getElementById('firewallOverlay').style.display = 'flex';
        return '';
    };
    setInterval(function(){
        if(devtools === 'test'){ /* noop */ }
    }, 1000);
})();
`;

// Save clean JS
fs.writeFileSync('_clean.js', cleanJS.trim());
console.log('Clean JS saved: ' + cleanJS.trim().length + ' chars');

// Obfuscate
console.log('Obfuscating...');
execSync('npx javascript-obfuscator _clean.js --output _obf.js --compact true --control-flow-flattening true --control-flow-flattening-threshold 0.8 --string-array true --string-array-encoding "rc4" --string-array-threshold 0.85 --dead-code-injection true --dead-code-injection-threshold 0.3 --transform-object-keys true --numbers-to-expressions true --simplify false', { stdio: 'pipe' });

// Read obfuscated
const obfJS = fs.readFileSync('_obf.js', 'utf8').trim();
console.log('Obfuscated JS: ' + obfJS.length + ' chars');

// Rebuild HTML
const newHTML = htmlBeforeScript + '<script>' + obfJS + '</script>' + htmlAfterScript;
fs.writeFileSync('index.html', newHTML);
console.log('index.html rebuilt successfully');

// Clean up temp files
fs.unlinkSync('_clean.js');
fs.unlinkSync('_obf.js');
console.log('Temp files cleaned');
