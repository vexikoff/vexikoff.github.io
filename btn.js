(function () {
    var instances = [];
    var rafId = 0;
    var lastFrame = 0;
    var started = false;
    var scanFrames = 0;
    var maxScanFrames = 240;

    var stepX = 12.0;
    var stepY = 14.0;
    var baseSize = 11.0;
    var fixedFont = baseSize + "px monospace";

    var pointerIdleMs = 1500;
    var followRate = 3.0;
    var energyOnRate = 2.0;
    var energyOffRate = 1.2;

    var speedRef = 900.0;
    var speedSmoothRate = 9.0;

    var zoneEnterThreshold = 0.10;
    var zoneMinDelayMs = 90.0;
    var zoneMaxDelayMs = 520.0;

    var scrollSpreadMs = 900.0;

    var alphaBase = 0.35;
    var alphaBoost = 0.42;
    var alphaMax = 0.50;

    var inkDark = "rgb(16,16,20)";
    var inkLight = "rgb(238,241,248)";

    var chars = [];
    var ci;

    for (ci = 33; ci <= 126; ci++) {
        chars.push(String.fromCharCode(ci));
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
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

    function isBodyDark() {
        return !!document.body && document.body.classList.contains("darktheme");
    }

    function parseColorValue(value) {
        if (!value) {
            return null;
        }

        var match = value.match(/^rgba?\(([^)]+)\)$/i);

        if (!match) {
            return null;
        }

        var parts = match[1].split(",");

        if (parts.length < 3) {
            return null;
        }

        var r = parseFloat(parts[0]);
        var g = parseFloat(parts[1]);
        var b = parseFloat(parts[2]);
        var a = 1.0;

        if (parts.length > 3) {
            a = parseFloat(parts[3]);
        }

        if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
            return null;
        }

        if (a < 0.05) {
            return null;
        }

        return {
            r: r,
            g: g,
            b: b,
            a: a
        };
    }

    function refreshInk(inst) {
        var computed = window.getComputedStyle(inst.parent);
        var color = parseColorValue(computed.backgroundColor);
        var luminance;

        if (color) {
            luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255.0;
        } else {
            luminance = isBodyDark() ? 1.0 : 0.0;
        }

        inst.ink = luminance > 0.55 ? inkDark : inkLight;
    }

    function buildGrid(inst) {
        inst.cells = [];
        inst.cols = Math.ceil(inst.w / stepX) + 1;
        inst.rows = Math.ceil(inst.h / stepY) + 1;

        var r;
        var c;
        var x;
        var y;

        for (r = 0; r < inst.rows; r++) {
            y = r * stepY + stepY * 0.5;

            for (c = 0; c < inst.cols; c++) {
                x = c * stepX + stepX * 0.5;

                inst.cells.push({
                    x: x,
                    y: y,
                    char: randomChar(),
                    due: Infinity,
                    scrollDue: Infinity
                });
            }
        }
    }

    function measure(inst) {
        var rect = inst.container.getBoundingClientRect();
        var newW = Math.max(1, rect.width);
        var newH = Math.max(1, rect.height);
        var newDpr = Math.min(window.devicePixelRatio || 1, 2);

        if (newW === inst.w && newH === inst.h && newDpr === inst.dpr) {
            return false;
        }

        inst.w = newW;
        inst.h = newH;
        inst.dpr = newDpr;

        inst.canvas.width = Math.floor(newW * newDpr);
        inst.canvas.height = Math.floor(newH * newDpr);

        inst.ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0);

        buildGrid(inst);
        refreshInk(inst);

        return true;
    }

    function zoneRadius(inst) {
        return Math.max(95.0, Math.min(inst.w, inst.h) * 2.4 + inst.w * 0.38);
    }

    function zoneDelayMs(inst, influence) {
        var base = lerp(zoneMaxDelayMs, zoneMinDelayMs, inst.speedNorm);
        return base * (1.0 - influence * 0.6);
    }

    function changeChar(cell) {
        cell.char = randomChar();
    }

    function setPointer(inst, clientX, clientY) {
        var rect = inst.container.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
            return;
        }

        inst.pointerX = clientX - rect.left;
        inst.pointerY = clientY - rect.top;
        inst.lastPointerTime = performance.now();

        if (!inst.hasPointer) {
            inst.hasPointer = true;
            inst.followX = inst.pointerX;
            inst.followY = inst.pointerY;
            inst.prevPointerX = inst.pointerX;
            inst.prevPointerY = inst.pointerY;
        }
    }

    function clearPointer(inst) {
        inst.lastPointerTime = -999999;
        inst.hasPointer = false;
    }

    function markScroll() {
        var now = performance.now();
        var i;
        var inst;
        var j;
        var cell;

        for (i = 0; i < instances.length; i++) {
            inst = instances[i];

            for (j = 0; j < inst.cells.length; j++) {
                cell = inst.cells[j];

                if (cell.scrollDue === Infinity || now > cell.scrollDue) {
                    cell.scrollDue = now + rand(0, scrollSpreadMs);
                }
            }
        }
    }

    function initContainer(container) {
        if (container.getAttribute("data-btn-ascii") === "1") {
            return false;
        }

        container.setAttribute("data-btn-ascii", "1");

        var parent = container.parentElement;

        if (!parent) {
            return false;
        }

        var canvas = container.querySelector("canvas");

        if (!canvas) {
            canvas = document.createElement("canvas");
            container.appendChild(canvas);
        }

        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        var ctx = canvas.getContext("2d", { alpha: true });

        if (!ctx) {
            return false;
        }

        var inst = {
            container: container,
            parent: parent,
            canvas: canvas,
            ctx: ctx,
            w: 1,
            h: 1,
            dpr: 1,
            cells: [],
            cols: 0,
            rows: 0,
            pointerX: -9999,
            pointerY: -9999,
            prevPointerX: -9999,
            prevPointerY: -9999,
            followX: 0,
            followY: 0,
            lastPointerTime: -999999,
            hasPointer: false,
            energy: 0,
            speedSmoothed: 0,
            speedNorm: 0,
            ink: inkLight,
            frameTick: 0
        };

        parent.addEventListener("pointermove", function (event) {
            setPointer(inst, event.clientX, event.clientY);
        }, { passive: true });

        parent.addEventListener("pointerdown", function (event) {
            setPointer(inst, event.clientX, event.clientY);
        }, { passive: true });

        parent.addEventListener("pointerenter", function (event) {
            setPointer(inst, event.clientX, event.clientY);
            refreshInk(inst);
        }, { passive: true });

        parent.addEventListener("pointerleave", function () {
            clearPointer(inst);
            refreshInk(inst);
        }, { passive: true });

        parent.addEventListener("pointerout", function (event) {
            if (!event.relatedTarget || !parent.contains(event.relatedTarget)) {
                clearPointer(inst);
                refreshInk(inst);
            }
        }, { passive: true });

        parent.addEventListener("pointercancel", function () {
            clearPointer(inst);
        }, { passive: true });

        parent.addEventListener("focus", function () {
            refreshInk(inst);
        }, { passive: true });

        parent.addEventListener("blur", function () {
            clearPointer(inst);
            refreshInk(inst);
        }, { passive: true });

        parent.addEventListener("transitionend", function () {
            refreshInk(inst);
        }, { passive: true });

        window.addEventListener("resize", function () {
            measure(inst);
        }, { passive: true });

        if (typeof ResizeObserver === "function") {
            var ro = new ResizeObserver(function () {
                measure(inst);
            });

            ro.observe(container);
        }

        measure(inst);
        inst.followX = inst.w * 0.5;
        inst.followY = inst.h * 0.5;
        refreshInk(inst);
        instances.push(inst);

        return true;
    }

    function scanContainers() {
        var containers = document.querySelectorAll(".bgg");
        var found = 0;
        var i;

        for (i = 0; i < containers.length; i++) {
            if (initContainer(containers[i])) {
                found++;
            }
        }

        return found;
    }

    function updateSpeed(inst, dt) {
        var raw = 0;

        if (dt > 0.0001 && inst.hasPointer && inst.prevPointerX > -9000) {
            var sdx = inst.pointerX - inst.prevPointerX;
            var sdy = inst.pointerY - inst.prevPointerY;
            raw = Math.sqrt(sdx * sdx + sdy * sdy) / dt;
        }

        inst.prevPointerX = inst.pointerX;
        inst.prevPointerY = inst.pointerY;

        var smoothing = 1.0 - Math.exp(-dt * speedSmoothRate);
        inst.speedSmoothed += (raw - inst.speedSmoothed) * smoothing;
        inst.speedNorm = clamp(inst.speedSmoothed / speedRef, 0.0, 1.0);
    }

    function drawInstance(inst, now, dt) {
        inst.frameTick++;

        if (inst.frameTick % 12 === 0) {
            measure(inst);
            refreshInk(inst);
        }

        var pointerActive = (now - inst.lastPointerTime) < pointerIdleMs;
        var energyTarget = pointerActive && inst.hasPointer ? 1.0 : 0.0;
        var energyRate = pointerActive ? energyOnRate : energyOffRate;

        inst.energy += (energyTarget - inst.energy) * (1.0 - Math.exp(-dt * energyRate));

        updateSpeed(inst, dt);

        var followLerp = 1.0 - Math.exp(-dt * followRate);
        inst.followX += (inst.pointerX - inst.followX) * followLerp;
        inst.followY += (inst.pointerY - inst.followY) * followLerp;

        var ctx = inst.ctx;
        var radius = zoneRadius(inst);

        ctx.clearRect(0, 0, inst.w, inst.h);
        ctx.font = fixedFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = inst.ink;

        var i;
        var cell;
        var dx;
        var dy;
        var dist;
        var nd;
        var influence;
        var inZone;
        var alpha;

        for (i = 0; i < inst.cells.length; i++) {
            cell = inst.cells[i];

            dx = cell.x - inst.followX;
            dy = cell.y - inst.followY;
            dist = Math.sqrt(dx * dx + dy * dy);
            nd = dist / radius;
            influence = 0.0;

            if (nd < 1.0) {
                influence = (1.0 - nd) * (1.0 - nd) * inst.energy;
            }

            inZone = influence > zoneEnterThreshold;

            if (inZone) {
                if (cell.due === Infinity) {
                    cell.due = now + zoneDelayMs(inst, influence);
                } else if (now >= cell.due) {
                    changeChar(cell);
                    cell.due = now + zoneDelayMs(inst, influence);
                }
            } else {
                cell.due = Infinity;
            }

            if (now >= cell.scrollDue) {
                changeChar(cell);
                cell.scrollDue = Infinity;
            }

            alpha = alphaBase + influence * alphaBoost;

            if (alpha > alphaMax) {
                alpha = alphaMax;
            }

            if (alpha < 0.01) {
                continue;
            }

            ctx.globalAlpha = alpha;
            ctx.fillText(cell.char, cell.x, cell.y);
        }

        ctx.globalAlpha = 1.0;
    }

    function loop(now) {
        var rawDt = (now - lastFrame) / 1000.0;
        lastFrame = now;

        var dt = clamp(rawDt, 0.0, 0.05);
        var i;

        for (i = 0; i < instances.length; i++) {
            drawInstance(instances[i], now, dt);
        }

        if (instances.length === 0 && scanFrames < maxScanFrames) {
            scanFrames++;
            scanContainers();
        }

        if (instances.length === 0 && scanFrames >= maxScanFrames) {
            stopLoop();
            return;
        }

        rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
        if (rafId || !instances.length) {
            return;
        }

        lastFrame = performance.now();
        rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
        if (!rafId) {
            return;
        }

        cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function boot() {
        if (started) {
            return;
        }

        started = true;

        scanContainers();
        startLoop();

        window.addEventListener("scroll", function () {
            markScroll();
        }, { passive: true });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopLoop();
            } else {
                lastFrame = performance.now();
                startLoop();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    window.addEventListener("load", boot);
})();