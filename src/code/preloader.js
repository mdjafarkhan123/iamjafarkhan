import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);
let intro = document.querySelector(".intro");
const introBg = document.querySelector(".intro .intro__wrapper");
const logo = document.querySelector(".intro .logo");
const logoIcon = document.querySelector(".intro .logo__icon");
const logoText = document.querySelector(".intro .logo__text");
const logoBorder = document.querySelector(".intro .logo__border");
const header = document.querySelector(".header");
const headerLogo = document.querySelector(".header .logo");
const headerButton = document.querySelector(".header__action");
const headerMenu = document.querySelector(".header__toggler");

function preloader() {
    gsap.set([headerLogo, headerButton, headerMenu], {
        autoAlpha: 0,
    });
    gsap.set("body", { className: "no-scroll" });

    gsap.set([logoText, logo], {
        autoAlpha: 1,
    });
    document.fonts.ready.then(() => {
        let tl = gsap.timeline({
            onComplete: () => {
                intro.style.display = "none";
                document.body.classList.remove("no-scroll");
                split.revert();
            },
        });
        let split = SplitText.create(logoText, {
            type: "chars",
        });
        tl.to(logoIcon, {
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
            .to(
                header,
                {
                    autoAlpha: 1,
                },
                "<"
            )
            .to(
                [headerButton, headerMenu],
                {
                    autoAlpha: 1,
                },
                "<0.5"
            )
            .to(headerLogo, {
                autoAlpha: 1,
                duration: 0,
            })
            .to(
                introBg,
                {
                    autoAlpha: 0,
                },
                "<"
            );
    });
}

preloader();
