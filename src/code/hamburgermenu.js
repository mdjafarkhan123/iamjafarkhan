import { gsap } from "gsap";

// Configuration constants
const ANIMATION_CONFIG = {
    LERP_OPEN: { y: 0.099, c: 0.125 },
    LERP_CLOSE_DESKTOP: { y: 0.033, c: 0.041 },
    LERP_CLOSE_MOBILE: { y: 0.099, c: 0.125 },
    COLOR_DURATION: 0.5,
    STAGGER_DELAY: 0.1,
    ANIMATION_THRESHOLD: 0.01,
};

class MenuController {
    constructor() {
        this.isOpen = false;
        this.isAnimating = false;
        this.timeline = null;
        this.animationFrame = null;
        this.y = 100;
        this.c = 100;
        this.largeScreen = window.matchMedia("(min-width: 1024px)");
        this.prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        this.init();
    }

    init() {
        if (!this.cacheElements()) {
            console.warn("Menu: Required elements not found");
            return;
        }
        this.setupInitialState();
        this.bindEvents();
    }

    cacheElements() {
        this.elements = {
            path: document.querySelector(".header__menu .path"),
            body: document.body,
            logoText: document.querySelector(".logo__text"),
            menuToggle: document.querySelector(".header__toggler"),
            menuWrapper: document.querySelector(".header__menu"),
            ul: document.querySelector(".header__menu-list"),
            cta: document.querySelector(".header__action"),
        };

        // Cache menu lines and items
        if (this.elements.menuToggle) {
            this.elements.menuIconOne =
                this.elements.menuToggle.querySelector(".line-1");
            this.elements.menuIconTwo =
                this.elements.menuToggle.querySelector(".line-2");
        }

        if (this.elements.ul) {
            this.elements.menuItems =
                this.elements.ul.querySelectorAll(".header__menu-item");
        }

        // Check if critical elements exist
        return (
            this.elements.path &&
            this.elements.menuToggle &&
            this.elements.logoText
        );
    }

    setupInitialState() {
        this.elements.menuWrapper.style.pointerEvents = "none";

        // Set initial ARIA attributes
        this.elements.menuToggle.setAttribute("aria-expanded", "false");
        this.elements.menuWrapper.setAttribute("aria-hidden", "true");
    }

    bindEvents() {
        this.elements.menuToggle.addEventListener("click", () => this.toggle());
    }

    toggle() {
        if (this.isAnimating) return;

        this.isOpen = !this.isOpen;
        this.isAnimating = true;

        // Update ARIA attributes
        this.elements.menuToggle.setAttribute(
            "aria-expanded",
            this.isOpen.toString()
        );
        this.elements.menuWrapper.setAttribute(
            "aria-hidden",
            (!this.isOpen).toString()
        );

        // Kill any existing animations
        this.killCurrentAnimations();

        // Start path animation
        this.startPathAnimation();

        // Create timeline based on state
        this.isOpen ? this.openMenu() : this.closeMenu();
    }

    killCurrentAnimations() {
        if (this.timeline) {
            this.timeline.kill();
        }
        gsap.killTweensOf(this.elements.logoText);
        cancelAnimationFrame(this.animationFrame);
    }

    openMenu() {
        const duration = this.prefersReducedMotion.matches
            ? 0.1
            : ANIMATION_CONFIG.COLOR_DURATION;

        this.timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
            },
        });

        this.timeline
            .set([this.elements.menuIconOne, this.elements.menuIconTwo], {
                transformOrigin: "50%, 50%",
            })
            .set(this.elements.menuIconOne, {
                rotate: 45,
                y: 0,
            })
            .set(this.elements.menuIconTwo, {
                rotate: -45,
                y: 0,
            })
            .set(this.elements.body, {
                onComplete: () => {
                    this.elements.body.classList.add("no-scroll");
                },
            })
            .set(this.elements.ul, { display: "block" })
            .set(this.elements.menuWrapper, { pointerEvents: "all" })
            .set(this.elements.menuItems, { autoAlpha: 0, y: 50 })
            .set(
                this.elements.cta,
                {
                    onComplete: () => {
                        this.elements.cta.classList.add("hidden");
                    },
                },
                0.5
            )
            .to(
                this.elements.logoText,
                {
                    color: "var(--color-text-dark)",
                    duration: duration,
                },
                "<"
            )
            .to(
                this.elements.menuItems,
                {
                    autoAlpha: 1,
                    y: 0,
                    stagger: this.prefersReducedMotion.matches
                        ? 0
                        : ANIMATION_CONFIG.STAGGER_DELAY,
                    duration: duration,
                },
                "<"
            );
    }

    closeMenu() {
        this.timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
            },
        });

        this.timeline
            .set([this.elements.menuIconOne, this.elements.menuIconTwo], {
                transformOrigin: "50%, 50%",
            })
            .set(this.elements.menuIconOne, {
                rotate: 0,
                y: -3,
            })
            .set(this.elements.menuIconTwo, {
                rotate: 0,
                y: 3,
            })
            .set(this.elements.menuWrapper, {
                pointerEvents: "none",
            })
            .set(this.elements.ul, { display: "none" })
            .set(this.elements.logoText, { color: "var(--color-text-white)" })
            .set(this.elements.menuItems, { autoAlpha: 0, y: 50 })
            .set(this.elements.cta, {
                onComplete: () => {
                    this.elements.body.classList.remove("no-scroll");
                    this.elements.cta.classList.remove("hidden");
                },
            });
    }

    startPathAnimation() {
        this.animatePathFrame();
    }

    animatePathFrame() {
        const targetY = this.isOpen ? 0 : 100;
        const targetC = this.isOpen ? 0 : 100;

        // Get lerp speeds based on state and screen size
        const speeds = this.getLerpSpeeds();

        this.y = this.lerp(this.y, targetY, speeds.y);
        this.c = this.lerp(this.c, targetC, speeds.c);

        // Update path
        this.updatePath();

        // Check if animation should continue
        if (this.shouldContinueAnimation(targetY, targetC)) {
            this.animationFrame = requestAnimationFrame(() =>
                this.animatePathFrame()
            );
        } else {
            // Snap to final values
            this.y = targetY;
            this.c = targetC;
            this.updatePath();
            cancelAnimationFrame(this.animationFrame);
        }
    }

    getLerpSpeeds() {
        if (this.isOpen) {
            return ANIMATION_CONFIG.LERP_OPEN;
        } else {
            return this.largeScreen.matches
                ? ANIMATION_CONFIG.LERP_CLOSE_DESKTOP
                : ANIMATION_CONFIG.LERP_CLOSE_MOBILE;
        }
    }

    shouldContinueAnimation(targetY, targetC) {
        const yDiff = Math.abs(this.y - targetY);
        const cDiff = Math.abs(this.c - targetC);
        return (
            yDiff > ANIMATION_CONFIG.ANIMATION_THRESHOLD ||
            cDiff > ANIMATION_CONFIG.ANIMATION_THRESHOLD
        );
    }

    updatePath() {
        this.elements.path.setAttribute(
            "d",
            `M 0 ${this.y} L 0 100 100 100 100 ${this.y} C 50 ${this.c}, 50 ${this.c}, 0 ${this.y}`
        );
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Public methods for external control
    open() {
        if (!this.isOpen) {
            this.toggle();
        }
    }

    close() {
        if (this.isOpen) {
            this.toggle();
        }
    }

    destroy() {
        this.killCurrentAnimations();
        this.elements.menuToggle.removeEventListener("click", this.toggle);
    }
}

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    const menuController = new MenuController();

    // Optional: Make it globally accessible for debugging/external control
    window.menuController = menuController;
});
