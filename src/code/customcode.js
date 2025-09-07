import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";

class PortfolioAnimations {
    constructor() {
        this.config = {
            cursor: {
                lerp: 0.04,
                breakpoint: 1024,
            },
            button: {
                magnetEase: "power3.out",
                magnetDuration: 0.5,
                resetEase: "elastic.out(1.2, 0.2)",
                resetDuration: 2.5,
            },
            text: {
                stagger: 0.2,
                lineDuration: 1,
                lineStagger: 0.05,
            },
            skills: {
                distance: 50,
                duration: 1,
            },
            slider: {
                speed: 5000,
                spaceBetween: 40,
            },
        };

        this.elements = {};
        this.animations = new Map();
        this.isInitialized = false;

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Cache DOM elements
        this.cacheElements();

        // Initialize all animations
        this.initCursorFollower();
        this.initButtonEffects();
        this.initSlider();
        this.initTextAnimations();
        this.initSkillAnimations();
        this.initLineAnimations();

        this.isInitialized = true;
    }

    cacheElements() {
        this.elements = {
            cursorFollower: document.getElementById("cursorFollower"),
            wrapper: document.querySelector(".page-wrapper"),
            magneticButtons: document.querySelectorAll(".magnetic-button"),
            swiper: document.querySelector(".swiper"),
            splitWords: document.querySelectorAll(".split-word"),
            skillItems: document.querySelectorAll(".skill__item"),
            staElement: document.querySelector(".sta"),
        };
    }

