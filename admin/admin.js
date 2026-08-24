const API = "";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const loginView =
    document.getElementById("login-view");

const panelView =
    document.getElementById("panel-view");

const loginForm =
    document.getElementById("login-form");

const configForm =
    document.getElementById("config-form");

const logoutButton =
    document.getElementById("logout-button");

const message =
    document.getElementById("message");

const saveStatus =
    document.getElementById("save-status");

const saveButton =
    document.getElementById("save-button");


/* =========================================================
   MENSAGENS
   ========================================================= */

function showMessage(text, type = "success") {

    message.textContent = text;

    message.className =
        `message ${type}`;

}

function clearMessage() {

    message.textContent = "";

    message.className = "message";

}


/* =========================================================
   CAMPOS
   ========================================================= */

function getValue(id) {

    return document
        .getElementById(id)
        .value
        .trim();

}


function setValue(id, value) {

    document
        .getElementById(id)
        .value = value || "";

}


/* =========================================================
   PREENCHER FORMULÁRIO
   ========================================================= */

function fillConfig(config) {

    setValue(
        "professionalRegistration",
        config.professionalRegistration ||
        "CBPC 2022-6172"
    );

    setValue(
        "professionalRegistrationLabel",
        config.professionalRegistrationLabel ||
        "Registro profissional"
    );

    setValue(
        "formacao",
        config.formacao
    );

    setValue(
        "especializacoes",
        config.especializacoes
    );

    setValue(
        "experiencia",
        config.experiencia
    );

    setValue(
        "whatsapp",
        config.whatsapp
    );

    setValue(
        "endereco",
        config.endereco
    );

    setValue(
        "formspreeEndpoint",
        config.formspreeEndpoint
    );

    setValue(
        "instagram",
        config.instagram
    );

    setValue(
        "facebook",
        config.facebook
    );

    setValue(
        "tiktok",
        config.tiktok
    );

    setValue(
        "linkedin",
        config.linkedin
    );

    setValue(
        "metaPixelId",
        config.metaPixelId
    );

    setValue(
        "gaMeasurementId",
        config.gaMeasurementId
    );

    setValue(
        "gtmId",
        config.gtmId
    );


    const tracking =
        config.trackingEnabled || {};


    document.getElementById(
        "pixelEnabled"
    ).checked = !!tracking.pixel;


    document.getElementById(
        "gaEnabled"
    ).checked = !!tracking.ga;


    document.getElementById(
        "gtmEnabled"
    ).checked = !!tracking.gtm;

}


/* =========================================================
   MOSTRAR PAINEL
   ========================================================= */

function showPanel() {

    loginView.hidden = true;

    panelView.hidden = false;

}


/* =========================================================
   MOSTRAR LOGIN
   ========================================================= */

function showLogin() {

    loginView.hidden = false;

    panelView.hidden = true;

}


/* =========================================================
   CARREGAR CONFIGURAÇÃO
   ========================================================= */

async function loadConfig() {

    clearMessage();

    try {

        const response =
            await fetch(
                `${API}/api/admin/config`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (response.status === 401) {

            showLogin();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar as configurações."
            );

        }


        const config =
            await response.json();


        fillConfig(config);

        showPanel();

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Não foi possível conectar ao painel.",
            "error"
        );

        showLogin();

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();


        const username =
            getValue("login-user");

        const password =
            document
                .getElementById("login-pass")
                .value;


        if (!username || !password) {

            showMessage(
                "Informe usuário e senha.",
                "error"
            );

            return;

        }


        const button =
            loginForm.querySelector("button");


        button.disabled = true;

        button.textContent =
            "Entrando...";


        try {

            const response =
                await fetch(
                    `${API}/api/login`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Usuário ou senha inválidos."
                );

            }


            document
                .getElementById("login-pass")
                .value = "";


            showMessage(
                "Login realizado com sucesso."
            );


            await loadConfig();

        }

        catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Falha ao realizar login.",
                "error"
            );

        }

        finally {

            button.disabled = false;

            button.textContent =
                "Entrar";

        }

    }
);


/* =========================================================
   SALVAR
   ========================================================= */

configForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();

        saveStatus.textContent = "";

        saveButton.disabled = true;

        saveButton.textContent =
            "Salvando...";


        const payload = {

            professionalRegistrationLabel:
                getValue(
                    "professionalRegistrationLabel"
                ),

            professionalRegistration:
                getValue(
                    "professionalRegistration"
                ) ||
                "CBPC 2022-6172",

            formacao:
                getValue("formacao"),

            especializacoes:
                getValue("especializacoes"),

            experiencia:
                getValue("experiencia"),

            whatsapp:
                getValue("whatsapp"),

            endereco:
                getValue("endereco"),

            formspreeEndpoint:
                getValue("formspreeEndpoint"),

            instagram:
                getValue("instagram"),

            facebook:
                getValue("facebook"),

            tiktok:
                getValue("tiktok"),

            linkedin:
                getValue("linkedin"),

            metaPixelId:
                getValue("metaPixelId"),

            gaMeasurementId:
                getValue("gaMeasurementId"),

            gtmId:
                getValue("gtmId"),

            trackingEnabled: {

                pixel:
                    document
                        .getElementById("pixelEnabled")
                        .checked,

                ga:
                    document
                        .getElementById("gaEnabled")
                        .checked,

                gtm:
                    document
                        .getElementById("gtmEnabled")
                        .checked

            }

        };


        try {

            const response =
                await fetch(
                    `${API}/api/admin/config`,
                    {
                        method: "PUT",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(payload)
                    }
                );


            const data =
                await response.json();


            if (response.status === 401) {

                showLogin();

                throw new Error(
                    "Sua sessão expirou. Faça login novamente."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Erro ao salvar configurações."
                );

            }


            fillConfig(data.config);

            showMessage(
                "Configurações salvas com sucesso."
            );

            saveStatus.textContent =
                "Salvo com sucesso.";

        }

        catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Erro ao salvar.",
                "error"
            );

        }

        finally {

            saveButton.disabled = false;

            saveButton.textContent =
                "Salvar configurações";

        }

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    async function () {

        logoutButton.disabled = true;

        try {

            await fetch(
                `${API}/api/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        }

        catch (error) {

            console.error(error);

        }

        finally {

            showLogin();

            clearMessage();

            logoutButton.disabled = false;

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

loadConfig();
