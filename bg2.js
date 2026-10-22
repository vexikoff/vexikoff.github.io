(function () {
    var dc = document;
    var wn = window;
    var pf = performance;
    var mt = Math;
    var rq = requestAnimationFrame;
    var cq = cancelAnimationFrame;
    var ft = fetch;
    var el = dc.querySelector('.bg2');

    if (!el) {
        return;
    }

    if (el.getAttribute('data-tw') === '1') {
        return;
    }

    el.setAttribute('data-tw', '1');

    var cv = el.querySelector('canvas');

    if (!cv) {
        cv = dc.createElement('canvas');
        el.appendChild(cv);
    }

    cv.style.display = 'block';
    cv.style.width = '100%';
    cv.style.height = '100%';

    var ct = cv.getContext('2d', { alpha: true });

    if (!ct) {
        return;
    }

    var fs = 13.0;
    var lh = 18.0;
    var ff = fs + 'px monospace';
    var pl = 28.0;
    var pt = 24.0;
    var pb = 24.0;
    var ts = 42.0;
    var tn = 0.80;
    var tx = 1.30;
    var hn = 950.0;
    var hx = 1450.0;
    var bn = 530.0;
    var sc = 11.0;
    var ga = 1.5;
    var wi = 0.10;
    var hi = 0.80;
    var ti = 0.12;
    var hl = 0.30;
    var hd = 0.34;
    var al = 0.62;
    var ad = 0.66;
    var kl = 0.86;
    var kd = 0.92;
    var il = 'rgb(20,22,28)';
    var id = 'rgb(232,236,244)';
    var ml = 260;
    var cl = 180;
    var to = 2500;

    var fl = {
        py: 'main.py',
        html: 'index.html',
        css: 'style.css',
        js: 'script.js'
    };

    var sq = [
        {
            i: 'html',
            l: [
                '<!DOCTYPE html>',
                '<html lang="en">',
                '    <head>',
                '        <meta charset="UTF-8">',
                '        <meta name="viewport" content="width=device-width">',
                '        <title>Pg</title>',
                '        <link rel="stylesheet" href="st.css">',
                '    </head>',
                '    <body>',
                '        <header class="hd">',
                '            <a class="ln" href="#mn">Mn</a>',
                '            <nav class="nv">',
                '                <a class="ln" href="#a1">A1</a>',
                '                <a class="ln" href="#a2">A2</a>',
                '            </nav>',
                '        </header>',
                '        <main id="mn" class="mn">',
                '            <h1>Tt</h1>',
                '            <p class="tx">Tx</p>',
                '            <form class="fm" action="/sd" method="post">',
                '                <label class="lb" for="i1">I1</label>',
                '                <input class="ip" id="i1" name="i1" type="text" required>',
                '                <label class="lb" for="i2">I2</label>',
                '                <input class="ip" id="i2" name="i2" type="number" min="0" step="1">',
                '                <button class="bt" type="submit">Ok</button>',
                '            </form>',
                '            <ul class="ls">',
                '                <li>I1</li>',
                '                <li>I2</li>',
                '                <li>I3</li>',
                '            </ul>',
                '            <table class="tb">',
                '                <thead>',
                '                    <tr>',
                '                        <th>H1</th>',
                '                        <th>H2</th>',
                '                    </tr>',
                '                </thead>',
                '                <tbody>',
                '                    <tr>',
                '                        <td>D1</td>',
                '                        <td>D2</td>',
                '                    </tr>',
                '                    <tr>',
                '                        <td>D3</td>',
                '                        <td>D4</td>',
                '                    </tr>',
                '                </tbody>',
                '            </table>',
                '            <section id="a1" class="sc">',
                '                <h2>S1</h2>',
                '                <article class="ar">',
                '                    <figure class="fg">',
                '                        <img',
                '                            class="im"',
                '                            src="i1.png"',
                '                            alt="I1"',
                '                            width="120"',
                '                            height="80"',
                '                            loading="lazy"',
                '                        >',
                '                        <figcaption>Cp</figcaption>',
                '                    </figure>',
                '                    <p class="tx">Tx2</p>',
                '                </article>',
                '            </section>',
                '            <section id="a2" class="sc">',
                '                <h2>S2</h2>',
                '                <details class="dt">',
                '                    <summary class="sm">Sm</summary>',
                '                    <p class="tx">Tx3</p>',
                '                </details>',
                '            </section>',
                '            <template id="tp">',
                '                <div class="cd">Tp</div>',
                '            </template>',
                '        </main>',
                '        <footer class="ft">Ft</footer>',
                '        <script src="ap.js"><\/script>',
                '    </body>',
                '</html>'
            ]
        },
        {
            i: 'css',
            l: [
                'html,',
                'body {',
                '    margin: 0;',
                '    padding: 0;',
                '    color: black;',
                '    background: white;',
                '    font-family: monospace;',
                '}',
                '',
                '.mn {',
                '    display: flex;',
                '    flex-direction: column;',
                '    gap: 8px;',
                '    padding: 12px;',
                '    margin: 0 auto;',
                '    max-width: 720px;',
                '}',
                '',
                '.hd {',
                '    display: flex;',
                '    align-items: center;',
                '    justify-content: space-between;',
                '    height: 38px;',
                '}',
                '',
                '.nv {',
                '    display: flex;',
                '    gap: 8px;',
                '}',
                '',
                '.ln {',
                '    color: inherit;',
                '    text-decoration: none;',
                '}',
                '',
                '.ln:hover {',
                '    opacity: 0.80;',
                '}',
                '',
                '.fm {',
                '    display: grid;',
                '    gap: 6px;',
                '}',
                '',
                '.lb {',
                '    font-size: 12px;',
                '}',
                '',
                '.ip {',
                '    height: 28px;',
                '    padding: 0 6px;',
                '    border: 1px solid currentColor;',
                '    border-radius: 4px;',
                '    background: transparent;',
                '    color: inherit;',
                '    font: inherit;',
                '}',
                '',
                '.ip:focus {',
                '    outline: 2px solid currentColor;',
                '    outline-offset: 1px;',
                '}',
                '',
                '.bt {',
                '    height: 28px;',
                '    padding: 0 10px;',
                '    border: 1px solid currentColor;',
                '    border-radius: 4px;',
                '    background: transparent;',
                '    color: inherit;',
                '    cursor: pointer;',
                '    font: inherit;',
                '}',
                '',
                '.bt:hover {',
                '    opacity: 0.85;',
                '}',
                '',
                '.bt:active {',
                '    opacity: 0.70;',
                '}',
                '',
                '.ls {',
                '    margin: 0;',
                '    padding-left: 18px;',
                '}',
                '',
                '.tb {',
                '    width: 100%;',
                '    border-collapse: collapse;',
                '}',
                '',
                '.tb th,',
                '.tb td {',
                '    padding: 4px 6px;',
                '    border-bottom: 1px solid currentColor;',
                '    text-align: left;',
                '}',
                '',
                '.tb thead {',
                '    font-weight: bold;',
                '}',
                '',
                '.sc {',
                '    display: flex;',
                '    flex-direction: column;',
                '    gap: 6px;',
                '}',
                '',
                '.ar {',
                '    display: flex;',
                '    flex-direction: column;',
                '    gap: 6px;',
                '}',
                '',
                '.fg {',
                '    margin: 0;',
                '}',
                '',
                '.im {',
                '    display: block;',
                '    max-width: 100%;',
                '    height: auto;',
                '}',
                '',
                '.dt {',
                '    border: 1px solid currentColor;',
                '    border-radius: 4px;',
                '    padding: 6px;',
                '}',
                '',
                '.sm {',
                '    cursor: pointer;',
                '}',
                '',
                '.cd {',
                '    padding: 6px;',
                '    border: 1px dashed currentColor;',
                '}',
                '',
                '.ft {',
                '    padding: 8px;',
                '    text-align: center;',
                '}',
                '',
                '@media (max-width: 720px) {',
                '    .mn {',
                '        padding: 8px;',
                '    }',
                '',
                '    .hd {',
                '        flex-direction: column;',
                '        align-items: flex-start;',
                '        height: auto;',
                '        gap: 4px;',
                '    }',
                '}'
            ]
        },
        {
            i: 'js',
            l: [
                'const a = [1, 2, 3, 4, 5];',
                '',
                'function sm(b) {',
                '    let t = 0;',
                '    for (const n of b) {',
                '        t += n;',
                '    }',
                '    return t;',
                '}',
                '',
                'function fx(b, c) {',
                '    const d = [];',
                '    for (const n of b) {',
                '        if (n % c === 0) {',
                '            d.push(n * n);',
                '        }',
                '    }',
                '    return d;',
                '}',
                '',
                'function cn(b) {',
                '    return b.reduce((x, y) => x + y, 0);',
                '}',
                '',
                'function mx(b) {',
                '    return b.reduce((x, y) => x > y ? x : y);',
                '}',
                '',
                'function mn(b) {',
                '    return b.reduce((x, y) => x < y ? x : y);',
                '}',
                '',
                'const b = fx(a, 2);',
                'const c = sm(b);',
                'const d = cn(a);',
                'const e = mx(a);',
                'const f = mn(a);',
                '',
                'function rd() {',
                '    return Math.floor(Math.random() * 100);',
                '}',
                '',
                'const g = [];',
                'for (let i = 0; i < 5; ++i) {',
                '    g.push(rd());',
                '}',
                '',
                'const h = a.map((n) => n * 2);',
                'const j = a.filter((n) => n > 2);',
                'const k = a.some((n) => n === 3);',
                'const m = a.every((n) => n > 0);',
                '',
                'console.log(c, d, e, f, g, h, j, k, m);'
            ]
        },
        {
            i: 'py',
            l: [
                'def sm(a):',
                '    t = 0',
                '    for n in a:',
                '        if n % 2 == 0:',
                '            t += n * n',
                '    return t',
                '',
                'def fx(a, b):',
                '    if a > b:',
                '        return a',
                '    return b',
                '',
                'def mx(a):',
                '    x = a[0]',
                '    for n in a:',
                '        if n > x:',
                '            x = n',
                '    return x',
                '',
                'def mn(a):',
                '    x = a[0]',
                '    for n in a:',
                '        if n < x:',
                '            x = n',
                '    return x',
                '',
                'def nd(v):',
                '    return {"v": v, "n": None}',
                '',
                'def ap(h, v):',
                '    x = nd(v)',
                '    x["n"] = h["n"]',
                '    h["n"] = x',
                '    return x',
                '',
                'def sh(h):',
                '    t = 0',
                '    x = h["n"]',
                '    while x:',
                '        t += x["v"]',
                '        x = x["n"]',
                '    return t',
                '',
                'vs = [1, 2, 3, 4]',
                'rs = sm(vs)',
                'hd = nd(0)',
                'for i in vs:',
                '    ap(hd, i)',
                'ns = sh(hd)',
                'print(rs, ns, mx(vs), mn(vs), fx(3, 8))'
            ]
        },
        {
            i: 'cpp',
            l: [
                '#include <vector>',
                '#include <string>',
                '',
                'struct Pt {',
                '    int x;',
                '    int y;',
                '};',
                '',
                'std::vector<Pt> mk() {',
                '    std::vector<Pt> v;',
                '    v.push_back({1, 2});',
                '    v.push_back({3, 4});',
                '    v.push_back({5, 6});',
                '    return v;',
                '}',
                '',
                'int sm(const std::vector<Pt>& v) {',
                '    int t = 0;',
                '    for (const auto& p : v) {',
                '        t += p.x * p.x + p.y * p.y;',
                '    }',
                '    return t;',
                '}',
                '',
                'int mx(const std::vector<int>& v) {',
                '    int x = v[0];',
                '    for (int n : v) {',
                '        if (n > x) {',
                '            x = n;',
                '        }',
                '    }',
                '    return x;',
                '}',
                '',
                'int mn(const std::vector<int>& v) {',
                '    int x = v[0];',
                '    for (int n : v) {',
                '        if (n < x) {',
                '            x = n;',
                '        }',
                '    }',
                '    return x;',
                '}',
                '',
                'std::string fx(int n) {',
                '    std::string s;',
                '    for (int i = 0; i < n; ++i) {',
                '        s += char(65 + i % 26);',
                '    }',
                '    return s;',
                '}',
                '',
                'int main() {',
                '    auto v = mk();',
                '    int t = sm(v);',
                '    std::vector<int> w = {5, 2, 9, 1};',
                '    int x = mx(w);',
                '    int y = mn(w);',
                '    std::string s = fx(5);',
                '    return t + x + y + int(s.size());',
                '}'
            ]
        },
        {
            i: 'c',
            l: [
                '#include <stdio.h>',
                '#include <stdlib.h>',
                '#include <string.h>',
                '',
                'typedef struct {',
                '    int id;',
                '    char nm[16];',
                '} It;',
                '',
                'void in(It* p, int i, const char* s) {',
                '    p->id = i;',
                '    strncpy(p->nm, s, 15);',
                '    p->nm[15] = 0;',
                '}',
                '',
                'int sm(It* a, int n) {',
                '    int t = 0;',
                '    int i;',
                '    for (i = 0; i < n; ++i) {',
                '        t += a[i].id;',
                '    }',
                '    return t;',
                '}',
                '',
                'int mx(It* a, int n) {',
                '    int x = a[0].id;',
                '    int i;',
                '    for (i = 1; i < n; ++i) {',
                '        if (a[i].id > x) {',
                '            x = a[i].id;',
                '        }',
                '    }',
                '    return x;',
                '}',
                '',
                'int mn(It* a, int n) {',
                '    int x = a[0].id;',
                '    int i;',
                '    for (i = 1; i < n; ++i) {',
                '        if (a[i].id < x) {',
                '            x = a[i].id;',
                '        }',
                '    }',
                '    return x;',
                '}',
                '',
                'int cn(It* a, int n, const char* s) {',
                '    int i;',
                '    for (i = 0; i < n; ++i) {',
                '        if (strcmp(a[i].nm, s) == 0) {',
                '            return a[i].id;',
                '        }',
                '    }',
                '    return -1;',
                '}',
                '',
                'int main(void) {',
                '    int n = 3;',
                '    It* a = malloc(sizeof(It) * n);',
                '    if (!a) {',
                '        return 1;',
                '    }',
                '    in(&a[0], 1, "aa");',
                '    in(&a[1], 2, "bb");',
                '    in(&a[2], 3, "cc");',
                '    int t = sm(a, n);',
                '    int x = mx(a, n);',
                '    int y = mn(a, n);',
                '    int z = cn(a, n, "bb");',
                '    printf("%d %d %d %d", t, x, y, z);',
                '    free(a);',
                '    return 0;',
                '}'
            ]
        }
    ];

    var bf = [];
    var sl = [];
    var si = 0;
    var ph = 'ty';
    var hu = 0;
    var cu = 0;
    var cs = ts;
    var pa = 0;
    var ps = 0;
    var mx = 1;
    var mc = 80;
    var lw = 1;
    var ht = 1;
    var dp = 1;
    var lf = pf.now();
    var ru = !dc.hidden;
    var af = 0;
    var ok = false;

    function rr(a, b) {
        return a + mt.random() * (b - a);
    }

    function dk() {
        return !!dc.body && dc.body.classList.contains('darktheme');
    }

    function cm(a, b, c) {
        if (a < b) {
            return b;
        }

        if (a > c) {
            return c;
        }

        return a;
    }

    function pk(ex) {
        var n = sq.length;
        var i = mt.floor(mt.random() * n);
        var g = 0;

        while (i === ex && g < 12) {
            i = mt.floor(mt.random() * n);
            g++;
        }

        return i;
    }

    function tr(an) {
        while (bf.length > mx) {
            bf.shift();

            if (an) {
                ps += lh;
            }
        }
    }

    function xp(te) {
        var s = te;

        if (mc > 0 && s.length > mc) {
            s = s.substring(0, mc);
        }

        bf.push({
            f: s,
            p: 0
        });

        cs = ts * rr(tn, tx);
        pa = 0;
        tr(true);
    }

    function st(li) {
        cu = li;
        sl = sq[li].l;
        si = 0;
        ph = 'ty';
        xp(sl[0]);
    }

    function ms() {
        var rc = el.getBoundingClientRect();
        var nw = mt.max(1, rc.width);
        var nh = mt.max(1, rc.height);
        var nd = mt.min(wn.devicePixelRatio || 1, 2);

        lw = nw;
        ht = nh;
        dp = nd;

        cv.width = mt.floor(nw * nd);
        cv.height = mt.floor(nh * nd);

        ct.setTransform(nd, 0, 0, nd, 0, 0);
        ct.font = ff;

        var cw = ct.measureText('M').width;

        if (cw < 1) {
            cw = fs * 0.60;
        }

        mc = mt.floor((nw - pl - 12) / cw);

        if (mc < 8) {
            mc = 8;
        }

        var us = mt.max(lh, nh - pt - pb);
        mx = mt.max(1, mt.floor(us / lh));

        tr(false);
        ps = 0;
    }

    function rp(k, tx) {
        var ls = tx.split(/\r\n|\r|\n/);
        var ol = [];
        var i = 0;
        var s;
        var q;

        while (i < ls.length && ol.length < ml) {
            s = ls[i];
            s = s.replace(/\t/g, '    ');

            if (s.length > cl) {
                q = 0;

                while (q < s.length && ol.length < ml) {
                    ol.push(s.substring(q, q + cl));
                    q += cl;
                }
            } else {
                ol.push(s);
            }

            i++;
        }

        if (ol.length) {
            var j = 0;

            while (j < sq.length) {
                if (sq[j].i === k) {
                    sq[j].l = ol;
                    break;
                }

                j++;
            }
        }
    }

    function ld(cb) {
        if (!ft) {
            cb();
            return;
        }

        var ks = ['html', 'css', 'js', 'py'];
        var n = ks.length;
        var d = 0;
        var fn = false;

        function dn() {
            d++;

            if (!fn && d >= n) {
                fn = true;
                cb();
            }
        }

        var i = 0;

        while (i < n) {
            (function (k) {
                ft(fl[k], {
                    cache: 'no-store'
                }).then(function (rs) {
                    if (!rs.ok) {
                        throw 0;
                    }

                    return rs.text();
                }).then(function (tx) {
                    rp(k, tx);
                    dn();
                })['catch'](function () {
                    dn();
                });
            })(ks[i]);

            i++;
        }

        wn.setTimeout(function () {
            if (!fn) {
                fn = true;
                cb();
            }
        }, to);
    }

    wn.addEventListener('resize', function () {
        ms();
    }, { passive: true });

    if (typeof ResizeObserver === 'function') {
        var ob = new ResizeObserver(function () {
            ms();
        });

        ob.observe(el);
    }

    dc.addEventListener('visibilitychange', function () {
        ru = !dc.hidden;

        if (ru) {
            lf = pf.now();

            if (!af && ok) {
                af = rq(lo);
            }
        } else {
            if (af) {
                cq(af);
                af = 0;
            }
        }
    });

    function up(dt, tm) {
        ps += (0 - ps) * (1 - mt.exp(-dt * sc));

        if (mt.abs(ps) < 0.05) {
            ps = 0;
        }

        if (ph === 'ty') {
            var ac = bf[bf.length - 1];

            if (!ac) {
                return;
            }

            pa += cs * dt;
            var ic = mt.floor(pa);

            if (ic > 0) {
                pa -= ic;
                ac.p = cm(ac.p + ic, 0, ac.f.length);
            }

            if (ac.p >= ac.f.length) {
                if (si < sl.length - 1) {
                    si++;
                    xp(sl[si]);
                } else {
                    ph = 'hd';
                    hu = tm + rr(hn, hx);
                }
            }
        } else if (ph === 'hd') {
            if (tm >= hu) {
                st(pk(cu));
            }
        }
    }

    function dw(tm) {
        var db = dk();
        var ik = db ? id : il;
        var ha = db ? hd : hl;
        var aa = db ? ad : al;
        var ca = db ? kd : kl;

        ct.clearRect(0, 0, lw, ht);
        ct.font = ff;
        ct.textAlign = 'left';
        ct.textBaseline = 'top';
        ct.fillStyle = ik;

        var cw = mt.max(1.5, fs * wi);
        var ch = fs * hi;
        var bo = (tm % (bn * 2)) < bn;

        var i = 0;
        var ln;
        var y;
        var ia;
        var pp;
        var tw;

        while (i < bf.length) {
            ln = bf[i];
            y = pt + i * lh + ps;

            if (y + lh < 0) {
                i++;
                continue;
            }

            if (y > ht) {
                i++;
                continue;
            }

            ia = i === bf.length - 1;
            pp = ln.f.substring(0, ln.p);

            ct.globalAlpha = ia ? aa : ha;
            ct.fillText(pp, pl, y);

            if (ia) {
                if (ph === 'ty' || bo) {
                    tw = ct.measureText(pp).width;
                    ct.globalAlpha = ca;
                    ct.fillRect(pl + tw + ga, y + fs * ti, cw, ch);
                }
            }

            i++;
        }

        ct.globalAlpha = 1;
    }

    function lo(tm) {
        var dr = (tm - lf) / 1000;
        lf = tm;

        var dt = cm(dr, 0, 0.05);

        up(dt, tm);
        dw(tm);

        af = rq(lo);
    }

    function bt() {
        if (ok) {
            return;
        }

        ok = true;
        ms();
        st(pk(-1));
        lf = pf.now();

        if (ru) {
            af = rq(lo);
        }
    }

    ld(bt);
})();