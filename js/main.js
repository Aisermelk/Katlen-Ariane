/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Site institucional / Psicanálise

   Integração:
   Cloudflare Worker + KV

   API pública:
   https://katlen-admin.aisermelk.workers.dev/api/config
   ========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURAÇÃO DA API
   ========================================================= */

const CONFIG_API_URL =
    "https://katlen-admin.aisermelk.workers.dev/api/config";


/* =========================================================
   2. CONFIGURAÇÃO FALLBACK
   ========================================================= */

const FALLBACK_CONFIG = {

    site: {

        name:
            "Katlen Ariane",

        profession:
            "Psicanalista",

        registration:
            "CBPC 2022-6172",

        description:
            "",

        phone:
            "",

        whatsapp:
            "",

        email:
            "",

        address:
            ""
    },


    social: {

        instagram:
            "",

        facebook:
            "",

        tiktok:
            "",

        linkedin:
            ""
    },


    forms: {

        formspree:
            ""
    },


    tracking: {

        metaPixel:
            "",

        googleAnalytics:
            "",

        googleTagManager:
            "",

        metaPixelEnabled:
            false,

        googleAnalyticsEnabled:
            false,

        googleTagManagerEnabled:
            false
    },


    content: {

        formation:
            "",

        specialization:
            "",

        experience:
            "",

        neurodevelopment:
            ""
    },


    attendance: {

        families:
            true,

        women:
            true,

        children:
            true,

        adolescents:
            true
    }

};


/* =========================================================
   3. UTILITÁRIOS
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);
}


function setText(id, value) {

    const element =
        getElement(id);

    if (
        !element ||
        value === undefined ||
        value === null
    ) {

        return;
    }

    element.textContent =
        value;
}


function hideElement(element) {

    if (!element) {
        return;
    }

    element.style.display =
        "none";
}


function showElement(
    element,
    display = ""
) {

    if (!element) {
        return;
    }

    element.style.display =
        display;
}


/* =========================================================
   4. NORMALIZAÇÃO DA CONFIGURAÇÃO
   ========================================================= */

/*
 * O Worker utiliza uma estrutura organizada:
 *
 * site.whatsapp
 * site.address
 * social.instagram
 * tracking.metaPixel
 * etc.
 *
 * O restante do site recebe exatamente essa estrutura.
 */

function normalizeConfig(remoteConfig) {

    if (
        !remoteConfig ||
        typeof remoteConfig !== "object"
    ) {

        return structuredClone(
            FALLBACK_CONFIG
        );
    }


    return {

        site: {

            ...FALLBACK_CONFIG.site,

            ...(remoteConfig.site || {})
        },


        social: {

            ...FALLBACK_CONFIG.social,

            ...(remoteConfig.social || {})
        },


        forms: {

            ...FALLBACK_CONFIG.forms,

            ...(remoteConfig.forms || {})
        },


        tracking: {

            ...FALLBACK_CONFIG.tracking,

            ...(remoteConfig.tracking || {})
        },


        content: {

            ...FALLBACK_CONFIG.content,

            ...(remoteConfig.content || {})
        },


        attendance: {

            ...FALLBACK_CONFIG.attendance,

            ...(remoteConfig.attendance || {})
        }

    };
}


/* =========================================================
   5. CARREGAR CONFIGURAÇÃO DO WORKER
   ========================================================= */

