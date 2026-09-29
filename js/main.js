/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Interface do site + Popup de pagamento
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
        getElement("mobile-menu");

    const nav =
        document.querySelector(".nav-menu");

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
                nav.classList.toggle("active");

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
                nav.classList.contains("active")
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
        .querySelectorAll('a[href^="#"]')
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link.getAttribute("href");

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }

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
                            top: targetPosition,
                            behavior: "smooth"
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
        getElement("depoimentos");

    if (!section) {
        return;
    }

    section.dataset.ready = "true";
}


/* =========================================================
   ANO
   ========================================================= */

function setupCurrentYear() {

    const year =
        new Date().getFullYear();

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

                    hideElement(element);
                }
            }
        );
}


/* =========================================================
   POPUP DE PAGAMENTO — R$ 7,00
   ========================================================= */

/*
 * ========================================================
 * COLOQUE SEU LINK DE PAGAMENTO AQUI
 * ========================================================
 */

const PAYMENT_LINK =
    "COLE_AQUI_SEU_LINK_DE_PAGAMENTO";


function setupPaymentPopup() {

    /*
     * Se o popup já estiver no HTML,
     * utiliza o popup existente.
     */

    let popup =
        document.getElementById(
            "payment-popup"
        );

   popup.innerHTML = `

    <div
        class="payment-popup-overlay"
        data-popup-close>
    </div>

    <div
        class="payment-popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-popup-title">

        <button
            class="payment-popup-close"
            type="button"
            data-popup-close
            aria-label="Fechar">
            ×
        </button>

        <span class="payment-popup-ornament">
            ✦
        </span>

        <h2
            id="payment-popup-title"
            class="payment-popup-title">
            CONSELHO DA CIGANA
        </h2>

        <p class="payment-popup-text">
            Para quem busca clareza sobre
            <strong>"AMOR | DINHEIRO | ESPIRITUALIDADE"</strong>
        </p>

        <p class="payment-popup-price">
            R$ 7,00
        </p>

        <a
            href="#"
            class="payment-popup-button"
            id="payment-popup-payment-link"
            target="_blank"
            rel="noopener noreferrer">
            Pagar R$ 7,00
        </a>

    </div>
`;
    
    /*
     * Localiza o botão de pagamento.
     */

    const paymentButton =
        document.getElementById(
            "payment-popup-payment-link"
        );


    if (paymentButton) {

        paymentButton.href =
            PAYMENT_LINK;
    }


    /*
     * Abre o popup.
     */

    function openPopup() {

        popup.classList.add(
            "is-open"
        );

        popup.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "popup-open"
        );
    }


    /*
     * Fecha o popup.
     */

    function closePopup() {

        popup.classList.remove(
            "is-open"
        );

        popup.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "popup-open"
        );
    }


    /*
     * Botão X e fundo escuro.
     */

    popup
        .querySelectorAll(
            "[data-popup-close]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    closePopup
                );
            }
        );


    /*
     * Tecla ESC fecha o popup.
     */

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
     * Abre automaticamente.
     */

    setTimeout(
        openPopup,
        900
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

    /*
     * Inicializa o popup.
     */
    setupPaymentPopup();


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
         * Espera o v8-loader.js terminar
         * antes de esconder campos dinâmicos.
         */

        document.addEventListener(
            "v8loader:done",
            removeEmptyDynamicElements,
            {
                once: true
            }
        );


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
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initSite
    );

} else {

    initSite();
}
