import { gsap } from "gsap";
const largeScreen = window.matchMedia("(min-width: 1024px)");
window.addEventListener("DOMContentLoaded", () => {
    let path = document.querySelector(".header__menu .path");
    function lerp(start, end, t) {
        return (start * (1 - t) + end * t).toFixed(3);
    }

    let toggle = false;
    let y = 100;
    let c = 100;
    let animationFrame;
    let body = document.body;
    let logoText = document.querySelector(".logo-text");
    let menuToggle = document.querySelector(".header__toggler");
    let menuIconOne = menuToggle.querySelector(".line-1");
    let menuIconTwo = menuToggle.querySelector(".line-2");
    let menuWrapper = document.querySelector(".header__menu");
    let ul = document.querySelector(".header__menu-list");
    let menuItem = ul.querySelectorAll(".header__menu-item");
    let cta = document.querySelector(".header__action");

    menuWrapper.style.pointerEvents = "none";

    menuToggle.addEventListener("click", () => {
        toggle = !toggle;
        cancelAnimationFrame(animationFrame);
        animate();
        let tl = gsap.timeline();

        if (toggle) {
            tl.set(menuIconOne, {
                rotate: 45,
                y: 0,
                transformOrigin: "50%, 50%",
            })
                .set(body, {
                    onComplete: () => {
                        body.classList.toggle("no-scroll");
                    },
                })
                .set(menuIconTwo, {
                    rotate: -45,
                    y: 0,
                    transformOrigin: "50%, 50%",
                })
                .set(ul, { display: "block" })
                .set(menuWrapper, { pointerEvents: "all" })
                .set(menuItem, { autoAlpha: 0, y: 50 })
                .set(
                    cta,
                    {
                        onComplete: () => {
                            cta.classList.toggle("hidden");
                        },
                    },
                    0.5
                )
                .to(
                    logoText,
                    {
                        color: "var(--color-text-dark)",
                        duration: 0.5,
                    },
                    "<"
                )
                .to(
                    menuItem,
                    {
                        autoAlpha: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.5,
                    },
                    "<"
                );
        } else {
            gsap.set(menuIconOne, {
                rotate: 0,
                y: -3,
                transformOrigin: "50%, 50%",
            });
            gsap.set(menuIconTwo, {
                rotate: 0,
                y: 3,
                transformOrigin: "50%, 50%",
            });
            gsap.set(menuWrapper, {
                pointerEvents: "none",
            });
            gsap.set(ul, { display: "none" });
            gsap.set(logoText, { color: "var(--color-text-white)" });
            gsap.set(menuItem, { autoAlpha: 0, y: 50 });
            gsap.set(cta, {
                onComplete: () => {
                    body.classList.toggle("no-scroll");
                    cta.classList.toggle("hidden");
                },
            });
        }
    });

    function animate() {
        if (toggle) {
            y = lerp(y, 0, 0.099);
            c = lerp(c, 0, 0.125);
        } else {
            if (largeScreen.matches) {
                y = lerp(y, 100, 0.033);
                c = lerp(c, 100, 0.041);
            } else {
                y = lerp(y, 100, 0.099);
                c = lerp(c, 100, 0.125);
            }
        }
        path.setAttribute(
            "d",
            `M 0 ${y} L 0 100 100 100 100 ${y} C 50 ${c}, 50 ${c}, 0 ${y}`
        );
        if ((toggle && y < 1 && c < 1) || (!toggle && y > 99 && c > 99)) {
            cancelAnimationFrame(animationFrame);
            return;
        }

        animationFrame = requestAnimationFrame(animate);
    }
});