async function loadConfig() {

    try {

        const response =
            await fetch(
                CONFIG_API_URL,
                {
                    method:
                        "GET",

                    mode:
                        "cors",

                    credentials:
                        "omit",

                    cache:
                        "no-store",

                    headers: {

                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            !contentType
                .toLowerCase()
                .includes(
                    "application/json"
                )
        ) {

            throw new Error(
                "O Worker não retornou JSON."
            );
        }


        const remoteConfig =
            await response.json();


        const config =
            normalizeConfig(
                remoteConfig
            );


        console.info(
            "Configuração carregada do Worker."
        );


        return config;


    } catch (error) {

        console.warn(
            "Não foi possível carregar a configuração do Worker.",
            error
        );


        console.warn(
            "URL utilizada:",
            CONFIG_API_URL
        );


        console.warn(
            "Utilizando configuração fallback."
        );


        return structuredClone(
            FALLBACK_CONFIG
        );
    }
}


/* =========================================================
   6. REGISTRO PROFISSIONAL
   ========================================================= */

function setupProfessionalRegistration(
    config
) {

    const container =
        getElement(
            "prof-reg-container"
        );


    const label =
        getElement(
            "reg-label"
        );


    const value =
        getElement(
            "reg-value"
        );


    if (!container) {
        return;
    }


    const registration =
        String(
            config.site.registration ||
            ""
        ).trim();


    if (!registration) {

        hideElement(
            container
        );

        return;
    }


    if (label) {

        label.textContent =
            "Registro profissional";
    }


    if (value) {

        value.textContent =
            registration;
    }


    showElement(
        container
    );
}


/* =========================================================
   7. RODAPÉ
   ========================================================= */

function setupFooter(config) {

    const whatsapp =
        String(
            config.site.whatsapp ||
            ""
        ).trim();


    const address =
        String(
            config.site.address ||
            ""
        ).trim();


    const registration =
        String(
            config.site.registration ||
            ""
        ).trim();


    const footerWhatsapp =
        getElement(
            "footer-whatsapp"
        );


    if (footerWhatsapp) {

        if (whatsapp) {

            footerWhatsapp.textContent =
                whatsapp;

            showElement(
                footerWhatsapp
            );


        } else {

            hideElement(
                footerWhatsapp
            );
        }
    }


    const footerAddress =
        getElement(
            "footer-address"
        );


    if (footerAddress) {

        if (address) {

            footerAddress.textContent =
                address;

            showElement(
                footerAddress
            );


        } else {

            hideElement(
                footerAddress
            );
        }
    }


    const footerRegistration =
        getElement(
            "footer-registration"
        );


    if (footerRegistration) {

        footerRegistration.textContent =
            registration ||
            "Psicanalista Clínica";
    }
}


/* =========================================================
   8. SOBRE / FORMAÇÃO
   ========================================================= */

function setupAbout(config) {

    const especializacao =
        String(
            config.content?.specialization ||
            ""
        ).trim();


    const experiencia =
        String(
            config.content?.experience ||
            ""
        ).trim();


    const neurodevelopment =
        String(
            config.content?.neurodevelopment ||
            ""
        ).trim();


    /* =====================================================
       FORMAÇÃO / SOBRE
       
       O conteúdo principal já está no index.html.
       Não sobrescrever com o Worker.
       ===================================================== */

    const aboutFormacao =
        getElement(
            "about-formacao"
        );


    if (aboutFormacao) {

        /*
         * Mantém o conteúdo original do HTML.
         *
         * Isso preserva:
         * - os 3 parágrafos
         * - <br><br>
         * - toda a formatação definida no index.html
         */
    }


    /* =====================================================
       ESPECIALIZAÇÕES
       ===================================================== */

    const aboutEspecializacoes =
        getElement(
            "about-especializacoes"
        );


    if (aboutEspecializacoes) {

        if (especializacao) {

            aboutEspecializacoes.textContent =
                especializacao;

            showElement(
                aboutEspecializacoes
            );

        } else {

            hideElement(
                aboutEspecializacoes
            );
        }
    }


    /* =====================================================
       EXPERIÊNCIA
       ===================================================== */

    const aboutExperiencia =
        getElement(
            "about-experiencia"
        );


    if (aboutExperiencia) {

        if (experiencia) {

            aboutExperiencia.textContent =
                experiencia;

            showElement(
                aboutExperiencia
            );

        } else {

            hideElement(
                aboutExperiencia
            );
        }
    }


    /* =====================================================
       NEURODESENVOLVIMENTO
       ===================================================== */

    const aboutNeuro =
        getElement(
            "about-neurodesenvolvimento"
        );


    if (aboutNeuro) {

        if (neurodevelopment) {

            aboutNeuro.textContent =
                neurodevelopment;

            showElement(
                aboutNeuro
            );

        } else {

            hideElement(
                aboutNeuro
            );
        }
    }
}

/* =========================================================
   9. WHATSAPP
   ========================================================= */

function normalizeWhatsAppNumber(
    number
) {

    return String(
        number || ""
    )
        .replace(/\D/g, "")
        .trim();
}


function createWhatsAppURL(
    number,
    message
) {

    const cleanNumber =
        normalizeWhatsAppNumber(
            number
        );


    if (!cleanNumber) {

        return "";
    }


    const encodedMessage =
        encodeURIComponent(
            message || ""
        );


    return (
        `https://wa.me/${cleanNumber}` +
        `?text=${encodedMessage}`
    );
}


function setupWhatsApp(config) {

    const whatsapp =
        config.site.whatsapp;


    const message =
        "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.";


    const whatsappURL =
        createWhatsAppURL(
            whatsapp,
            message
        );


    console.info(
        "WhatsApp configurado:",
        whatsapp
    );


    /* -----------------------------------------
       BOTÃO PRINCIPAL
    ----------------------------------------- */

    const whatsappLink =
        getElement(
            "whatsapp-link"
        );


    if (whatsappLink) {

        if (whatsappURL) {

            whatsappLink.href =
                whatsappURL;

            whatsappLink.target =
                "_blank";

            whatsappLink.rel =
                "noopener noreferrer";

            showElement(
                whatsappLink,
                "flex"
            );


        } else {

            hideElement(
                whatsappLink
            );
        }
    }


    /* -----------------------------------------
       DATA-WHATSAPP
    ----------------------------------------- */

    document
        .querySelectorAll(
            "[data-whatsapp]"
        )
        .forEach(
            element => {

                if (!whatsappURL) {

                    hideElement(
                        element
                    );

                    return;
                }


                element.href =
                    whatsappURL;


                element.target =
                    "_blank";


                element.rel =
                    "noopener noreferrer";


                showElement(
                    element
                );
            }
        );


    /* -----------------------------------------
       LINKS #WHATSAPP
    ----------------------------------------- */

    document
        .querySelectorAll(
            'a[href="#whatsapp"]'
        )
        .forEach(
            link => {

                if (!whatsappURL) {

                    return;
                }


                link.href =
                    whatsappURL;


                link.target =
                    "_blank";


                link.rel =
                    "noopener noreferrer";
            }
        );


    /* -----------------------------------------
       DATA-WHATSAPP-MESSAGE
       Permite mensagem personalizada
    ----------------------------------------- */

    document
        .querySelectorAll(
            "[data-whatsapp-message]"
        )
        .forEach(
            element => {

                if (!whatsapp) {

                    hideElement(
                        element
                    );

                    return;
                }


                const customMessage =
                    element.getAttribute(
                        "data-whatsapp-message"
                    ) ||
                    message;


                const customURL =
                    createWhatsAppURL(
                        whatsapp,
                        customMessage
                    );


                element.href =
                    customURL;


                element.target =
                    "_blank";


                element.rel =
                    "noopener noreferrer";


                showElement(
                    element
                );
            }
        );
}


/* =========================================================
   10. FORMSPREE
   ========================================================= */

function setupFormspree(config) {

    const form =
        getElement(
            "main-form"
        );


    if (!form) {
        return;
    }


    const configuredEndpoint =
        String(
            config.forms.formspree ||
            ""
        ).trim();


    if (!configuredEndpoint) {

        console.warn(
            "Formspree não configurado."
        );

        return;
    }


    let endpoint =
        configuredEndpoint;


    if (
        endpoint.startsWith(
            "http://"
        ) ||
        endpoint.startsWith(
            "https://"
        )
    ) {

        form.action =
            endpoint;


    } else {

        endpoint =
            endpoint
                .replace(
                    /^\/+/,
                    ""
                )
                .replace(
                    /^f\//,
                    ""
                );


        form.action =
            `https://formspree.io/f/${endpoint}`;
    }


    form.method =
        "POST";


    console.info(
        "Formspree configurado."
    );
}


/* =========================================================
   11. REDES SOCIAIS
   ========================================================= */

function setupSocialLinks(config) {

    const socialMap = {

        instagram:
            config.social.instagram,

        facebook:
            config.social.facebook,

        tiktok:
            config.social.tiktok,

        linkedin:
            config.social.linkedin
    };


    Object.entries(
        socialMap
    ).forEach(
        ([network, url]) => {

            const cleanURL =
                String(
                    url || ""
                ).trim();


            document
                .querySelectorAll(
                    `[data-social="${network}"]`
                )
                .forEach(
                    link => {

                        if (cleanURL) {

                            link.href =
                                cleanURL;

                            link.target =
                                "_blank";

                            link.rel =
                                "noopener noreferrer";

                            showElement(
                                link
                            );


                        } else {

                            hideElement(
                                link
                            );
                        }
                    }
                );
        }
    );


    /* -----------------------------------------
       COMPATIBILIDADE COM IDs ANTIGOS
    ----------------------------------------- */

    const legacyMap = {

        "instagram-link":
            config.social.instagram,

        "facebook-link":
            config.social.facebook,

        "tiktok-link":
            config.social.tiktok,

        "linkedin-link":
            config.social.linkedin
    };


    Object.entries(
        legacyMap
    ).forEach(
        ([id, url]) => {

            const link =
                getElement(id);


            if (!link) {
                return;
            }


            const cleanURL =
                String(
                    url || ""
                ).trim();


            if (cleanURL) {

                link.href =
                    cleanURL;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                showElement(
                    link
                );


            } else {

                hideElement(
                    link
                );
            }
        }
    );
}


/* =========================================================
   12. CONTATO
   ========================================================= */

function setupContactLinks(config) {

    const phone =
        String(
            config.site.phone ||
            config.site.whatsapp ||
            ""
        ).trim();


    const address =
        String(
            config.site.address ||
            ""
        ).trim();


    document
        .querySelectorAll(
            "[data-phone]"
        )
        .forEach(
            element => {

                if (!phone) {

                    hideElement(
                        element
                    );

                    return;
                }


                element.textContent =
                    phone;


                if (
                    element.tagName
                        .toLowerCase() ===
                    "a"
                ) {

                    const cleanPhone =
                        phone.replace(
                            /\D/g,
                            ""
                        );


                    if (cleanPhone) {

                        element.href =
                            `tel:+${cleanPhone}`;
                    }
                }


                showElement(
                    element
                );
            }
        );


    document
        .querySelectorAll(
            "[data-address]"
        )
        .forEach(
            element => {

                if (!address) {

                    hideElement(
                        element
                    );

                    return;
                }


                element.textContent =
                    address;


                showElement(
                    element
                );
            }
        );
}


/* =========================================================
   13. MENU MOBILE
   ========================================================= */

function setupMobileMenu() {

    const mobileMenu =
        getElement(
            "mobile-menu"
        );


    const nav =
        document.querySelector(
            ".nav-menu"
        );


    if (
        !mobileMenu ||
        !nav
    ) {

        return;
    }


    mobileMenu.setAttribute(
        "aria-expanded",
        "false"
    );


    mobileMenu.setAttribute(
        "aria-label",
        "Abrir menu"
    );


    mobileMenu.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle(
                    "active"
                );


            mobileMenu.classList.toggle(
                "open",
                isOpen
            );


            mobileMenu.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            mobileMenu.setAttribute(
                "aria-label",
                isOpen
                    ? "Fechar menu"
                    : "Abrir menu"
            );
        }
    );


    nav
        .querySelectorAll(
            "a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        nav.classList.remove(
                            "active"
                        );


                        mobileMenu.classList.remove(
                            "open"
                        );


                        mobileMenu.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        mobileMenu.setAttribute(
                            "aria-label",
                            "Abrir menu"
                        );
                    }
                );
            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                nav.classList.contains(
                    "active"
                )
            ) {

                nav.classList.remove(
                    "active"
                );


                mobileMenu.classList.remove(
                    "open"
                );


                mobileMenu.setAttribute(
                    "aria-expanded",
                    "false"
                );


                mobileMenu.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );
            }
        }
    );
}


