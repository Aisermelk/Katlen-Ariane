/* =========================================================
KATLEN ARIANE — MAIN.JS
Site institucional / Psicanálise

Integração:
V8 Admin Universal

O V8 Loader é responsável por:

* WhatsApp
* Redes sociais
* Formspree
* Meta Pixel
* Google Analytics
* Google Tag Manager
* Leads
* Configurações dinâmicas

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

```
return document.getElementById(id);
```

}

function setText(id, value) {

```
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
    String(value);
```

}

function hideElement(element) {

```
if (!element) {
    return;
}

element.style.display =
    "none";
```

}

function showElement(
element,
display = ""
) {

```
if (!element) {
    return;
}

element.style.display =
    display;
```

}

/* =========================================================
3. CONFIGURAÇÃO RECEBIDA DO V8 ADMIN
========================================================= */

let V8_CONFIG = null;

function getConfigValue(
path,
fallback = ""
) {

```
if (
    !V8_CONFIG ||
    !path
) {

    return fallback;
}


const value =
    path
        .split(".")
        .reduce(
            (
                current,
                key
            ) => {

                if (
                    current ===
                    null ||
                    current ===
                    undefined
                ) {

                    return undefined;
                }

                return current[key];

            },
            V8_CONFIG
        );


if (
    value ===
    undefined ||
    value ===
    null
) {

    return fallback;
}


return value;
```

}

/* =========================================================
4. REGISTRO PROFISSIONAL
========================================================= */

function setupProfessionalRegistration() {

```
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
```

}

/* =========================================================
5. RODAPÉ
========================================================= */

function setupFooter() {

```
const whatsapp =
    String(
        getConfigValue(
            "site.whatsapp",
            ""
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


const footerWhatsapp =
    getElement(
        "footer-whatsapp"
    );


if (footerWhatsapp) {

    if (whatsapp) {

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
```

}

/* =========================================================
6. CONTEÚDO SOBRE
========================================================= */

function setupAbout() {

```
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


/*
 * O conteúdo principal de formação
 * permanece no index.html.
 */


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
```

}

/* =========================================================
7. WHATSAPP
========================================================= */

function normalizeWhatsAppNumber(
number
) {

```
return String(
    number || ""
)
    .replace(
        /\D/g,
        ""
    )
    .trim();
```

}

function createWhatsAppURL(
number,
message
) {

```
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
    "https://wa.me/" +
    cleanNumber +
    "?text=" +
    encodedMessage
);
```

}

function setupWhatsApp() {

```
const whatsapp =
    String(
        getConfigValue(
            "site.whatsapp",
            ""
        )
    ).trim();


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
        ? "configurado"
        : "não configurado"
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

        hideElement(
            whatsappLink
        );
    }
}


/*
 * Elementos data-whatsapp
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
 * Links antigos #whatsapp
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
        }
    );


/*
 * Mensagens personalizadas
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
```

}

/* =========================================================
8. CONTATO
========================================================= */

function setupContactLinks() {

```
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
```

}

/* =========================================================
9. REDES SOCIAIS
========================================================= */

function setupSocialLinks() {

```
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
    }
);
```

}

/* =========================================================
10. FORMSPREE
========================================================= */

function setupFormspree() {

```
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
```

}

/* =========================================================
11. MENU MOBILE
========================================================= */

function setupMobileMenu() {

```
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
```

}

/* =========================================================
12. NAVEGAÇÃO SUAVE
========================================================= */

function setupSmoothNavigation() {

```
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
```

}

/* =========================================================
13. DEPOIMENTOS
========================================================= */

function setupTestimonials() {

```
const section =
    getElement(
        "depoimentos"
    );


if (!section) {
    return;
}


section.dataset.ready =
    "true";
```

}

/* =========================================================
14. ANO AUTOMÁTICO
========================================================= */

function setupCurrentYear() {

```
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
```

}

/* =========================================================
15. CAMPOS DINÂMICOS
========================================================= */

function removeEmptyDynamicElements() {

```
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
```

}

/* =========================================================
16. EVENTO V8 ADMIN
========================================================= */

function setupV8AdminListener() {

```
document.addEventListener(
    "v8admin:ready",
    event => {

        V8_CONFIG =
            event.detail || {};


        console.info(
            "V8 Admin Universal conectado.",
            V8_PROJECT_ID
        );


        /*
         * Executa tudo que depende
         * da configuração do painel.
         */

        setupProfessionalRegistration();

        setupAbout();

        setupWhatsApp();

        setupFormspree();

        setupSocialLinks();

        setupFooter();

        setupContactLinks();

        removeEmptyDynamicElements();
    },
    {
        once: true
    }
);
```

}

/* =========================================================
17. INICIALIZAÇÃO DA INTERFACE
========================================================= */

function initInterface() {

```
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
```

}

/* =========================================================
18. INICIALIZAÇÃO PRINCIPAL
========================================================= */

function initSite() {

```
try {

    console.info(
        "Katlen Ariane — iniciando..."
    );


    /*
     * Primeiro prepara o listener.
     *
     * O v8-loader.js dispara
     * v8admin:ready quando terminar
     * de carregar a configuração.
     */

    setupV8AdminListener();


    /*
     * Interface independente do painel.
     */

    initInterface();


    /*
     * Caso o loader já tenha carregado
     * antes deste arquivo.
     */

    if (
        window.V8_ADMIN_CONFIG
    ) {

        V8_CONFIG =
            window.V8_ADMIN_CONFIG;


        setupProfessionalRegistration();

        setupAbout();

        setupWhatsApp();

        setupFormspree();

        setupSocialLinks();

        setupFooter();

        setupContactLinks();

        removeEmptyDynamicElements();
    }


} catch (error) {

    console.error(
        "Erro ao inicializar o site:",
        error
    );
}
```

}

/* =========================================================
19. DOM READY
========================================================= */

if (
document.readyState ===
"loading"
) {

```
document.addEventListener(
    "DOMContentLoaded",
    initSite,
    {
        once: true
    }
);
```

} else {

```
initSite();
```

}

/* =========================================================
20. PAGESHOW
========================================================= */

window.addEventListener(
"pageshow",
() => {

```
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
```

);

/* =========================================================
FIM DO MAIN.JS
========================================================= */
