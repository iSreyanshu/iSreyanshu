<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { gsap } from 'gsap';
import { faGithub, faInstagram, faLinkedinIn, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type SocialLink = { name: string; slug: string; destination: string; icon: IconDefinition; hover: string; };

const socialLinks: SocialLink[] = [
  { name: 'GitHub', slug: 'github', destination: 'https://github.com/iSreyanshu', icon: faGithub, hover: 'hover:text-gray-400' },
  { name: 'X', slug: 'x', destination: 'https://x.com/iSreyanshu', icon: faXTwitter, hover: 'hover:text-gray-400' },
  { name: 'Instagram', slug: 'instagram', destination: 'about:blank', icon: faInstagram, hover: 'hover:text-pink-500' },
  { name: 'LinkedIn', slug: 'linkedin', destination: 'about:blank', icon: faLinkedinIn, hover: 'hover:text-blue-600' },
  { name: 'Telegram', slug: 'telegram', destination: 'https://telegram.me/iSreyanshu', icon: faTelegram, hover: 'hover:text-blue-500' },
  { name: 'Gmail', slug: 'gmail', destination: 'mailto:me@custra.xyz', icon: faEnvelope, hover: 'hover:text-sky-400' }
];

const backgroundImage = '/bg.wood.png';
const profileImage = '/img.konan.png';
const currentYear = new Date().getFullYear();
const redirectMessage = ref('');
let redirectTimer: number | undefined;
let pageAnimation: ReturnType<typeof gsap.context> | undefined;

onMounted(() => {
  const match = window.location.pathname.match(/^\/u:([^/]+)$/i);
  if (!match) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const home = document.getElementById('home');
    if (!home) return;

    pageAnimation = gsap.context(() => {
      gsap.from('#about > div, #about > h1, #about > p, footer .social-link', {
        y: 18,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility'
      });
    }, home);
    return;
  }

  const social = socialLinks.find((link) => link.slug === decodeURIComponent(match[1]).toLowerCase());
  redirectMessage.value = social ? `Redirecting to ${social.name}...` : '404 | Not Found';

  if (social) { redirectTimer = window.setTimeout(() => window.location.assign(social.destination), 2000); }
});

onBeforeUnmount(() => {
  pageAnimation?.revert();
  if (redirectTimer !== undefined) window.clearTimeout(redirectTimer);
});
</script>

<template>
  <div id="home" class="page-shell relative flex h-dvh flex-col overflow-hidden" >
    <img
      class="page-background image-protected absolute inset-0 z-0 h-full w-full object-cover blur-sm brightness-50"
      :src="backgroundImage"
      alt="Abstract background"
      aria-hidden="true"
      draggable="false"
      @contextmenu.prevent
      @dragstart.prevent
    />

    <main v-if="redirectMessage" class="relative z-10 flex flex-grow items-center justify-center px-4 text-center">
      <h1 class="font-libre-caslon text-xl sm:text-2xl">{{ redirectMessage }}</h1>
    </main>

    <template v-else>
      <main id="about" class="relative z-10 mx-auto flex w-full min-w-0 max-w-3xl flex-grow flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
        <div class="mb-5 mt-4 h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-white/40">
          <img
            :src="profileImage"
            alt="Sreyanshu's profile"
            class="image-protected h-full w-full object-cover"
            draggable="false"
            @contextmenu.prevent
            @dragstart.prevent
          />
        </div>
        <h1 class="font-satisfy mb-3 max-w-full break-words text-3xl font-normal sm:text-4xl">
          Hey, I'm Sreyanshu
        </h1>
        <p class="mb-5 text-lg">Craftsman | Anime Lover | Explorer</p>
        <p class="profile-copy mb-7 w-full max-w-[65ch] select-none break-words text-base leading-relaxed text-gray-300">
          I craft modern web applications and develop RESTful APIs and other API integrations to
          create seamless digital experiences. I enjoy working with modern technologies, designing
          clean and intuitive interfaces and building scalable, efficient backend systems. From
          responsive websites to powerful APIs, I love turning ideas into practical solutions. When
          I'm not coding, you'll find me exploring anime or discovering new technologies.
        </p>
        <p class="profile-quote max-w-xl select-none text-base italic text-gray-400">
          “In love with code, driven by curiosity and passionate about building things that make a difference.”
        </p>
      </main>

      <footer class="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 pt-5 pb-7 sm:px-6">
        <nav class="flex items-center justify-center gap-6" aria-label="Social links">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="`/u:${social.slug}`"
            :aria-label="social.name"
            class="social-link text-lg text-white transition-colors"
            :class="social.hover"
          >
            <FontAwesomeIcon :icon="social.icon" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </template>

  </div>
</template>