/* =========================================================
   14. NAVEGAÇÃO SUAVE
   ========================================================= */

function setupSmoothNavigation() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;
                        }


                        if (
                            link.target ===
                            "_blank"
                        ) {

                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;
                        }


                        event.preventDefault();


                        const header =
                            document.querySelector(
                                ".site-header"
                            );


                        const headerHeight =
                            header
                                ? header.offsetHeight
                                : 0;


                        const targetPosition =
                            target
                                .getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight -
                            12;


                        window.scrollTo({

                            top:
                                targetPosition,

                            behavior:
                                "smooth"
                        });


                        history.pushState(
                            null,
                            "",
                            targetId
                        );
                    }
                );
            }
        );
}


/* =========================================================
   15. DEPOIMENTOS
   ========================================================= */

function setupTestimonials() {

    const section =
        getElement(
            "depoimentos"
        );


    if (!section) {
        return;
    }


    section.dataset.ready =
        "true";
}


/* =========================================================
   16. ANO AUTOMÁTICO
   ========================================================= */

function setupCurrentYear() {

    const year =
        new Date()
            .getFullYear();


    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(
            element => {

                element.textContent =
                    year;
            }
        );


    document
        .querySelectorAll(
            ".footer-bottom span"
        )
        .forEach(
            element => {

                element.innerHTML =
                    element.innerHTML.replace(
                        /©\s*\d{4}/,
                        `© ${year}`
                    );
            }
        );
}


