import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
document.addEventListener("DOMContentLoaded", () => {
    function slider() {
        new Swiper(".swiper", {
            modules: [Autoplay],
            loop: true,
            slidesPerView: "auto",
            spaceBetween: 40,
            centeredSlides: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                reverseDirection: true,
            },
            speed: 5000,
            allowTouchMove: false,
            freeMode: true,
        });
    }

    slider();

    function textanimmation() {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".split-word").forEach((element) => {
            const text = new SplitType(element, { types: "words" });
            const scrollConfig = {
                trigger: element,
                start: "top 80%",
                end: "top 20%",
                scrub: true,
                toggleActions: "play play reverse reverse",
            };

            gsap.fromTo(
                element.querySelectorAll("div.word"),
                { opacity: 0.3 },

                {
                    opacity: 1,
                    duration: 0.3,

                    stagger: 0.02,
                    scrollTrigger: scrollConfig,
                }
            );
        });
    }

    textanimmation();
});
