/* =========================================================
   ADM KATLEN ARIANE
   ADMIN.JS
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

/*
 * Se o Worker estiver no mesmo domínio do painel:
 *
 *     const API = "";
 *
 * Se o Worker estiver em outro domínio:
 *
 *     const API = "https://seu-worker.seu-subdominio.workers.dev";
 */

const API = "";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const loginView = document.getElementById("login-view");
const panelView = document.getElementById("panel-view");

const loginUser = document.getElementById("login-user");
const loginPass = document.getElementById("login-pass");

const btnLogin = document.getElementById("btn-login");
const btnSave = document.getElementById("btn-save");
const btnLogout = document.getElementById("btn-logout");

const msg = document.getElementById("msg");


/* =========================================================
   MENSAGENS
   ========================================================= */

function showMsg(text, type = "success") {

    if (!msg) return;

    msg.textContent = text;

    msg.className = "";

    if (type === "error") {
        msg.classList.add("message-error");
    }

    if (type === "success") {
        msg.classList.add("message-success");
    }

    if (type === "info") {
        msg.classList.add("message-info");
    }
}


/* =========================================================
   ESTADO DOS BOTÕES
   ========================================================= */

function setButtonLoading(button, loading, loadingText = "Aguarde...") {

    if (!button) return;

    if (loading) {

        button.dataset.originalText = button.textContent;

        button.textContent = loadingText;

        button.disabled = true;

        button.classList.add("is-loading");

    } else {

        button.textContent =
            button.dataset.originalText ||
            button.textContent;

        button.disabled = false;

        button.classList.remove("is-loading");
    }
}


/* =========================================================
   VISUALIZAÇÃO
   ========================================================= */

function showLogin() {

    if (loginView) {
        loginView.style.display = "block";
    }

    if (panelView) {
        panelView.style.display = "none";
    }
}


function showPanel() {

    if (loginView) {
        loginView.style.display = "none";
    }

    if (panelView) {
        panelView.style.display = "block";
    }
}


/* =========================================================
   API
   ========================================================= */

