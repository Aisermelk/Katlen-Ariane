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
   OFERTA — 3 PERGUNTAS
   Usa o Catálogo + checkout do V8 Loader.
   ========================================================= */

function setupQuickQuestionsPopup() {

    const popup =
        getElement("quickQuestionsPopup");

    const closeButton =
        getElement("quickQuestionsClose");

    const trigger =
        getElement("quickQuestionsTrigger");

    const payButton =
        getElement("quickQuestionsPay");

    const status =
        getElement("quickQuestionsStatus");

    const price =
        getElement("quickQuestionsPrice");

    if (
        !popup ||
        !closeButton ||
        !trigger ||
        !payButton
    ) {
        return;
    }

    let previousFocus = null;

    function openPopup() {

        previousFocus =
            document.activeElement;

        popup.classList.add("is-open");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("quick-questions-open");

        window.setTimeout(
            () => closeButton.focus(),
            50
        );
    }

    function closePopup() {

        popup.classList.remove("is-open");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("quick-questions-open");

        if (
            previousFocus &&
            typeof previousFocus.focus === "function"
        ) {
            previousFocus.focus();
        }
    }

    trigger.addEventListener(
        "click",
        openPopup
    );

    closeButton.addEventListener(
        "click",
        closePopup
    );

    popup.addEventListener(
        "click",
        event => {

            if (event.target === popup) {
                closePopup();
            }
        }
    );

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
     * O V8 Loader já possui o checkout.
     * Aqui apenas localizamos o item do Catálogo e
     * colocamos seu ID no botão data-v8-pay.
     */
    function connectPaymentItem() {

        const catalog =
            window.V8 &&
            window.V8.catalog;

        const products =
            catalog &&
            Array.isArray(catalog.products)
                ? catalog.products
                : [];

        const item =
            products.find(product => {

                const name =
                    String(
                        product &&
                        product.name
                            ? product.name
                            : ""
                    )
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                return (
                    name.includes("3 perguntas") ||
                    name.includes("tres perguntas")
                );
            });

        if (!item || !item.id) {

            payButton.disabled = true;

            if (status) {
                status.textContent =
                    "Pagamento ainda não configurado.";
            }

            return;
        }

        payButton.setAttribute(
            "data-v8-pay",
            item.id
        );

        /*
         * Depois de pagar, o cliente volta para a página de
         * agradecimento (obrigado.html), onde envia as perguntas
         * pelo WhatsApp.
         */
        payButton.setAttribute(
            "data-redirect",
            new URL("obrigado", window.location.href).href
        );

        const itemPrice =
            Number(item.price);

        if (
            Number.isFinite(itemPrice) &&
            itemPrice > 0
        ) {

            const money =
                new Intl.NumberFormat(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                ).format(itemPrice);

            if (price) {
                price.textContent = money;
            }

            payButton.textContent =
                "Pagar agora por " + money;
        }

        if (status) {
            status.textContent = "";
        }

        payButton.disabled = false;
    }

    if (
        window.V8 &&
        window.V8.ready
    ) {

        window.V8.ready.then(
            connectPaymentItem
        );
    }

    document.addEventListener(
        "v8:catalog",
        connectPaymentItem
    );

    document.addEventListener(
        "v8:pay-started",
        () => {

            if (status) {
                status.textContent =
                    "Abrindo pagamento seguro...";
            }
        }
    );

    document.addEventListener(
        "v8:pay-error",
        event => {

            if (status) {
                status.textContent =
                    event.detail &&
                    event.detail.error &&
                    event.detail.error.message
                        ? event.detail.error.message
                        : "Não foi possível iniciar o pagamento.";
            }
        }
    );

    /*
     * Abre automaticamente uma única vez por sessão.
     * O visitante pode fechar e reabrir pelo botão fixo.
     */
    try {

        if (
            sessionStorage.getItem(
                "v8_quick_questions_seen"
            ) !== "1"
        ) {

            window.setTimeout(
                () => {

                    sessionStorage.setItem(
                        "v8_quick_questions_seen",
                        "1"
                    );

                    openPopup();

                },
                5000
            );
        }

    } catch (error) {

        window.setTimeout(
            openPopup,
            5000
        );
    }
}


/* =========================================================
   INTERFACE
   ========================================================= */

function initInterface() {

    setupTestimonials();

    setupMobileMenu();

    setupQuickQuestionsPopup();

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
