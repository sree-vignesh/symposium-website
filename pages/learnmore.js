console.log("helo");

import { HALO } from "vanta/dist/vanta.halo.min.js";

VANTA.HALO({
  el: "#canvas-4",
  mouseControls: true,
  touchControls: false,
  // gyroControls: true,
  minHeight: 200.0,
  minWidth: 200.0,
  amplitudeFactor: 1.4,
  xOffset: 0.26,
  backgroundColor: 0x06142a,
  baseColor: 0xf2ff0,
  // color: "aqua",
});
