/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Site institucional / Psicanálise
   ========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURAÇÃO DO WORKER
   ========================================================= */

/*
 * O site e o Worker trabalham no mesmo domínio.
 *
 * Público:
 *   GET /api/config
 *
 * Administrativo:
 *   /api/admin/config
 *
 * Não coloque aqui senha, token ou qualquer Secret.
 */

const CONFIG_API_URL = "/api/config";


/* =========================================================
   2. CONFIGURAÇÃO FALLBACK
   ========================================================= */

const FALLBACK_CONFIG = {

    whatsapp: "",

    endereco: "",

    formspreeEndpoint: "",


    instagram: "",

    facebook: "",

    tiktok: "",

    linkedin: "",


    metaPixelId: "",

    gaMeasurementId: "",

    gtmId: "",


    trackingEnabled: {

        pixel: false,

        ga: false,

        gtm: false
    },


    professionalRegistrationLabel:
        "Registro profissional",

    professionalRegistration:
        "CBPC 2022-6172",


    formacao: "",

    especializacoes: "",

    experiencia: ""
};


/* =========================================================
   3. CARREGAR CONFIGURAÇÃO
   ========================================================= */

async function loadConfig() {

    try {

        const response =
            await fetch(
                CONFIG_API_URL,
                {
                    method: "GET",

                    credentials: "omit",

                    cache: "no-store",

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


        const remoteConfig =
            await response.json();


        return {

            ...FALLBACK_CONFIG,

            ...remoteConfig,

            trackingEnabled: {

                ...FALLBACK_CONFIG.trackingEnabled,

                ...(remoteConfig.trackingEnabled || {})
            }
        };


    } catch (error) {

        console.warn(
            "Não foi possível carregar a configuração do Admin.",
            error
        );


        console.warn(
            "O site continuará utilizando a configuração local."
        );


        return {
            ...FALLBACK_CONFIG
        };
    }
}


/* =========================================================
   4. HELPERS
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


function setDisplay(
    id,
    display = "block"
) {

    const element =
        getElement(id);


    if (!element) {
        return;
    }


    element.style.display =
        display;
}


function hideElement(id) {

    const element =
        getElement(id);


    if (!element) {
        return;
    }


    element.style.display =
        "none";
}


/* =========================================================
   5. REGISTRO PROFISSIONAL
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


    if (
        config.professionalRegistration
    ) {

        if (label) {

            label.textContent =
                config.professionalRegistrationLabel ||
                "Registro profissional";
        }


        if (value) {

            value.textContent =
                config.professionalRegistration;
        }


        container.style.display = "";


    } else {

        container.style.display =
            "none";
    }
}


/* =========================================================
   6. RODAPÉ
   ========================================================= */

function setupFooter(config) {

    /*
     * WhatsApp
     */

    const footerWhatsapp =
        getElement(
            "footer-whatsapp"
        );


    if (footerWhatsapp) {

        if (config.whatsapp) {

            footerWhatsapp.textContent =
                config.whatsapp;

        } else {

            footerWhatsapp.style.display =
                "none";
        }
    }


    /*
     * Endereço
     */

    const footerAddress =
        getElement(
            "footer-address"
        );


    if (footerAddress) {

        if (config.endereco) {

            footerAddress.textContent =
                config.endereco;

            footerAddress.style.display =
                "";

        } else {

            footerAddress.style.display =
                "none";
        }
    }


    /*
     * Registro profissional
     */

    const footerRegistration =
        getElement(
            "footer-registration"
        );


    if (footerRegistration) {

        if (
            config.professionalRegistration
        ) {

            footerRegistration.textContent =
                config.professionalRegistration;

        } else {

            footerRegistration.textContent =
                "Psicanalista Clínica";
        }
    }
}


/* =========================================================
   7. SOBRE / FORMAÇÃO
   ========================================================= */

function setupAbout(config) {

    const aboutFormacao =
        getElement(
            "about-formacao"
        );


    if (aboutFormacao) {

        if (config.formacao) {

            aboutFormacao.textContent =
                config.formacao;

        } else {

            aboutFormacao.textContent =
                "Psicanalista dedicada a construir um espaço de escuta e reflexão, respeitando a singularidade de cada pessoa e de cada história.";
        }
    }


    const aboutEspecializacoes =
        getElement(
            "about-especializacoes"
        );


    if (aboutEspecializacoes) {

        if (config.especializacoes) {

            aboutEspecializacoes.textContent =
                config.especializacoes;

            aboutEspecializacoes.style.display =
                "";

        } else {

            aboutEspecializacoes.style.display =
                "none";
        }
    }


    const aboutExperiencia =
        getElement(
            "about-experiencia"
        );


    if (aboutExperiencia) {

        if (config.experiencia) {

            aboutExperiencia.textContent =
                config.experiencia;

            aboutExperiencia.style.display =
                "";

        } else {

            aboutExperiencia.style.display =
                "none";
        }
    }
}


/* =========================================================
   8. WHATSAPP
   ========================================================= */

function createWhatsAppURL(
    number,
    message
) {

    if (!number) {
        return "";
    }


    const cleanNumber =
        String(number)
            .replace(/\D/g, "");


    if (!cleanNumber) {
        return "";
    }


    return (
        `https://wa.me/${cleanNumber}` +
        `?text=${encodeURIComponent(message)}`
    );
}


function setupWhatsApp(config) {

    const message =
        "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.";


    const whatsappURL =
        createWhatsAppURL(
            config.whatsapp,
            message
        );


    /*
     * Botão flutuante
     */

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

            whatsappLink.style.display =
                "flex";


        } else {

            whatsappLink.style.display =
                "none";
        }
    }


    /*
     * Links com data-whatsapp
     */

    document
        .querySelectorAll(
            "[data-whatsapp]"
        )
        .forEach(element => {

            if (!whatsappURL) {

                element.style.display =
                    "none";

                return;
            }


            element.href =
                whatsappURL;

            element.target =
                "_blank";

            element.rel =
                "noopener noreferrer";

            element.style.display =
                "";
        });


    /*
     * Links com href="#whatsapp"
     */

    document
        .querySelectorAll(
            'a[href="#whatsapp"]'
        )
        .forEach(link => {

            if (!whatsappURL) {
                return;
            }


            link.href =
                whatsappURL;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";
        });
}


