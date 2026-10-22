(function () {
    var container = document.querySelector('.bg');

    if (!container) {
        return;
    }

    if (container.getAttribute('data-ascii-bg') === '1') {
        return;
    }

    container.setAttribute('data-ascii-bg', '1');

    var canvas = container.querySelector('canvas');

    if (!canvas) {
        canvas = document.createElement('canvas');
        container.appendChild(canvas);
    }

    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    var ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) {
        return;
    }

    var stepX = 20.0;
    var stepY = 22.0;
    var baseSize = 16.0;
    var fixedFont = baseSize + 'px monospace';

    var pointerRadius = 340.0;
    var followRate = 2.2;
    var energyOnRate = 1.6;
    var energyOffRate = 1.0;
    var pointerIdleMs = 1700;

    var speedRef = 1100.0;
    var speedSmoothRate = 8.0;

    var zoneEnterThreshold = 0.12;
    var zoneMinDelayMs = 120.0;
    var zoneMaxDelayMs = 750.0;

    var scrollSpreadMs = 1400.0;

    var alphaBaseLight = 0.10;
    var alphaBoostLight = 0.36;
    var alphaBaseDark = 0.13;
    var alphaBoostDark = 0.42;
    var alphaMax = 0.58;

    var inkLight = 'rgb(18,18,22)';
    var inkDark = 'rgb(236,239,246)';

    var chars = [];
    var ci;

    for (ci = 33; ci <= 126; ci++) {
        chars.push(String.fromCharCode(ci));
    }

    var cells = [];
    var cols = 0;
    var rows = 0;
    var logicalWidth = 1;
    var logicalHeight = 1;
    var dpr = 1;

    var pointerX = -9999;
    var pointerY = -9999;
    var prevPointerX = -9999;
    var prevPointerY = -9999;
    var lastPointerTime = -999999;

    var followX = -9999;
    var followY = -9999;
    var energy = 0;

    var speedSmoothed = 0;
    var speedNorm = 0;

    var lastFrame = performance.now();
    var running = true;
    var rafId = 0;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function isDark() {
        return !!document.body && document.body.classList.contains('darktheme');
    }

    function clamp(value, min, max) {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function buildGrid() {
        cells = [];
        cols = Math.ceil(logicalWidth / stepX) + 1;
        rows = Math.ceil(logicalHeight / stepY) + 1;

        var r;
        var c;
        var x;
        var y;

        for (r = 0; r < rows; r++) {
            y = r * stepY + stepY * 0.5;

            for (c = 0; c < cols; c++) {
                x = c * stepX + stepX * 0.5;

                cells.push({
                    x: x,
                    y: y,
                    char: randomChar(),
                    due: Infinity,
                    scrollDue: Infinity
                });
            }
        }
    }

    function measure() {
        var rect = container.getBoundingClientRect();
        var newW = Math.max(1, rect.width);
        var newH = Math.max(1, rect.height);
        var newDpr = Math.min(window.devicePixelRatio || 1, 2);

        if (newW === logicalWidth && newH === logicalHeight && newDpr === dpr) {
            return false;
        }

        logicalWidth = newW;
        logicalHeight = newH;
        dpr = newDpr;

        canvas.width = Math.floor(newW * dpr);
        canvas.height = Math.floor(newH * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildGrid();

        return true;
    }

    function changeChar(cell) {
        cell.char = randomChar();
    }

    function zoneDelayMs(inf) {
        var base = lerp(zoneMaxDelayMs, zoneMinDelayMs, speedNorm);
        return base * (1.0 - inf * 0.6);
    }

    function clearPointer() {
        lastPointerTime = -999999;
    }

    function setPointer(clientX, clientY) {
        var rect = container.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
            return;
        }

        pointerX = clientX - rect.left;
        pointerY = clientY - rect.top;
        lastPointerTime = performance.now();
    }

    function markScroll() {
        var now = performance.now();
        var i;
        var cell;

        for (i = 0; i < cells.length; i++) {
            cell = cells[i];

            if (cell.scrollDue === Infinity || now > cell.scrollDue) {
                cell.scrollDue = now + rand(0, scrollSpreadMs);
            }
        }
    }

    window.addEventListener('pointermove', function (event) {
        setPointer(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('pointerdown', function (event) {
        setPointer(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('pointerout', function (event) {
        if (!event.relatedTarget) {
            clearPointer();
        }
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
        clearPointer();
    }, { passive: true });

    window.addEventListener('blur', function () {
        clearPointer();
    }, { passive: true });

    window.addEventListener('scroll', function () {
        markScroll();
    }, { passive: true });

    window.addEventListener('resize', function () {
        measure();
    }, { passive: true });

    if (typeof ResizeObserver === 'function') {
        var ro = new ResizeObserver(function () {
            measure();
        });

        ro.observe(container);
    }

    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;

        if (running) {
            lastFrame = performance.now();
            prevPointerX = pointerX;
            prevPointerY = pointerY;

            if (!rafId) {
                rafId = requestAnimationFrame(loop);
            }
        } else {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }
    });

    measure();
    followX = pointerX;
    followY = pointerY;
    prevPointerX = pointerX;
    prevPointerY = pointerY;

    function updateSpeed(now, dt) {
        var raw = 0;

        if (dt > 0.0001 && prevPointerX > -9000) {
            var sdx = pointerX - prevPointerX;
            var sdy = pointerY - prevPointerY;
            raw = Math.sqrt(sdx * sdx + sdy * sdy) / dt;
        }

        prevPointerX = pointerX;
        prevPointerY = pointerY;

        var lerpV = 1 - Math.exp(-dt * speedSmoothRate);
        speedSmoothed += (raw - speedSmoothed) * lerpV;
        speedNorm = clamp(speedSmoothed / speedRef, 0, 1);
    }

    function draw(now) {
        var rawDt = (now - lastFrame) / 1000;
        lastFrame = now;

        var dt = clamp(rawDt, 0, 0.05);

        var dark = isDark();
        var baseAlpha = dark ? alphaBaseDark : alphaBaseLight;
        var boostAlpha = dark ? alphaBoostDark : alphaBoostLight;
        var ink = dark ? inkDark : inkLight;

        var pointerActive = (now - lastPointerTime) < pointerIdleMs;
        var energyTarget = pointerActive ? 1 : 0;
        var energyRate = pointerActive ? energyOnRate : energyOffRate;

        energy += (energyTarget - energy) * (1 - Math.exp(-dt * energyRate));

        updateSpeed(now, dt);

        var followLerp = 1 - Math.exp(-dt * followRate);
        followX += (pointerX - followX) * followLerp;
        followY += (pointerY - followY) * followLerp;

        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        ctx.font = fixedFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = ink;

        var i;
        var cell;
        var dx;
        var dy;
        var dist;
        var nd;
        var influence;
        var inZone;
        var alpha;

        for (i = 0; i < cells.length; i++) {
            cell = cells[i];

            dx = cell.x - followX;
            dy = cell.y - followY;
            dist = Math.sqrt(dx * dx + dy * dy);
            nd = dist / pointerRadius;
            influence = 0;

            if (nd < 1) {
                influence = (1 - nd) * (1 - nd) * energy;
            }

            inZone = influence > zoneEnterThreshold;

            if (inZone) {
                if (cell.due === Infinity) {
                    cell.due = now + zoneDelayMs(influence);
                } else if (now >= cell.due) {
                    changeChar(cell);
                    cell.due = now + zoneDelayMs(influence);
                }
            } else {
                cell.due = Infinity;
            }

            if (now >= cell.scrollDue) {
                changeChar(cell);
                cell.scrollDue = Infinity;
            }

            alpha = baseAlpha + influence * boostAlpha;

            if (alpha > alphaMax) {
                alpha = alphaMax;
            }

            if (alpha < 0.01) {
                continue;
            }

            ctx.globalAlpha = alpha;
            ctx.fillText(cell.char, cell.x, cell.y);
        }

        ctx.globalAlpha = 1;
    }

    function loop(now) {
        draw(now);
        rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
})();