    initCursorFollower() {
        if (
            window.innerWidth <= this.config.cursor.breakpoint ||
            !this.elements.cursorFollower
        ) {
            return;
        }

        const { cursorFollower, wrapper } = this.elements;
        const { lerp } = this.config.cursor;

        let targetX = 0,
            targetY = 0;
        let currentX = 0,
            currentY = 0;

        const handleMouseMove = (e) => {
            const rect = wrapper.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        };

        const updateCursor = () => {
            currentX += (targetX - currentX) * lerp;
            currentY += (targetY - currentY) * lerp;

            gsap.set(cursorFollower, {
                x: currentX,
                y: currentY,
                force3D: true,
            });
        };

        wrapper?.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });
        gsap.ticker.add(updateCursor);

        // Store cleanup function
        this.animations.set("cursor", () => {
            wrapper?.removeEventListener("mousemove", handleMouseMove);
            gsap.ticker.remove(updateCursor);
        });
    }

    initButtonEffects() {
        if (!this.elements.magneticButtons.length) return;

        function resetMagnet(button, text) {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 2.5,
                ease: "elastic.out(1.2, 0.2)",
            });

            gsap.to(text, {
                x: 0,
                y: 0,
                ease: "power3.out",
            });
        }

        this.elements.magneticButtons.forEach((button) => {
            const text = button.querySelector(".btn .text");
            const buttonMagnetPower = button.dataset.strength;
            const textMagnetPower = button.dataset.strengthText;
            const bg = button.querySelector(".btn__bg");

            if (!text || !bg) return;

            //========= BG follow mouse effect
            const handleOrigin = (e) => {
                const rect = button.getBoundingClientRect();
                bg.style.left = `${e.clientX - rect.left}px`;
                bg.style.top = `${e.clientY - rect.top}px`;
            };

            button.addEventListener("mouseenter", (e) => {
                handleOrigin(e);
            });

            button.addEventListener("mousemove", function (e) {
                const rect = button.getBoundingClientRect();
                const offsetX = e.clientX - rect.left - rect.width / 2;
                const offsetY = e.clientY - rect.top - rect.height / 2;

                // Move button and text with GSAP
                gsap.to(button, {
                    x: offsetX * 0.5 * buttonMagnetPower,
                    y: offsetY * 0.5 * buttonMagnetPower,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto",
                });

                gsap.to(text, {
                    x: offsetX * textMagnetPower * 0.5,
                    y: offsetY * textMagnetPower * 0.5,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });

            button.addEventListener("mouseleave", (e) => {
                resetMagnet(button, text);
                handleOrigin(e);
            });
        });
    }

    initSlider() {
        if (!this.elements.swiper) return;

        const swiper = new Swiper(this.elements.swiper, {
            modules: [Autoplay],
            loop: true,
            slidesPerView: "auto",
            spaceBetween: this.config.slider.spaceBetween,
            centeredSlides: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                reverseDirection: true,
            },
            speed: this.config.slider.speed,
            allowTouchMove: false,
            freeMode: true,
        });

        this.animations.set("slider", () => swiper.destroy(true, true));
    }

    initTextAnimations() {
        if (!this.elements.splitWords.length) return;

        const { stagger } = this.config.text;
        const scrollTriggers = [];

        this.elements.splitWords.forEach((element) => {
            const split = new SplitText(element, { type: "words" });

            const scrollTrigger = ScrollTrigger.create({
                trigger: element,
                start: "top 75%",
                end: "top 35%",
                scrub: true,
                toggleActions: "play play reverse reverse",
                animation: gsap.fromTo(
                    split.words,
                    { opacity: 0.2 },
                    {
                        opacity: 1,
                        stagger,
                        duration: 1,
                        ease: "power2.out",
                    }
                ),
            });

            scrollTriggers.push(scrollTrigger);
        });

        this.animations.set("textAnimations", () => {
            scrollTriggers.forEach((st) => st.kill());
        });
    }

    initSkillAnimations() {
        if (!this.elements.skillItems.length) return;

        const { distance, duration } = this.config.skills;
        const scrollTriggers = [];

        this.elements.skillItems.forEach((item) => {
            const scrollTrigger = ScrollTrigger.create({
                trigger: item,
                start: "top 80%",
                end: "top 40%",
                scrub: true,
                toggleActions: "play play reverse reverse",
                animation: gsap.fromTo(
                    item,
                    {
                        y: distance,
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration,
                        ease: "power2.out",
                    }
                ),
            });

            scrollTriggers.push(scrollTrigger);
        });

        this.animations.set("skillAnimations", () => {
            scrollTriggers.forEach((st) => st.kill());
        });
    }

    initLineAnimations() {
        if (!this.elements.staElement) return;

        const { lineDuration, lineStagger } = this.config.text;

        // Wait for fonts to load before initializing
        document.fonts.ready.then(() => {
            const split = new SplitText(this.elements.staElement, {
                type: "lines",
                linesClass: "line",
            });

            gsap.set(this.elements.staElement, { opacity: 1 });

            const scrollTrigger = ScrollTrigger.create({
                trigger: this.elements.staElement,
                start: "top 50%",
                end: "bottom 90%",
                animation: gsap.from(split.lines, {
                    duration: lineDuration,
                    yPercent: 100,
                    opacity: 0,
                    stagger: lineStagger,
                    ease: "expo.out",
                }),
            });

            this.animations.set("lineAnimations", () => {
                scrollTrigger.kill();
                split.revert();
            });
        });
    }

    // Utility methods
    refresh() {
        ScrollTrigger.refresh();
    }

    destroy() {
        // Clean up all animations
        this.animations.forEach((cleanup) => cleanup());
        this.animations.clear();

        // Kill all ScrollTriggers
        ScrollTrigger.killAll();

        this.isInitialized = false;
    }

    // Responsive handling
    handleResize() {
        this.refresh();

        // Reinitialize cursor follower based on screen size
        if (window.innerWidth <= this.config.cursor.breakpoint) {
            const cursorCleanup = this.animations.get("cursor");
            if (cursorCleanup) {
                cursorCleanup();
                this.animations.delete("cursor");
            }
        } else if (!this.animations.has("cursor")) {
            this.initCursorFollower();
        }
    }
}

// Initialize when DOM is ready
let portfolioApp;

const init = () => {
    portfolioApp = new PortfolioAnimations();

    // Handle resize events
    let resizeTimeout;
    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                portfolioApp.handleResize();
            }, 250);
        },
        { passive: true }
    );
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
