"use strict";

/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const API = "https://katlen-admin.aisermelk.workers.dev";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const loginView = document.getElementById("login-view");
const panelView = document.getElementById("panel-view");

const loginForm = document.getElementById("login-form");
const configForm = document.getElementById("config-form");

const loginUser = document.getElementById("login-user");
const loginPass = document.getElementById("login-pass");

const loginButton = document.getElementById("login-button");
const saveButton = document.getElementById("save-button");
const logoutButton = document.getElementById("logout-button");

const message = document.getElementById("message");
const saveStatus = document.getElementById("save-status");


/* =========================================================
   MENSAGENS
   ========================================================= */

function showMessage(text, type = "") {
    if (!message) return;

    message.textContent = text;
    message.className = "save-message";

    if (type) {
        message.classList.add(type);
    }
}


function showSaveStatus(text, type = "") {
    if (!saveStatus) return;

    saveStatus.textContent = text;
    saveStatus.className = "save-message";

    if (type) {
        saveStatus.classList.add(type);
    }
}


/* =========================================================
   VISUALIZAÇÃO
   ========================================================= */

function showLogin() {
    if (loginView) {
        loginView.hidden = false;
    }

    if (panelView) {
        panelView.hidden = true;
    }
}


function showPanel() {
    if (loginView) {
        loginView.hidden = true;
    }

    if (panelView) {
        panelView.hidden = false;
    }
}


/* =========================================================
   API
   ========================================================= */

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API}${endpoint}`,
        {
            ...options,

            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.error || `Erro HTTP ${response.status}`
        );
    }

    return data;
}


/* =========================================================
   LOGIN
   ========================================================= */

async function login() {

    const username =
        loginUser?.value.trim() || "";

    const password =
        loginPass?.value || "";


    if (!username) {

        showMessage(
            "Informe o usuário.",
            "error"
        );

        loginUser?.focus();

        return;
    }


    if (!password) {

        showMessage(
            "Informe a senha.",
            "error"
        );

        loginPass?.focus();

        return;
    }


    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";


    try {

        await apiRequest(
            "/api/login",
            {
                method: "POST",

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        loginPass.value = "";

        showPanel();

        await loadConfig();


    } catch (error) {

        console.error("Erro no login:", error);

        showMessage(
            error.message ||
            "Usuário ou senha inválidos.",
            "error"
        );


    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Entrar";
    }
}


/* =========================================================
   VERIFICAR SESSÃO
   ========================================================= */

async function checkSession() {

    try {

        const config =
            await apiRequest(
                "/api/admin/config",
                {
                    method: "GET"
                }
            );


        fillForm(config);

        showPanel();

        return true;


    } catch (error) {

        showLogin();

        return false;
    }
}


/* =========================================================
   CARREGAR CONFIGURAÇÕES
   ========================================================= */

async function loadConfig() {

    try {

        const config =
            await apiRequest(
                "/api/admin/config",
                {
                    method: "GET"
                }
            );


        fillForm(config);

        showPanel();


    } catch (error) {

        console.error(
            "Erro ao carregar configurações:",
            error
        );


        showLogin();

        showMessage(
            "Sua sessão não está mais ativa.",
            "error"
        );
    }
}


/* =========================================================
   PREENCHER FORMULÁRIO
   ========================================================= */

function fillForm(config = {}) {

    setValue(
        "professionalRegistration",
        config.professionalRegistration
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


    setChecked(
        "pixelEnabled",
        tracking.pixel
    );


    setChecked(
        "gaEnabled",
        tracking.ga
    );


    setChecked(
        "gtmEnabled",
        tracking.gtm
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.value =
        value ?? "";
}


function setChecked(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.checked =
        Boolean(value);
}


function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
}


function getChecked(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.checked
        : false;
}


/* =========================================================
   COLETAR CONFIGURAÇÃO
   ========================================================= */

function collectConfig() {

    return {

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


        professionalRegistrationLabel:
            getValue(
                "professionalRegistrationLabel"
            ) ||
            "Registro profissional",


        professionalRegistration:
            getValue(
                "professionalRegistration"
            ),


        formacao:
            getValue("formacao"),

        especializacoes:
            getValue("especializacoes"),

        experiencia:
            getValue("experiencia"),


        metaPixelId:
            getValue("metaPixelId"),

        gaMeasurementId:
            getValue("gaMeasurementId"),

        gtmId:
            getValue("gtmId"),


        trackingEnabled: {

            pixel:
                getChecked("pixelEnabled"),

            ga:
                getChecked("gaEnabled"),

            gtm:
                getChecked("gtmEnabled")
        }
    };
}


/* =========================================================
   VALIDAÇÃO
   ========================================================= */

function validateConfig(config) {

    if (
        config.whatsapp &&
        !/^[0-9]+$/.test(config.whatsapp)
    ) {

        return {
            valid: false,

            message:
                "O WhatsApp deve conter apenas números, incluindo DDI e DDD."
        };
    }


    if (
        config.trackingEnabled.pixel &&
        !config.metaPixelId
    ) {

        return {
            valid: false,

            message:
                "Informe o Meta Pixel ID ou desative o Pixel."
        };
    }


    if (
        config.trackingEnabled.ga &&
        !config.gaMeasurementId
    ) {

        return {
            valid: false,

            message:
                "Informe o Measurement ID do Google Analytics ou desative o GA."
        };
    }


    if (
        config.trackingEnabled.gtm &&
        !config.gtmId
    ) {

        return {
            valid: false,

            message:
                "Informe o ID do Google Tag Manager ou desative o GTM."
        };
    }


    return {
        valid: true
    };
}


/* =========================================================
   SALVAR CONFIGURAÇÕES
   ========================================================= */

async function saveConfig() {

    const config =
        collectConfig();


    const validation =
        validateConfig(config);


    if (!validation.valid) {

        showSaveStatus(
            validation.message,
            "error"
        );

        return;
    }


    saveButton.disabled = true;
    saveButton.textContent = "Salvando...";


    try {

        const data =
            await apiRequest(
                "/api/admin/config",
                {
                    method: "PUT",

                    body:
                        JSON.stringify(config)
                }
            );


        if (data.config) {

            fillForm(
                data.config
            );
        }


        showSaveStatus(
            "Configurações salvas com sucesso.",
            "success"
        );


    } catch (error) {

        console.error(
            "Erro ao salvar:",
            error
        );


        if (
            error.message.includes(
                "Não autenticado"
            )
        ) {

            showLogin();

            showMessage(
                "Sua sessão expirou. Faça login novamente.",
                "error"
            );

            return;
        }


        showSaveStatus(
            error.message ||
            "Não foi possível salvar as configurações.",
            "error"
        );


    } finally {

        saveButton.disabled = false;
        saveButton.textContent =
            "Salvar configurações";
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

    logoutButton.disabled = true;
    logoutButton.textContent = "Saindo...";


    try {

        await apiRequest(
            "/api/logout",
            {
                method: "POST"
            }
        );


    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );


    } finally {

        showLogin();

        if (loginUser) {
            loginUser.value = "";
        }

        if (loginPass) {
            loginPass.value = "";
        }


        showMessage(
            "Sessão encerrada.",
            "success"
        );


        logoutButton.disabled = false;
        logoutButton.textContent = "Sair";
    }
}


/* =========================================================
   EVENTOS
   ========================================================= */

function setupEvents() {

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                login();
            }
        );
    }


    if (configForm) {

        configForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveConfig();
            }
        );
    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );
    }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

async function init() {

    showLogin();

    setupEvents();

    await checkSession();
}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();
}
