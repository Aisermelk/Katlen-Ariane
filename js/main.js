/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Integração V8 Admin Universal
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const V8_PROJECT_ID = "51922766-9775-47eb-ace0-a90af01dd9bb";

let V8_CONFIG = null;


/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element = getElement(id);

    if (!element || value === undefined || value === null) {
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


function getConfigValue(path, fallback = "") {

    if (!V8_CONFIG || !path) {
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
   WHATSAPP
   ========================================================= */

/*
 * Aceita:
 *
 * site.whatsapp
 * contact.whatsapp
 * site.phone
 * contact.phone
 */

function getWhatsAppNumber() {

    const possibleValues = [

        getConfigValue(
            "contact.whatsapp",
            ""
        ),

        getConfigValue(
            "site.whatsapp",
            ""
        ),

        getConfigValue(
            "contact.phone",
            ""
        ),

        getConfigValue(
            "site.phone",
            ""
        )

    ];

    for (const value of possibleValues) {

        const normalized = String(
            value || ""
        ).trim();

        if (normalized) {
            return normalized;
        }
    }

    return "";
}


function normalizeWhatsAppNumber(number) {

    return String(
        number || ""
    )
        .replace(/\D/g, "")
        .trim();
}


function createWhatsAppURL(
    number,
    message = ""
) {

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
            : "NÃO CONFIGURADO"
    );

    console.info(
        "V8 Admin — URL WhatsApp:",
        whatsappURL
            ? whatsappURL
            : "NÃO GERADA"
    );


    /*
     * =====================================================
     * BOTÃO FLUTUANTE
     * =====================================================
     */

    const whatsappLink =
        getElement("whatsapp-link");

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
                "onclick"
            );

        } else {

            whatsappLink.style.display =
                "none";
        }
    }


    /*
     * =====================================================
     * TODOS OS ELEMENTOS data-v8
     * =====================================================
     */

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

                element.removeAttribute(
                    "onclick"
                );

                showElement(
                    element
                );
            }
        );


    /*
     * =====================================================
     * LINKS ANTIGOS #WHATSAPP
     * =====================================================
     */

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

                link.removeAttribute(
                    "onclick"
                );
            }
        );


    /*
     * =====================================================
     * DATA-WHATSAPP
     * =====================================================
     */

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


    /*
     * =====================================================
     * MENSAGEM PERSONALIZADA
     * =====================================================
     */

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
   REGISTRO PROFISSIONAL
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
   SOBRE
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
   RODAPÉ
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
   CONTATO
   ========================================================= */

function setupContactLinks() {

    const phone =
        String(
            getConfigValue(
                "contact.phone",
                getConfigValue(
                    "site.phone",
                    getWhatsAppNumber()
                )
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
   REDES SOCIAIS
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
}


/* =========================================================
   FORMSPREE
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
   MENU MOBILE
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
            }
        }
    );
}


/* =========================================================
   NAVEGAÇÃO SUAVE
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
   DEPOIMENTOS
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
   ANO
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
   CAMPOS DINÂMICOS
   ========================================================= */

function removeEmptyDynamicElements() {

    document
        .querySelectorAll(
            "[data-dynamic]"
        )
        .forEach(
            element => {

                if (
                    !element.textContent.trim()
                ) {

                    hideElement(
                        element
                    );
                }
            }
        );
}


/* =========================================================
   CONFIGURAÇÃO V8 ADMIN
   ========================================================= */

function applyV8Configuration() {

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
   LISTENER V8 ADMIN
   ========================================================= */

function setupV8AdminListener() {

    document.addEventListener(
        "v8admin:ready",
        event => {

            V8_CONFIG =
                event.detail || {};

            console.info(
                "===================================="
            );

            console.info(
                "V8 Admin Universal conectado."
            );

            console.info(
                "Projeto:",
                V8_PROJECT_ID
            );

            console.info(
                "Configuração:",
                V8_CONFIG
            );

            console.info(
                "===================================="
            );

            applyV8Configuration();

        },
        {
            once: true
        }
    );
}


/* =========================================================
   INTERFACE
   ========================================================= */

function initInterface() {

    setupTestimonials();

    setupMobileMenu();

    setupSmoothNavigation();

    setupCurrentYear();

    document.documentElement.classList.add(
        "js-ready"
    );

    document.body.classList.add(
        "site-ready"
    );

    console.info(
        "Katlen Ariane — interface inicializada."
    );
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initSite() {

    try {

        console.info(
            "Katlen Ariane — iniciando..."
        );

        /*
         * IMPORTANTE:
         * Primeiro registra o listener do V8.
         */

        setupV8AdminListener();

        /*
         * Depois inicializa a interface.
         */

        initInterface();


        /*
         * Caso o loader já tenha disponibilizado
         * a configuração.
         */

        if (
            window.V8_ADMIN_CONFIG
        ) {

            V8_CONFIG =
                window.V8_ADMIN_CONFIG;

            applyV8Configuration();
        }

    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );
    }
}


/* =========================================================
   DOM READY
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
   PAGESHOW
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
   FIM
   ========================================================= */
```