/* =========================================================
   9. FORMSPREE
   ========================================================= */

function setupFormspree(config) {

    const form =
        getElement(
            "main-form"
        );


    if (!form) {
        return;
    }


    if (!config.formspreeEndpoint) {

        console.warn(
            "Formspree não configurado no painel administrativo."
        );

        return;
    }


    let endpoint =
        String(
            config.formspreeEndpoint
        ).trim();


    /*
     * Permite:
     *
     * abc123
     *
     * f/abc123
     *
     * https://formspree.io/f/abc123
     */

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
                .replace(/^\/+/, "")
                .replace(/^f\//, "");


        form.action =
            `https://formspree.io/f/${endpoint}`;
    }


    form.method =
        "POST";
}


/* =========================================================
   10. REDES SOCIAIS
   ========================================================= */

function setupSocialLinks(config) {

    const socialMap = {

        instagram:
            config.instagram,

        facebook:
            config.facebook,

        tiktok:
            config.tiktok,

        linkedin:
            config.linkedin
    };


    /*
     * Suporte a:
     *
     * data-social="instagram"
     */

    Object.entries(
        socialMap
    ).forEach(
        ([network, url]) => {

            document
                .querySelectorAll(
                    `[data-social="${network}"]`
                )
                .forEach(link => {

                    if (url) {

                        link.href =
                            url;

                        link.target =
                            "_blank";

                        link.rel =
                            "noopener noreferrer";

                        link.style.display =
                            "";


                    } else {

                        link.style.display =
                            "none";
                    }
                });
        }
    );


    /*
     * Suporte aos IDs
     * utilizados no index atual.
     */

    const legacyMap = {

        "instagram-link":
            config.instagram,

        "facebook-link":
            config.facebook,

        "tiktok-link":
            config.tiktok,

        "linkedin-link":
            config.linkedin
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


            if (url) {

                link.href =
                    url;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                link.style.display =
                    "";


            } else {

                link.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   11. CONTATO
   ========================================================= */

function setupContactLinks(config) {

    /*
     * Elementos com data-phone
     */

    document
        .querySelectorAll(
            "[data-phone]"
        )
        .forEach(element => {

            if (!config.whatsapp) {

                element.style.display =
                    "none";

                return;
            }


            const number =
                String(
                    config.whatsapp
                ).replace(/\D/g, "");


            element.textContent =
                config.whatsapp;


            if (
                element.tagName.toLowerCase()
                === "a"
            ) {

                element.href =
                    `tel:+${number}`;
            }
        });


    /*
     * Elementos com data-address
     */

    document
        .querySelectorAll(
            "[data-address]"
        )
        .forEach(element => {

            if (!config.endereco) {

                element.style.display =
                    "none";

                return;
            }


            element.textContent =
                config.endereco;
        });
}


/* =========================================================
   12. MENU MOBILE
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


    if (!mobileMenu || !nav) {
        return;
    }


    mobileMenu.setAttribute(
        "aria-expanded",
        "false"
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
        .querySelectorAll("a")
        .forEach(link => {

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
        });


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
   13. NAVEGAÇÃO SUAVE
   ========================================================= */

function setupSmoothNavigation() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

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


                    /*
                     * Não intercepta links
                     * externos transformados
                     * em WhatsApp.
                     */

                    if (
                        link.target === "_blank"
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
        });
}


/* =========================================================
   14. DEPOIMENTOS
   ========================================================= */

function setupTestimonials() {

    const section =
        getElement(
            "depoimentos"
        );


    if (!section) {
        return;
    }


    /*
     * Não são inseridos
     * depoimentos automaticamente.
     */

    section.dataset.ready =
        "true";
}


/* =========================================================
   15. ANO AUTOMÁTICO
   ========================================================= */

function setupCurrentYear() {

    const year =
        new Date().getFullYear();


    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(element => {

            element.textContent =
                year;
        });


    /*
     * Compatibilidade com o
     * footer atual.
     */

    document
        .querySelectorAll(
            ".footer-bottom span"
        )
        .forEach(element => {

            element.innerHTML =
                element.innerHTML.replace(
                    /©\s*\d{4}/,
                    `© ${year}`
                );
        });
}


/* =========================================================
   16. TRACKING
   ========================================================= */

function injectTrackingScripts(config) {

    const tracking =
        config.trackingEnabled || {};


    /*
     * GOOGLE TAG MANAGER
     */

    if (
        tracking.gtm &&
        config.gtmId
    ) {

        const existingGtm =
            document.querySelector(
                `script[data-gtm="${config.gtmId}"]`
            );


        if (!existingGtm) {

            window.dataLayer =
                window.dataLayer || [];


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
                config.gtmId;


            script.src =
                `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`;


            document.head.appendChild(
                script
            );
        }
    }


    /*
     * GOOGLE ANALYTICS
     */

    if (
        tracking.ga &&
        config.gaMeasurementId
    ) {

        const existingGa =
            document.querySelector(
                `script[data-ga="${config.gaMeasurementId}"]`
            );


        if (!existingGa) {

            const script =
                document.createElement(
                    "script"
                );


            script.async =
                true;


            script.src =
                "https://www.googletagmanager.com/gtag/js?id=" +
                encodeURIComponent(
                    config.gaMeasurementId
                );


            script.dataset.ga =
                config.gaMeasurementId;


            document.head.appendChild(
                script
            );


            window.dataLayer =
                window.dataLayer || [];


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
                config.gaMeasurementId
            );
        }
    }


    /*
     * META PIXEL
     */

    if (
        tracking.pixel &&
        config.metaPixelId
    ) {

        const existingPixel =
            document.querySelector(
                `script[data-meta-pixel="${config.metaPixelId}"]`
            );


        if (
            !existingPixel &&
            !window.fbq
        ) {

            window.fbq =
                function () {

                    window.fbq.callMethod
                        ? window.fbq.callMethod.apply(
                            window.fbq,
                            arguments
                        )
                        : window.fbq.queue.push(
                            arguments
                        );
                };


            if (!window._fbq) {

                window._fbq =
                    window.fbq;
            }


            window.fbq.push =
                window.fbq;


            window.fbq.loaded =
                true;


            window.fbq.version =
                "2.0";


            window.fbq.queue =
                [];


            const script =
                document.createElement(
                    "script"
                );


            script.async =
                true;


            script.src =
                "https://connect.facebook.net/en_US/fbevents.js";


            script.dataset.metaPixel =
                config.metaPixelId;


            document.head.appendChild(
                script
            );


            window.fbq(
                "init",
                config.metaPixelId
            );


            window.fbq(
                "track",
                "PageView"
            );
        }
    }
}