async function apiFetch(endpoint, options = {}) {

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

    return response;
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

        showMsg(
            "Informe o usuário.",
            "error"
        );

        loginUser?.focus();

        return;
    }


    if (!password) {

        showMsg(
            "Informe a senha.",
            "error"
        );

        loginPass?.focus();

        return;
    }


    setButtonLoading(
        btnLogin,
        true,
        "Entrando..."
    );


    try {

        const response = await apiFetch(
            "/api/login",
            {
                method: "POST",

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (!response.ok) {

            showMsg(
                data.error ||
                "Usuário ou senha inválidos.",
                "error"
            );

            return;
        }


        showMsg(
            "Login realizado com sucesso.",
            "success"
        );


        if (loginPass) {
            loginPass.value = "";
        }


        await loadPanel();


    } catch (error) {

        console.error(
            "Erro no login:",
            error
        );

        showMsg(
            "Não foi possível conectar ao servidor.",
            "error"
        );

    } finally {

        setButtonLoading(
            btnLogin,
            false
        );
    }
}


/* =========================================================
   VERIFICAR SESSÃO
   ========================================================= */

async function checkSession() {

    try {

        const response =
            await apiFetch(
                "/api/admin/config",
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            showLogin();

            return false;
        }


        const config =
            await response.json();


        fillForm(config);

        showPanel();

        return true;


    } catch (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        showLogin();

        showMsg(
            "Não foi possível verificar a sessão.",
            "error"
        );

        return false;
    }
}


/* =========================================================
   CARREGAR PAINEL
   ========================================================= */

async function loadPanel() {

    try {

        const response =
            await apiFetch(
                "/api/admin/config",
                {
                    method: "GET"
                }
            );


        if (response.status === 401) {

            showLogin();

            return;
        }


        if (!response.ok) {

            showMsg(
                "Não foi possível carregar as configurações.",
                "error"
            );

            return;
        }


        const config =
            await response.json();


        fillForm(config);

        showPanel();


    } catch (error) {

        console.error(
            "Erro ao carregar painel:",
            error
        );

        showMsg(
            "Erro ao carregar as configurações.",
            "error"
        );
    }
}


/* =========================================================
   PREENCHER FORMULÁRIO
   ========================================================= */

function fillForm(config = {}) {


    /* -----------------------------------------------------
       CONTATO
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       REDES SOCIAIS
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       INFORMAÇÕES PROFISSIONAIS
       ----------------------------------------------------- */

    setValue(
        "professionalRegistration",
        config.professionalRegistration ||
        "CBPC 2022-6172"
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


    /* -----------------------------------------------------
       RASTREAMENTO
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       TOGGLES
       ----------------------------------------------------- */

    const tracking =
        config.trackingEnabled || {};


    setChecked(
        "pixelEnabled",
        !!tracking.pixel
    );


    setChecked(
        "gaEnabled",
        !!tracking.ga
    );


    setChecked(
        "gtmEnabled",
        !!tracking.gtm
    );
}


/* =========================================================
   HELPERS DE FORMULÁRIO
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

        /* Contato */

        whatsapp:
            getValue("whatsapp"),

        endereco:
            getValue("endereco"),

        formspreeEndpoint:
            getValue("formspreeEndpoint"),


        /* Redes sociais */

        instagram:
            getValue("instagram"),

        facebook:
            getValue("facebook"),

        tiktok:
            getValue("tiktok"),

        linkedin:
            getValue("linkedin"),


        /* Profissional */

        professionalRegistrationLabel:
            "Registro profissional",

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


        /* Rastreamento */

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
   VALIDAR CONFIGURAÇÃO
   ========================================================= */

function validateConfig(config) {

    if (
        config.whatsapp &&
        !/^[0-9]+$/.test(
            config.whatsapp
        )
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
   SALVAR
   ========================================================= */

async function saveConfig() {

    const config =
        collectConfig();


    const validation =
        validateConfig(config);


    if (!validation.valid) {

        showMsg(
            validation.message,
            "error"
        );

        return;
    }


    setButtonLoading(
        btnSave,
        true,
        "Salvando..."
    );


    try {

        const response =
            await apiFetch(
                "/api/admin/config",
                {
                    method: "PUT",

                    body:
                        JSON.stringify(config)
                }
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch {

            data = {};
        }


        if (response.status === 401) {

            showLogin();

            showMsg(
                "Sua sessão expirou. Faça login novamente.",
                "error"
            );

            return;
        }


        if (!response.ok) {

            showMsg(
                data.error ||
                "Erro ao salvar as alterações.",
                "error"
            );

            return;
        }


        if (data.config) {

            fillForm(
                data.config
            );
        }


        showMsg(
            "Alterações salvas com sucesso.",
            "success"
        );


    } catch (error) {

        console.error(
            "Erro ao salvar:",
            error
        );

        showMsg(
            "Não foi possível salvar as alterações.",
            "error"
        );

    } finally {

        setButtonLoading(
            btnSave,
            false
        );
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

    setButtonLoading(
        btnLogout,
        true,
        "Saindo..."
    );


    try {

        await apiFetch(
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

        showMsg(
            "Sessão encerrada.",
            "success"
        );

        setButtonLoading(
            btnLogout,
            false
        );
    }
}


/* =========================================================
   ENTER NO LOGIN
   ========================================================= */

function setupLoginKeyboard() {

    if (!loginUser || !loginPass) {
        return;
    }


    [loginUser, loginPass].forEach(
        input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        login();
                    }
                }
            );
        }
    );
}


/* =========================================================
   EVENTOS
   ========================================================= */

function setupEvents() {


    if (btnLogin) {

        btnLogin.addEventListener(
            "click",
            login
        );
    }


    if (btnSave) {

        btnSave.addEventListener(
            "click",
            saveConfig
        );
    }


    if (btnLogout) {

        btnLogout.addEventListener(
            "click",
            logout
        );
    }


    setupLoginKeyboard();
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

async function init() {

    showLogin();

    setupEvents();

    await checkSession();
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);
