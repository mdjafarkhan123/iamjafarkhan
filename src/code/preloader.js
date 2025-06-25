let intro = document.querySelector(".intro");
let introText = document.querySelector(".intro .intro__text");
let introSpan = document.querySelectorAll(".intro__text span");
setTimeout(() => {
    introSpan.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("active");
        }, (index + 1) * 600);
    });

    setTimeout(() => {
        introSpan.forEach((span, index) => {
            setTimeout(() => {
                span.classList.remove("active");
                span.classList.add("fadeOut");
            }, (index + 1) * 400);
        });
    }, 2000);
}, 0);

setTimeout(() => {
    intro.style.top = "-100vh";
}, 3700);
