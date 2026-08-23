// URL do Worker que serve o admin universal.
// Troque pelo endereço real depois do deploy (ex: "https://katlen-admin.SEU-USUARIO.workers.dev").
const CONFIG_API_URL = "https://katlen-admin.example.workers.dev/api/config";

// Config local usada apenas se o Worker estiver indisponível (modo offline / antes do deploy).
const FALLBACK_CONFIG = {
    whatsapp: "",
    formspreeEndpoint: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
    metaPixelId: "",
    gaMeasurementId: "",
    gtmId: "",
    trackingEnabled: { pixel: false, ga: false, gtm: false },
    professionalRegistrationLabel: "Registro profissional",
    professionalRegistration: "0000000",
    formacao: "",
    especializacoes: "",
    experiencia: ""
};

async function loadConfig() {
    try {
        const res = await fetch(CONFIG_API_URL, { credentials: "omit" });
        if (!res.ok) throw new Error("config indisponível");
        return await res.json();
    } catch (err) {
        console.warn("Não foi possível carregar config do admin, usando fallback local.", err);
        return FALLBACK_CONFIG;
    }
}

function injectTrackingScripts(config) {
    if (config.trackingEnabled?.gtm && config.gtmId) {
        const s = document.createElement("script");
        s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtmId}');`;
        document.head.appendChild(s);
    }
    if (config.trackingEnabled?.ga && config.gaMeasurementId) {
        const s1 = document.createElement("script");
        s1.async = true;
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
        document.head.appendChild(s1);
        const s2 = document.createElement("script");
        s2.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${config.gaMeasurementId}');`;
        document.head.appendChild(s2);
    }
    if (config.trackingEnabled?.pixel && config.metaPixelId) {
        const s = document.createElement("script");
        s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${config.metaPixelId}');fbq('track', 'PageView');`;
        document.head.appendChild(s);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const config = await loadConfig();

    // Registro profissional
    const regLabel = document.getElementById("reg-label");
    const regValue = document.getElementById("reg-value");
    if (config.professionalRegistration) {
        regLabel.textContent = config.professionalRegistrationLabel || "Registro profissional";
        regValue.textContent = config.professionalRegistration;
    } else {
        document.getElementById("prof-reg-container").style.display = "none";
    }

    // Botão WhatsApp
    const whatsappLink = document.getElementById("whatsapp-link");
    if (config.whatsapp) {
        whatsappLink.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.")}`;
        whatsappLink.style.display = "flex";
    }

    // Formulário Formspree
    const form = document.getElementById("main-form");
    if (config.formspreeEndpoint) {
        form.action = `https://formspree.io/f/${config.formspreeEndpoint}`;
    }

    // Tracking (Pixel / GA / GTM)
    injectTrackingScripts(config);

    // Menu mobile
    const mobileMenu = document.getElementById("mobile-menu");
    const nav = document.querySelector(".nav-menu");
    mobileMenu.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");
        mobileMenu.classList.toggle("open");
        mobileMenu.setAttribute("aria-expanded", String(isOpen));
    });
});
