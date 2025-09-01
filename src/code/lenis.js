import Lenis from "lenis";
const lenis = new Lenis({
    wheelMultiplier: 2,
    smoothWheel: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