/* =========================================================
   17. GOOGLE TAG MANAGER
   ========================================================= */

function injectGTM(config) {

    const enabled =
        Boolean(
            config.tracking
                .googleTagManagerEnabled
        );


    const gtmId =
        String(
            config.tracking
                .googleTagManager ||
            ""
        ).trim();


    if (
        !enabled ||
        !gtmId
    ) {

        return;
    }


    const existing =
        document.querySelector(
            `script[data-gtm="${gtmId}"]`
        );


    if (existing) {
        return;
    }


    window.dataLayer =
        window.dataLayer ||
        [];


    window.dataLayer.push({

        "gtm.start":
            new Date().getTime(),

        event:
            "gtm.js"
    });


    const script =
        document.createElement(
            "script"
        );


    script.async =
        true;


    script.dataset.gtm =
        gtmId;


    script.src =
        "https://www.googletagmanager.com/gtm.js?id=" +
        encodeURIComponent(
            gtmId
        );


    document.head.appendChild(
        script
    );


    console.info(
        "Google Tag Manager ativado:",
        gtmId
    );
}


/* =========================================================
   18. GOOGLE ANALYTICS
   ========================================================= */

function injectGA(config) {

    const enabled =
        Boolean(
            config.tracking
                .googleAnalyticsEnabled
        );


    const measurementId =
        String(
            config.tracking
                .googleAnalytics ||
            ""
        ).trim();


    if (
        !enabled ||
        !measurementId
    ) {

        return;
    }


    const existing =
        document.querySelector(
            `script[data-ga="${measurementId}"]`
        );


    if (existing) {
        return;
    }


    const script =
        document.createElement(
            "script"
        );


    script.async =
        true;


    script.dataset.ga =
        measurementId;


    script.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(
            measurementId
        );


    document.head.appendChild(
        script
    );


    window.dataLayer =
        window.dataLayer ||
        [];


    window.gtag =
        window.gtag ||
        function () {

            window.dataLayer.push(
                arguments
            );
        };


    window.gtag(
        "js",
        new Date()
    );


    window.gtag(
        "config",
        measurementId
    );


    console.info(
        "Google Analytics ativado:",
        measurementId
    );
}


