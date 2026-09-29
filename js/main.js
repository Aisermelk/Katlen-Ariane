/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Interface do site (menu, navegação, ano do rodapé).
   A integração com o V8 Admin Universal é feita pelo
   js/v8-loader.js — este arquivo não busca nem aplica
   nenhuma configuração vinda do painel.
   ========================================================= */

"use strict";

/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function hideElement(element) {

    if (!element) {
        return;
    }

    element.style.display = "none";
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
   (esconde qualquer [data-dynamic] que o v8-loader.js
   não tenha preenchido, evitando espaços vazios no layout)
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

        initInterface();

        /*
         * Espera o v8-loader.js terminar (sucesso ou falha) antes de
         * decidir quais campos [data-dynamic] ficam escondidos — evita
         * esconder algo que seria preenchido um instante depois, já que
         * o loader busca os dados de forma assíncrona.
         */

        document.addEventListener(
            "v8loader:done",
            removeEmptyDynamicElements,
            { once: true }
        );

    } catch (error) {

        console.error(
            "Erro ao inicializar o site:",
            error
        );
    }
}

/* =========================================================
   POPUP — CONSULTA R$ 7,00
   ========================================================= */

/*
 * COLE AQUI O SEU LINK DE PAGAMENTO
 *
 * Exemplo:
 * const PAYMENT_LINK = "https://seu-link-de-pagamento.com";
 */
const PAYMENT_LINK = https://link.infinitepay.io/katlenarianeso/VC03-pIDe3ZIZXc-7,00;


function setupPaymentPopup() {

    const popup =
        document.getElementById("payment-popup");

    const paymentLink =
        document.getElementById(
            "payment-popup-payment-link"
        );

    if (!popup || !paymentLink) {
        return;
    }

    /* Aplica o link de pagamento */
    paymentLink.href = PAYMENT_LINK;

    /* Abre o popup */
    const openPopup = () => {

        popup.classList.add("is-open");

        popup.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "popup-open"
        );
    };

    /* Fecha o popup */
    const closePopup = () => {

        popup.classList.remove("is-open");

        popup.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "popup-open"
        );
    };

    /* Botões e área externa */
    popup
        .querySelectorAll("[data-popup-close]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closePopup
            );
        });

    /* ESC fecha */
    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                popup.classList.contains("is-open")
            ) {
                closePopup();
            }
        }
    );

    /*
     * Abre automaticamente ao entrar no site.
     * Pequeno atraso para não aparecer de forma brusca.
     */
    setTimeout(
        openPopup,
        900
    );
}

/* =========================================================
   DOM READY
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initSite
    );

} else {

    initSite();
}
