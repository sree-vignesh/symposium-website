import * as p from "https://cdn.skypack.dev/pixi.js@5.x";
import { KawaseBlurFilter as f } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import y from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import a from "https://cdn.skypack.dev/hsl-to-hex";
import w from "https://cdn.skypack.dev/debounce";
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) o(i);
  new MutationObserver((i) => {
    for (const s of i)
      if (s.type === "childList")
        for (const l of s.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && o(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(i) {
    const s = {};
    return (
      i.integrity && (s.integrity = i.integrity),
      i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (s.credentials = "omit")
        : (s.credentials = "same-origin"),
      s
    );
  }
  function o(i) {
    if (i.ep) return;
    i.ep = !0;
    const s = r(i);
    fetch(i.href, s);
  }
})();
function n(e, t) {
  return Math.random() * (t - e) + e;
}
function u(e, t, r, o, i) {
  return ((e - t) / (r - t)) * (i - o) + o;
}
const d = new y();
class g {
  constructor() {
    this.setColors(), this.setCustomProperties();
  }
  setColors() {
    (this.hue = 240),
      (this.complimentaryHue1 = this.hue + 30),
      (this.complimentaryHue2 = this.hue - 60),
      (this.saturation = 95),
      (this.lightness = 50),
      (this.baseColor = a(this.hue, this.saturation, this.lightness)),
      (this.complimentaryColor1 = a(
        this.complimentaryHue1,
        this.saturation,
        this.lightness
      )),
      (this.complimentaryColor2 = a(
        this.complimentaryHue2,
        this.saturation,
        this.lightness
      )),
      (this.colorChoices = [
        this.baseColor,
        this.complimentaryColor1,
        this.complimentaryColor2,
      ]);
  }
  randomColor() {
    return this.colorChoices[~~n(0, this.colorChoices.length)].replace(
      "#",
      "0x"
    );
  }
  setCustomProperties() {
    document.documentElement.style.setProperty("--hue", this.hue),
      document.documentElement.style.setProperty(
        "--hue-complimentary1",
        this.complimentaryHue1
      ),
      document.documentElement.style.setProperty(
        "--hue-complimentary2",
        this.complimentaryHue2
      );
  }
}
class x {
  constructor(t = 0) {
    (this.bounds = this.setBounds()),
      (this.x = n(this.bounds.x.min, this.bounds.x.max)),
      (this.y = n(this.bounds.y.min, this.bounds.y.max)),
      (this.scale = 1),
      (this.fill = t),
      (this.radius = n(window.innerHeight / 6, window.innerHeight / 3)),
      (this.xOff = n(0, 1e3)),
      (this.yOff = n(0, 1e3)),
      (this.inc = 0.002),
      (this.graphics = new p.Graphics()),
      (this.graphics.alpha = 0.825),
      window.addEventListener(
        "resize",
        w(() => {
          this.bounds = this.setBounds();
        }, 250)
      );
  }
  setBounds() {
    const t =
        window.innerWidth < 1e3 ? window.innerWidth / 3 : window.innerWidth / 5,
      r = window.innerWidth / 1.25,
      o =
        window.innerWidth < 1e3
          ? window.innerHeight
          : window.innerHeight / 1.375;
    return { x: { min: r - t, max: r + t }, y: { min: o - t, max: o + t } };
  }
  update() {
    const t = d.noise2D(this.xOff, this.xOff),
      r = d.noise2D(this.yOff, this.yOff),
      o = d.noise2D(this.xOff, this.yOff);
    (this.x = u(t, -1, 1, this.bounds.x.min, this.bounds.x.max)),
      (this.y = u(r, -1, 1, this.bounds.y.min, this.bounds.y.max)),
      (this.scale = u(o, -1, 1, 0.5, 1)),
      (this.xOff += this.inc),
      (this.yOff += this.inc);
  }
  render() {
    (this.graphics.x = this.x),
      (this.graphics.y = this.y),
      this.graphics.scale.set(this.scale),
      this.graphics.clear(),
      this.graphics.beginFill(this.fill),
      this.graphics.drawCircle(0, 0, this.radius),
      this.graphics.endFill();
  }
}
const m = new p.Application({
  view: document.querySelector(".orb-canvas"),
  resizeTo: window,
  transparent: !0,
});
m.stage.filters = [new f(30, 10, !0)];
const h = new g(),
  c = [];
for (let e = 0; e < 7; e++) {
  const t = new x(h.randomColor());
  m.stage.addChild(t.graphics), c.push(t);
}
window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ? c.forEach((e) => {
      e.update(), e.render();
    })
  : m.ticker.add(() => {
      c.forEach((e) => {
        e.update(), e.render();
      });
    });
document
  .querySelector(".overlay__btn--colors")
  .addEventListener("click", () => {
    h.setColors(),
      h.setCustomProperties(),
      c.forEach((e) => {
        e.fill = h.randomColor();
      });
  });