/* =========================================================
   19. META PIXEL
   ========================================================= */

function injectMetaPixel(config) {

    const enabled =
        Boolean(
            config.tracking
                .metaPixelEnabled
        );


    const pixelId =
        String(
            config.tracking
                .metaPixel ||
            ""
        ).trim();


    if (
        !enabled ||
        !pixelId
    ) {

        return;
    }


    if (
        window.fbq
    ) {

        return;
    }


    window.fbq =
        function () {

            if (
                window.fbq.callMethod
            ) {

                window.fbq.callMethod.apply(
                    window.fbq,
                    arguments
                );


            } else {

                window.fbq.queue.push(
                    arguments
                );
            }
        };


    window.fbq.push =
        window.fbq;


    window.fbq.loaded =
        true;


    window.fbq.version =
        "2.0";


    window.fbq.queue =
        [];


    window._fbq =
        window.fbq;


    const script =
        document.createElement(
            "script"
        );


    script.async =
        true;


    script.dataset.metaPixel =
        pixelId;


    script.src =
        "https://connect.facebook.net/en_US/fbevents.js";


    document.head.appendChild(
        script
    );


    window.fbq(
        "init",
        pixelId
    );


    window.fbq(
        "track",
        "PageView"
    );


    console.info(
        "Meta Pixel ativado:",
        pixelId
    );
}


