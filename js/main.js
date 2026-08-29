```javascript
/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Site institucional / Psicanálise

   Integração:
   V8 Admin Universal

   Project ID:
   51922766-9775-47eb-ace0-a90af01dd9bb
========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURAÇÃO
========================================================= */

const V8_PROJECT_ID =
    "51922766-9775-47eb-ace0-a90af01dd9bb";

let V8_CONFIG = null;

/* =========================================================
   2. UTILITÁRIOS
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

function showElement(element, display = "") {
    if (!element) return;

    element.style.display = display;
}

function hideElement(element) {
    if (!element) return;

    element.style.display = "none";
}

/* =========================================================
   3. CONFIGURAÇÃO V8
========================================================= */

function getConfigValue(path, fallback = "") {

    if (!V8_CONFIG || !path) {
        return fallback;
    }

    const value = path
        .split(".")
        .reduce((current, key) => {

            if (
                current === null ||
                current === undefined
            ) {
                return undefined;
            }

            return current[key];

        }, V8_CONFIG);

    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    return value;
}

/* =========================================================
   4. WHATSAPP
========================================================= */

function normalizeWhatsAppNumber(number) {

    return String(number || "")
        .replace(/\D/g, "")
        .trim();
}

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

function setupWhatsApp() {

    /*
     * Aceita as duas estruturas mais comuns
     * utilizadas pelo V8 Admin.
     */

    const whatsapp =
        String(
            getConfigValue(
                "site.whatsapp",
                getConfigValue(
                    "contact.whatsapp",
                    ""
                )
            )
        ).trim();

    const defaultMessage =
        "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.";

    const whatsappURL =
        createWhatsAppURL(
            whatsapp,
            defaultMessage
        );

    console.info(
        "V8 Admin — WhatsApp:",
        whatsapp
            ? "configurado"
            : "não configurado"
    );

    /* -----------------------------------------------------
       BOTÃO FLUTUANTE
    ----------------------------------------------------- */

    const floatingButton =
        getElement("whatsapp-link");

    if (floatingButton) {

        if (whatsappURL) {

            floatingButton.href =
                whatsappURL;

            floatingButton.target =
                "_blank";

            floatingButton.rel =
                "noopener noreferrer";

            floatingButton.style.display =
                "flex";

        } else {

            hideElement(
                floatingButton
            );
        }
    }

    /* -----------------------------------------------------
       BOTÕES COM DATA-V8
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            '[data-v8="contact.whatsapp"]'
        )
        .forEach(element => {

            if (!whatsappURL) {
                hideElement(element);
                return;
            }

            element.href =
                whatsappURL;

            element.target =
                "_blank";

            element.rel =
                "noopener noreferrer";

            showElement(element);
        });

    /* -----------------------------------------------------
       BOTÕES DATA-WHATSAPP
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "[data-whatsapp]"
        )
        .forEach(element => {

            if (!whatsappURL) {
                hideElement(element);
                return;
            }

            element.href =
                whatsappURL;

            element.target =
                "_blank";

            element.rel =
                "noopener noreferrer";

            showElement(element);
        });

    /* -----------------------------------------------------
       LINKS ANTIGOS #WHATSAPP
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       MENSAGENS PERSONALIZADAS
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "[data-whatsapp-message]"
        )
        .forEach(element => {

            if (!whatsapp) {
                hideElement(element);
                return;
            }

            const customMessage =
                element.getAttribute(
                    "data-whatsapp-message"
                ) ||
                defaultMessage;

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

            showElement(element);
        });
}

/* =========================================================
   5. REGISTRO PROFISSIONAL
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
        hideElement(container);
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

    showElement(container);
}

/* =========================================================
   6. RODAPÉ
========================================================= */

function setupFooter() {

    const whatsapp =
        String(
            getConfigValue(
                "site.whatsapp",
                getConfigValue(
                    "contact.whatsapp",
                    ""
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

    const registration =
        String(
            getConfigValue(
                "site.registration",
                "CBPC 2022-6172"
            )
        ).trim();

    /* WhatsApp */

    const footerWhatsapp =
        getElement(
            "footer-whatsapp"
        );

    if (footerWhatsapp) {

        if (whatsapp) {

            footerWhatsapp.href =
                createWhatsAppURL(
                    whatsapp,
                    "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento."
                );

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

    /* Endereço */

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

    /* Registro */

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
   7. SOBRE
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
   8. CONTATO
========================================================= */

function setupContactLinks() {

    const phone =
        String(
            getConfigValue(
                "site.phone",
                getConfigValue(
                    "site.whatsapp",
                    ""
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

    /* Telefone */

    document
        .querySelectorAll(
            "[data-phone]"
        )
        .forEach(element => {

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
        });

    /* Endereço */

    document
        .querySelectorAll(
            "[data-address]"
        )
        .forEach(element => {

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
        });
}

/* =========================================================
   9. REDES SOCIAIS
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

            /*
             * Suporta data-social="instagram"
             */

            document
                .querySelectorAll(
                    `[data-social="${network}"]`
                )
                .forEach(link => {

                    if (!cleanURL) {

                        hideElement(
                            link
                        );

                        return;
                    }

                    link.href =
                        cleanURL;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                    showElement(
                        link
                    );
                });

            /*
             * Suporta IDs usados
             * neste index.html.
             */

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

            const link =
                getElement(
                    idMap[network]
                );

            if (link) {

                if (!cleanURL) {

                    hideElement(
                        link
                    );

                } else {

                    link.href =
                        cleanURL;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                    showElement(
                        link
                    );
                }
            }
        }
    );
}

/* =========================================================
   10. FORMSPREE
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
   11. MENU MOBILE
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
   12. NAVEGAÇÃO SUAVE
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

                    if (
                        link.target ===
                        "_blank"
                    ) {
                        return;
                    }

                    /*
                     * Nunca trata #whatsapp como
                     * navegação interna.
                     */

                    if (
                        targetId ===
                        "#whatsapp"
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
   13. DEPOIMENTOS
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
   14. ANO AUTOMÁTICO
========================================================= */

function setupCurrentYear() {

    const year =
        new Date()
            .getFullYear();

    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(element => {

            element.textContent =
                "© " +
                year +
                " Katlen Ariane. Todos os direitos reservados.";
        });
}

/* =========================================================
   15. CAMPOS DINÂMICOS
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

                hideElement(
                    element
                );
            }
        });
}

/* =========================================================
   16. APLICAR CONFIGURAÇÃO
========================================================= */

function applyV8Configuration(config) {

    V8_CONFIG =
        config || {};

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
   17. EVENTO V8 ADMIN
========================================================= */

function setupV8AdminListener() {

    document.addEventListener(
        "v8admin:ready",
        event => {

            applyV8Configuration(
                event.detail || {}
            );
        },
        {
            once: true
        }
    );
}

/* =========================================================
   18. INTERFACE
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
   19. INICIALIZAÇÃO
========================================================= */

function initSite() {

    try {

        console.info(
            "Katlen Ariane — iniciando..."
        );

        /*
         * Primeiro registra o listener.
         */

        setupV8AdminListener();

        /*
         * Inicializa a interface.
         */

        initInterface();

        /*
         * Caso o loader já tenha
         * disponibilizado a configuração.
         */

        if (
            window.V8_ADMIN_CONFIG
        ) {

            applyV8Configuration(
                window.V8_ADMIN_CONFIG
            );
        }

    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );
    }
}

/* =========================================================
   20. DOM READY
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
   21. PAGESHOW
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
