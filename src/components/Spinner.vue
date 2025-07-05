<script setup>
import jafarkhansmall from "../assets/images/jafarkhanmini.avif";
import { ref, onMounted } from "vue";
const textElement = ref(null);

onMounted(() => {
    const text = textElement.value;
    if (text) {
        const dataAttr =
            text.getAttribute("data-v-12345") ||
            text.getAttributeNames().find((name) => name.startsWith("data-v-"));
        const dataValue = text.getAttribute(dataAttr);
        text.innerHTML = text.innerText
            .split("")
            .map(
                (char, i) =>
                    `<span ${dataAttr}="${dataValue}" style="transform:rotate(${
                        i * 12.3
                    }deg)">${char}</span>`
            )
            .join("");
    }
});
</script>

<template>
    <div class="circle">
        <div class="logo"></div>
        <div class="text" ref="textElement">
            <p>Get in touch . Get in touch .</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    pointer-events: all;
    color: black;

    .circle {
        --size: 200px;
        position: relative;
        width: var(--size);
        height: var(--size);
        border-radius: 100vmax;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo {
            position: absolute;
            width: 140px;
            height: 140px;
            background: url("../assets/images/jafarkhancircle.avif");
            background-size: cover;
            border-radius: 100vmax;
            background-position: 10% 0%;
            background-color: var(--color-bg-white);
        }
        .text {
            position: absolute;
            width: 100%;
            height: 100%;
            color: var(--color-text-white);
            font-size: 15px;
            text-transform: uppercase;
            font-weight: 700;
            animation: textRotation 12s linear infinite;

            span {
                position: absolute;
                left: 50%;
                transform-origin: 0 100px;
            }
        }
    }

    @keyframes textRotation {
        to {
            transform: rotate(360deg);
        }
    }
}
</style>