/* =========================================================
   17. PROTEÇÃO DE ELEMENTOS DINÂMICOS
   ========================================================= */

function removeEmptyDynamicElements() {

    document
        .querySelectorAll(
            "[data-dynamic]"
        )
        .forEach(element => {

            const text =
                element.textContent
                    .trim();


            if (!text) {

                element.style.display =
                    "none";
            }
        });
}


/* =========================================================
   18. INICIALIZAÇÃO
   ========================================================= */

async function initSite() {

    try {

        /*
         * Carregar configuração
         */

        const config =
            await loadConfig();


        /*
         * Dados profissionais
         */

        setupProfessionalRegistration(
            config
        );


        /*
         * Sobre
         */

        setupAbout(
            config
        );


        /*
         * WhatsApp
         */

        setupWhatsApp(
            config
        );


        /*
         * Formulário
         */

        setupFormspree(
            config
        );


        /*
         * Redes sociais
         */

        setupSocialLinks(
            config
        );


        /*
         * Rodapé
         */

        setupFooter(
            config
        );


        /*
         * Links de contato
         */

        setupContactLinks(
            config
        );


        /*
         * Depoimentos
         */

        setupTestimonials();


        /*
         * Menu mobile
         */

        setupMobileMenu();


        /*
         * Navegação
         */

        setupSmoothNavigation();


        /*
         * Ano
         */

        setupCurrentYear();


        /*
         * Elementos dinâmicos
         */

        removeEmptyDynamicElements();


        /*
         * Tracking por último
         */

        injectTrackingScripts(
            config
        );


        /*
         * Estado final
         */

        document.documentElement
            .classList.add(
                "js-ready"
            );


        document.body
            .classList.add(
                "site-ready"
            );


        console.info(
            "Katlen Ariane — site inicializado com sucesso."
        );


    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );
    }
}


/* =========================================================
   19. DOM READY
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
   20. PAGESHOW
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
