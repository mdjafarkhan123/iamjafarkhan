import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function preloader() {
    const intro = document.querySelector(".intro");
    if (!intro) return;

    const introBg = document.querySelector(".intro .intro__wrapper");
    const logo = document.querySelector(".intro .logo");
    const logoIcon = document.querySelector(".intro .logo__icon");
    const logoText = document.querySelector(".intro .logo__text");
    const logoBorder = document.querySelector(".intro .logo__border");
    const header = document.querySelector(".header");
    const headerLogo = document.querySelector(".header .logo");
    const headerButton = document.querySelector(".header__action");
    const headerMenu = document.querySelector(".header__toggler");

    // Early exit if required elements missing
    if (!logoText || !headerLogo) return;

    gsap.set([headerLogo, headerButton, headerMenu], { autoAlpha: 0 });
    gsap.set("body", { className: "no-scroll" });

    document.fonts.ready.then(() => {
        let split;
        let tl;

        // Cache target position for performance
        const logoRect = logo.getBoundingClientRect();
        const targetRect = headerLogo.getBoundingClientRect();

        // Create split before timeline
        split = SplitText.create(logoText, { type: "chars" });

        tl = gsap.timeline({
            onComplete: () => {
                intro.style.display = "none";
                document.body.classList.remove("no-scroll");
                if (split && typeof split.revert === "function") {
                    split.revert();
                }
            },
        });

        tl.to([logo, logoText], { autoAlpha: 1 })
            .to(logoIcon, {
                autoAlpha: 1,
                scale: 1,
                duration: 1,
            })
            .to(split.chars, {
                autoAlpha: 1,
                x: 0,
                stagger: 0.05,
            })
            .to(logoBorder, {
                strokeDashoffset: 0,
                duration: 1,
            })
            .to(logo, {
                left: () => {
                    return headerLogo.getBoundingClientRect().left;
                },
                top: () => {
                    return headerLogo.getBoundingClientRect().top;
                },
                xPercent: 0,
                yPercent: 0,
                duration: 1,
            })
            .to(header, { autoAlpha: 1 }, "<")
            .to([headerButton, headerMenu], { autoAlpha: 1 }, "<0.5")
            .set(headerLogo, { autoAlpha: 1 }) // Use .set() for instant
            .to(introBg, { autoAlpha: 0 }, "<");
    });
}

preloader();
