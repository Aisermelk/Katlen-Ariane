```javascript
/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Site institucional / Psicanálise

   Integração:
   V8 Admin Universal

   Responsabilidades:
   - WhatsApp
   - Redes sociais
   - Formspree
   - Conteúdo dinâmico
   - Registro profissional
   - Menu mobile
   - Navegação suave
   - Ano automático

   Project ID:
   51922766-9775-47eb-ace0-a90af01dd9bb
   ========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURAÇÃO
   ========================================================= */

const V8_PROJECT_ID =
    "51922766-9775-47eb-ace0-a90af01dd9bb";

/* =========================================================
   2. UTILITÁRIOS
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);

}

function setText(id, value) {

    const element = getElement(id);

    if (
        !element ||
        value === undefined ||
        value === null
    ) {
        return;
    }

    element.textContent = String(value);

}

function hideElement(element) {

    if (!element) {
        return;
    }

    element.style.display = "none";

}

function showElement(element, display = "") {

    if (!element) {
        return;
    }

    element.style.display = display;

}

/* =========================================================
   3. CONFIGURAÇÃO DO V8 ADMIN
   ========================================================= */

let V8_CONFIG = null;

function getConfigValue(path, fallback = "") {

    if (
        !V8_CONFIG ||
        !path
    ) {
        return fallback;
    }

    const value = path
        .split(".")
        .reduce(
            (current, key) => {

                if (
                    current === null ||
                    current === undefined
                ) {
                    return undefined;
                }

                return current[key];

            },
            V8_CONFIG
        );

    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    return value;

}

/* =========================================================
   4. DESCOBRIR WHATSAPP
   ========================================================= */

function getWhatsAppNumber() {

    const possibleValues = [

        getConfigValue(
            "site.whatsapp",
            ""
        ),

        getConfigValue(
            "contact.whatsapp",
            ""
        ),

        getConfigValue(
            "whatsapp",
            ""
        ),

        getConfigValue(
            "site.phone",
            ""
        )

    ];

    for (const value of possibleValues) {

        const number =
            String(value || "").trim();

        if (number) {
            return number;
        }

    }

    return "";

}

/* =========================================================
   5. NORMALIZAR WHATSAPP
   ========================================================= */

function normalizeWhatsAppNumber(number) {

    return String(number || "")
        .replace(/\D/g, "")
        .trim();

}

/* =========================================================
   6. URL WHATSAPP
   ========================================================= */

function createWhatsAppURL(number, message = "") {

    const cleanNumber =
        normalizeWhatsAppNumber(number);

    if (!cleanNumber) {
        return "";
    }

    const encodedMessage =
        encodeURIComponent(message);

    return (
        "https://wa.me/" +
        cleanNumber +
        "?text=" +
        encodedMessage
    );

}

/* =========================================================
   7. CONFIGURAÇÃO DO WHATSAPP
   ========================================================= */

function setupWhatsApp() {

    const whatsapp =
        getWhatsAppNumber();

    const message =
        "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.";

    const whatsappURL =
        createWhatsAppURL(
            whatsapp,
            message
        );

    console.info(
        "V8 Admin — WhatsApp:",
        whatsapp
            ? whatsapp
            : "não configurado"
    );

    /* -----------------------------------------------------
       BOTÃO FLUTUANTE
       ----------------------------------------------------- */

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

            whatsappLink.removeAttribute(
                "hidden"
            );

            whatsappLink.classList.add(
                "whatsapp-ready"
            );

        } else {

            hideElement(
                whatsappLink
            );

        }

    }

    /* -----------------------------------------------------
       ELEMENTOS DATA-WHATSAPP
       ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       ELEMENTOS DATA-V8="CONTACT.WHATSAPP"
       ----------------------------------------------------- */

    document
        .querySelectorAll(
            '[data-v8="contact.whatsapp"]'
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

    /* -----------------------------------------------------
       LINKS ANTIGOS #WHATSAPP
       ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       MENSAGENS PERSONALIZADAS
       ----------------------------------------------------- */

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
   8. REGISTRO PROFISSIONAL
   ========================================================= */

function setupProfessionalRegistration() {

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
            getConfigValue(
                "site.registration",
                "CBPC 2022-6172"
            )
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
   9. RODAPÉ
   ========================================================= */

function setupFooter() {

    const whatsapp =
        getWhatsAppNumber();

    const address =
        String(
            getConfigValue(
                "site.address",
                ""
            )
        ).trim();

    const registration =
        String(
            getConfigValue(
                "site.registration",
                "CBPC 2022-6172"
            )
        ).trim();

    const footerWhatsapp =
        getElement(
            "footer-whatsapp"
        );

    if (footerWhatsapp) {

        if (whatsapp) {

            const url =
                createWhatsAppURL(
                    whatsapp,
                    "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento."
                );

            footerWhatsapp.href =
                url;

            footerWhatsapp.target =
                "_blank";

            footerWhatsapp.rel =
                "noopener noreferrer";

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
   10. CONTEÚDO SOBRE
   ========================================================= */

function setupAbout() {

    const especializacao =
        String(
            getConfigValue(
                "content.specialization",
                ""
            )
        ).trim();

    const experiencia =
        String(
            getConfigValue(
                "content.experience",
                ""
            )
        ).trim();

    const neurodevelopment =
        String(
            getConfigValue(
                "content.neurodevelopment",
                ""
            )
        ).trim();

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
   11. CONTATO
   ========================================================= */

function setupContactLinks() {

    const phone =
        String(
            getConfigValue(
                "site.phone",
                getWhatsAppNumber()
            )
        ).trim();

    const address =
        String(
            getConfigValue(
                "site.address",
                ""
            )
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
                    element.tagName.toLowerCase() ===
                    "a"
                ) {

                    const cleanPhone =
                        phone.replace(
                            /\D/g,
                            ""
                        );

                    if (cleanPhone) {

                        element.href =
                            "tel:+" +
                            cleanPhone;

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
   12. REDES SOCIAIS
   ========================================================= */

function setupSocialLinks() {

    const socialMap = {

        instagram:
            getConfigValue(
                "social.instagram",
                ""
            ),

        facebook:
            getConfigValue(
                "social.facebook",
                ""
            ),

        tiktok:
            getConfigValue(
                "social.tiktok",
                ""
            ),

        linkedin:
            getConfigValue(
                "social.linkedin",
                ""
            )

    };

    Object.entries(
        socialMap
    ).forEach(
        (
            [
                network,
                url
            ]
        ) => {

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

            /* Também suporta IDs usados pelo index */

            const idMap = {
                instagram:
                    "instagram-link",

                facebook:
                    "facebook-link",

                tiktok:
                    "tiktok-link",

                linkedin:
                    "linkedin-link"
            };

            const element =
                getElement(
                    idMap[network]
                );

            if (element) {

                if (cleanURL) {

                    element.href =
                        cleanURL;

                    element.target =
                        "_blank";

                    element.rel =
                        "noopener noreferrer";

                    showElement(
                        element
                    );

                } else {

                    hideElement(
                        element
                    );

                }

            }

        }
    );

}

/* =========================================================
   13. FORMSPREE
   ========================================================= */

function setupFormspree() {

    const form =
        getElement(
            "main-form"
        );

    if (!form) {
        return;
    }

    const configuredEndpoint =
        String(
            getConfigValue(
                "formspree",
                getConfigValue(
                    "forms.formspree",
                    ""
                )
            )
        ).trim();

    if (!configuredEndpoint) {

        console.warn(
            "V8 Admin — Formspree não configurado."
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
            "https://formspree.io/f/" +
            endpoint;

    }

    form.method =
        "POST";

    console.info(
        "V8 Admin — Formspree configurado."
    );

}

/* =========================================================
   14. MENU MOBILE
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
   15. NAVEGAÇÃO SUAVE
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
   16. DEPOIMENTOS
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
   17. ANO AUTOMÁTICO
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
                    "© " +
                    year +
                    " Katlen Ariane. Todos os direitos reservados.";

            }
        );

}

/* =========================================================
   18. CAMPOS DINÂMICOS
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
   19. APLICAR CONFIGURAÇÃO
   ========================================================= */

function applyV8Config(config) {

    if (!config) {
        return;
    }

    V8_CONFIG =
        config;

    console.info(
        "V8 Admin Universal conectado.",
        V8_PROJECT_ID
    );

    setupProfessionalRegistration();

    setupAbout();

    setupWhatsApp();

    setupFormspree();

    setupSocialLinks();

    setupFooter();

    setupContactLinks();

    removeEmptyDynamicElements();

}

/* =========================================================
   20. EVENTO V8 ADMIN
   ========================================================= */

function setupV8AdminListener() {

    document.addEventListener(
        "v8admin:ready",
        event => {

            applyV8Config(
                event.detail || {}
            );

        },
        {
            once: true
        }
    );

}

/* =========================================================
   21. CONFIGURAÇÃO GLOBAL
   ========================================================= */

function checkGlobalV8Config() {

    if (
        window.V8_ADMIN_CONFIG
    ) {

        applyV8Config(
            window.V8_ADMIN_CONFIG
        );

        return true;
    }

    return false;

}

/* =========================================================
   22. INICIALIZAÇÃO DA INTERFACE
   ========================================================= */

function initInterface() {

    setupTestimonials();

    setupMobileMenu();

    setupSmoothNavigation();

    setupCurrentYear();

    document.documentElement
        .classList.add(
            "js-ready"
        );

    document.body
        .classList.add(
            "site-ready"
        );

    console.info(
        "Katlen Ariane — interface inicializada."
    );

}

/* =========================================================
   23. INICIALIZAÇÃO PRINCIPAL
   ========================================================= */

function initSite() {

    try {

        console.info(
            "Katlen Ariane — iniciando..."
        );

        /*
         * Listener precisa ser criado
         * antes da configuração do loader.
         */

        setupV8AdminListener();

        /*
         * Interface independente
         * do V8 Admin.
         */

        initInterface();

        /*
         * Caso o loader tenha carregado
         * antes do main.js.
         */

        checkGlobalV8Config();

    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );

    }

}

/* =========================================================
   24. DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initSite,
        {
            once: true
        }
    );

} else {

    initSite();

}

/* =========================================================
   25. PAGESHOW
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
```
