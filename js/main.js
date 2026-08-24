/* =========================================================
   KATLEN ARIANE — MAIN.JS
   Site institucional / Psicanálise
   ========================================================= */

/* =========================================================
   1. CONFIGURAÇÃO DO WORKER
   ========================================================= */

// URL real do Worker administrativo.
// Substitua pelo endereço do seu Worker quando estiver publicado.
const CONFIG_API_URL =
    "https://katlen-admin.example.workers.dev/api/config";


/* =========================================================
   2. CONFIGURAÇÃO FALLBACK
   Usada quando o Worker estiver indisponível.
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

    professionalRegistrationLabel: "Registro profissional",
    professionalRegistration: "CBPC 2022-6172",

    formacao: "",
    especializacoes: "",
    experiencia: ""
};


/* =========================================================
   3. CARREGAMENTO DA CONFIGURAÇÃO
   ========================================================= */

async function loadConfig() {
    try {
        const response = await fetch(CONFIG_API_URL, {
            method: "GET",
            credentials: "omit",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Configuração indisponível: HTTP ${response.status}`
            );
        }

        const remoteConfig = await response.json();

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

        return FALLBACK_CONFIG;
    }
}


/* =========================================================
   4. FUNÇÕES AUXILIARES
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {
    const element = getElement(id);

    if (!element || value === undefined || value === null) {
        return;
    }

    element.textContent = value;
}


function setDisplay(id, display = "block") {
    const element = getElement(id);

    if (!element) {
        return;
    }

    element.style.display = display;
}


function hideElement(id) {
    const element = getElement(id);

    if (!element) {
        return;
    }

    element.style.display = "none";
}


/* =========================================================
   5. REGISTRO PROFISSIONAL
   ========================================================= */

function setupProfessionalRegistration(config) {

    const container = getElement("prof-reg-container");
    const label = getElement("reg-label");
    const value = getElement("reg-value");

    if (!container) {
        return;
    }

    if (config.professionalRegistration) {

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

        container.style.display = "none";
    }
}


/* =========================================================
   6. BARRA / INFORMAÇÕES DE CONTATO
   ========================================================= */

function setupTopContact(config) {

    const whatsappPill = getElement("top-whatsapp-pill");
    const whatsappText = getElement("top-whatsapp-text");

    if (whatsappPill) {

        if (config.whatsapp) {

            if (whatsappText) {
                whatsappText.textContent =
                    config.whatsapp;
            }

            whatsappPill.style.display = "flex";

        } else {

            whatsappPill.style.display = "none";
        }
    }


    const addressPill = getElement("top-address-pill");
    const addressText = getElement("top-address-text");

    if (addressPill) {

        if (config.endereco) {

            if (addressText) {
                addressText.textContent =
                    config.endereco;
            }

            addressPill.style.display = "flex";

        } else {

            addressPill.style.display = "none";
        }
    }
}


/* =========================================================
   7. SOBRE / FORMAÇÃO / ESPECIALIZAÇÕES
   ========================================================= */

function setupAbout(config) {

    if (config.formacao) {
        setText(
            "about-formacao",
            config.formacao
        );
    }

    if (config.especializacoes) {
        setText(
            "about-especializacoes",
            config.especializacoes
        );
    }

    if (config.experiencia) {
        setText(
            "about-experiencia",
            config.experiencia
        );
    }
}


/* =========================================================
   8. WHATSAPP
   ========================================================= */

function createWhatsAppURL(number, message) {

    if (!number) {
        return "";
    }

    const cleanNumber =
        String(number).replace(/\D/g, "");

    if (!cleanNumber) {
        return "";
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}


function setupWhatsApp(config) {

    const message =
        "Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.";

    const whatsappURL =
        createWhatsAppURL(
            config.whatsapp,
            message
        );


    /* Botão flutuante */

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

        } else {

            whatsappLink.style.display =
                "none";
        }
    }


    /* Botões com data-whatsapp */

    document
        .querySelectorAll("[data-whatsapp]")
        .forEach(button => {

            if (!whatsappURL) {
                return;
            }

            button.href =
                whatsappURL;

            button.target =
                "_blank";

            button.rel =
                "noopener noreferrer";
        });


    /* Links ou botões que utilizam #whatsapp */

    document
        .querySelectorAll('a[href="#whatsapp"]')
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
        getElement("main-form");

    if (!form) {
        return;
    }

    if (config.formspreeEndpoint) {

        let endpoint =
            config.formspreeEndpoint.trim();

        /*
         * Permite configurar tanto:
         *
         * abc123
         *
         * quanto:
         *
         * https://formspree.io/f/abc123
         */

        if (
            endpoint.startsWith("http://") ||
            endpoint.startsWith("https://")
        ) {

            form.action =
                endpoint;

        } else {

            endpoint =
                endpoint.replace(/^\/+/, "");

            endpoint =
                endpoint.replace(/^f\//, "");

            form.action =
                `https://formspree.io/f/${endpoint}`;
        }

        form.method = "POST";
    }
}


/* =========================================================
   10. REDES SOCIAIS
   ========================================================= */

function setupSocialLinks(config) {

    const socialMap = {
        instagram: config.instagram,
        facebook: config.facebook,
        tiktok: config.tiktok,
        linkedin: config.linkedin
    };


    Object.entries(socialMap)
        .forEach(([network, url]) => {

            if (!url) {
                return;
            }

            document
                .querySelectorAll(
                    `[data-social="${network}"]`
                )
                .forEach(link => {

                    link.href = url;
                    link.target = "_blank";
                    link.rel =
                        "noopener noreferrer";

                    link.style.display = "";
                });
        });


    /*
     * Também suporta IDs antigos,
     * caso ainda existam no HTML.
     */

    const legacyMap = {
        "instagram-link": config.instagram,
        "facebook-link": config.facebook,
        "tiktok-link": config.tiktok,
        "linkedin-link": config.linkedin
    };


    Object.entries(legacyMap)
        .forEach(([id, url]) => {

            const link =
                getElement(id);

            if (!link) {
                return;
            }

            if (url) {

                link.href = url;
                link.target = "_blank";
                link.rel =
                    "noopener noreferrer";

            } else {

                link.style.display =
                    "none";
            }
        });
}


/* =========================================================
   11. TRACKING
   ========================================================= */

function injectTrackingScripts(config) {

    /*
     * GOOGLE TAG MANAGER
     */

    if (
        config.trackingEnabled?.gtm &&
        config.gtmId
    ) {

        if (
            document.querySelector(
                `script[data-gtm="${config.gtmId}"]`
            )
        ) {
            return;
        }

        const script =
            document.createElement("script");

        script.async = true;

        script.dataset.gtm =
            config.gtmId;

        script.innerHTML = `
            (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                    'gtm.start':
                    new Date().getTime(),
                    event:'gtm.js'
                });

                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'
                    ?'&l='+l:'';

                j.async=true;

                j.src=
                    'https://www.googletagmanager.com/gtm.js?id='
                    +i+dl;

                f.parentNode.insertBefore(j,f);

            })(window,document,'script','dataLayer','${config.gtmId}');
        `;

        document.head.appendChild(script);
    }


    /*
     * GOOGLE ANALYTICS
     */

    if (
        config.trackingEnabled?.ga &&
        config.gaMeasurementId
    ) {

        if (
            document.querySelector(
                `script[data-ga="${config.gaMeasurementId}"]`
            )
        ) {
            return;
        }

        const script =
            document.createElement("script");

        script.async = true;

        script.src =
            `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;

        script.dataset.ga =
            config.gaMeasurementId;

        document.head.appendChild(script);


        const configScript =
            document.createElement("script");

        configScript.innerHTML = `
            window.dataLayer =
                window.dataLayer || [];

            function gtag(){
                dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag(
                'config',
                '${config.gaMeasurementId}'
            );
        `;

        document.head.appendChild(
            configScript
        );
    }


    /*
     * META PIXEL
     */

    if (
        config.trackingEnabled?.pixel &&
        config.metaPixelId
    ) {

        if (
            window.fbq ||
            document.querySelector(
                `script[data-meta-pixel="${config.metaPixelId}"]`
            )
        ) {
            return;
        }

        const script =
            document.createElement("script");

        script.dataset.metaPixel =
            config.metaPixelId;

        script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {
                if(f.fbq)return;

                n=f.fbq=function(){
                    n.callMethod ?
                    n.callMethod.apply(
                        n,
                        arguments
                    ) :
                    n.queue.push(arguments)
                };

                if(!f._fbq)
                    f._fbq=n;

                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];

                t=b.createElement(e);
                t.async=!0;
                t.src=v;

                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s);

            }(
                window,
                document,
                'script',
                'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq(
                'init',
                '${config.metaPixelId}'
            );

            fbq(
                'track',
                'PageView'
            );
        `;

        document.head.appendChild(
            script
        );
    }
}


/* =========================================================
   12. MENU MOBILE
   ========================================================= */

function setupMobileMenu() {

    const mobileMenu =
        getElement("mobile-menu");

    const nav =
        document.querySelector(".nav-menu");

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


    /*
     * Fecha o menu quando o usuário
     * seleciona uma opção.
     */

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


    /*
     * Fecha o menu com ESC.
     */

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
   13. NAVEGAÇÃO / SCROLL SUAVE
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
                        link
                            .getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
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
                            ".site-header, header"
                        );

                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;

                    const targetPosition =
                        target.getBoundingClientRect()
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

                    /*
                     * Atualiza a URL sem
                     * recarregar a página.
                     */

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
        document.getElementById(
            "depoimentos"
        );

    if (!section) {
        return;
    }

    /*
     * A seção é independente de
     * Neurodesenvolvimento.
     *
     * Não inserimos depoimentos
     * automaticamente para evitar
     * depoimentos fictícios.
     */

    section.dataset.ready =
        "true";
}


/* =========================================================
   15. ANO AUTOMÁTICO DO FOOTER
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
}


/* =========================================================
   16. LINKS DE CONTATO
   ========================================================= */

function setupContactLinks(config) {

    /*
     * Telefone / WhatsApp
     */

    document
        .querySelectorAll(
            "[data-phone]"
        )
        .forEach(element => {

            if (!config.whatsapp) {
                return;
            }

            const number =
                String(config.whatsapp)
                    .replace(/\D/g, "");

            element.textContent =
                config.whatsapp;

            if (
                element.tagName
                    .toLowerCase() === "a"
            ) {

                element.href =
                    `tel:+${number}`;
            }
        });


    /*
     * Endereço
     */

    document
        .querySelectorAll(
            "[data-address]"
        )
        .forEach(element => {

            if (!config.endereco) {
                return;
            }

            element.textContent =
                config.endereco;
        });
}


/* =========================================================
   17. PROTEÇÃO CONTRA ERROS VISUAIS
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
   18. INICIALIZAÇÃO DO SITE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            /*
             * Carrega configuração
             */

            const config =
                await loadConfig();


            /*
             * Inicializa componentes
             */

            setupProfessionalRegistration(
                config
            );

            setupTopContact(
                config
            );

            setupAbout(
                config
            );

            setupWhatsApp(
                config
            );

            setupFormspree(
                config
            );

            setupSocialLinks(
                config
            );

            setupContactLinks(
                config
            );

            setupTestimonials();

            setupMobileMenu();

            setupSmoothNavigation();

            setupCurrentYear();

            removeEmptyDynamicElements();


            /*
             * Tracking deve ser
             * carregado por último.
             */

            injectTrackingScripts(
                config
            );


            /*
             * Marca o site como
             * completamente inicializado.
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
                "Katlen Ariane — site inicializado."
            );


        } catch (error) {

            console.error(
                "Erro ao inicializar o site:",
                error
            );
        }
    }
);


/* =========================================================
   19. SUPORTE AO RETORNO DO NAVEGADOR
   ========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        const nav =
            document.querySelector(
                ".nav-menu"
            );

        const mobileMenu =
            getElement("mobile-menu");

        if (!nav || !mobileMenu) {
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
    }
);


/* =========================================================
   FIM DO MAIN.JS
   ========================================================= */