/* =========================================================
   20. TRACKING
   ========================================================= */

function injectTrackingScripts(
    config
) {

    injectGTM(
        config
    );


    injectGA(
        config
    );


    injectMetaPixel(
        config
    );
}


/* =========================================================
   21. ELEMENTOS DINÂMICOS
   ========================================================= */

function removeEmptyDynamicElements() {

    document
        .querySelectorAll(
            "[data-dynamic]"
        )
        .forEach(
            element => {

                const text =
                    element.textContent
                        .trim();


                if (!text) {

                    hideElement(
                        element
                    );
                }
            }
        );
}


/* =========================================================
   22. INICIALIZAÇÃO
   ========================================================= */

async function initSite() {

    try {

        console.info(
            "Katlen Ariane — iniciando..."
        );


        const config =
            await loadConfig();


        /* -----------------------------------------
           CONTEÚDO
        ----------------------------------------- */

        setupProfessionalRegistration(
            config
        );


        setupAbout(
            config
        );


        /* -----------------------------------------
           WHATSAPP
        ----------------------------------------- */

        setupWhatsApp(
            config
        );


        /* -----------------------------------------
           FORMULÁRIO
        ----------------------------------------- */

        setupFormspree(
            config
        );


        /* -----------------------------------------
           REDES
        ----------------------------------------- */

        setupSocialLinks(
            config
        );


        /* -----------------------------------------
           CONTATO
        ----------------------------------------- */

        setupFooter(
            config
        );


        setupContactLinks(
            config
        );


        /* -----------------------------------------
           INTERFACE
        ----------------------------------------- */

        setupTestimonials();


        setupMobileMenu();


        setupSmoothNavigation();


        setupCurrentYear();


        removeEmptyDynamicElements();


        /* -----------------------------------------
           TRACKING
        ----------------------------------------- */

        injectTrackingScripts(
            config
        );


        /* -----------------------------------------
           STATUS
        ----------------------------------------- */

        document.documentElement
            .classList.add(
                "js-ready"
            );


        document.body
            .classList.add(
                "site-ready"
            );


        console.info(
            "Katlen Ariane — site inicializado."
        );


    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );
    }
}


/* =========================================================
   23. DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initSite
    );


} else {

    initSite();
}


/* =========================================================
   24. PAGESHOW
   ========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        const nav =
            document.querySelector(
                ".nav-menu"
            );


        const mobileMenu =
            getElement(
                "mobile-menu"
            );


        if (
            !nav ||
            !mobileMenu
        ) {

            return;
        }


        nav.classList.remove(
            "active"
        );


        mobileMenu.classList.remove(
            "open"
        );


        mobileMenu.setAttribute(
            "aria-expanded",
            "false"
        );


        mobileMenu.setAttribute(
            "aria-label",
            "Abrir menu"
        );
    }
);


/* =========================================================
   FIM DO MAIN.JS
   ========================================================= */
