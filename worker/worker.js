"use strict";

/*
=========================================================
 KATLEN ADMIN
 Painel administrativo + API + Cloudflare KV
=========================================================

ROTAS:

GET  /                  → Painel
GET  /login             → Login
POST /api/admin/login   → Autenticação
POST /api/admin/logout  → Logout
GET  /api/admin/config  → Configuração administrativa
PUT  /api/admin/config  → Salvar configuração
GET  /api/config        → Configuração pública

KV:
SITE_KV

SECRETS:
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
AUTH_SECRET
ALLOWED_ORIGIN
=========================================================
*/


/* ======================================================
   CONFIGURAÇÃO
====================================================== */

const CONFIG_KEY = "katlen_config";

const COOKIE_NAME = "katlen_admin_session";

const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas


/* ======================================================
   CONFIGURAÇÃO PADRÃO
====================================================== */

const DEFAULT_CONFIG = {

    site: {
        name: "Katlen Ariane",
        profession: "Psicanalista",
        registration: "CBPC 2022-6172",
        description: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: ""
    },

    social: {
        instagram: "",
        facebook: "",
        tiktok: "",
        linkedin: ""
    },

    forms: {
        formspree: ""
    },

    tracking: {
        metaPixel: "",
        googleAnalytics: "",
        googleTagManager: "",

        metaPixelEnabled: false,
        googleAnalyticsEnabled: false,
        googleTagManagerEnabled: false
    },

    content: {
        formation: "",
        specialization: "",
        experience: "",
        neurodevelopment: ""
    },

    attendance: {
        families: true,
        women: true,
        children: true,
        adolescents: true
    },

    updatedAt: ""
};


/* ======================================================
   HELPERS
====================================================== */

function json(data, status = 200, request = null) {

    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "no-store"
    };

    if (request) {
        addCors(headers, request);
    }

    return new Response(JSON.stringify(data), {
        status,
        headers
    });
}


function html(content, status = 200) {

    return new Response(content, {
        status,
        headers: {
            "Content-Type": "text/html; charset=UTF-8",
            "Cache-Control": "no-store"
        }
    });

}


function addCors(headers, request) {

    const origin = request.headers.get("Origin");

    const allowed = ENV_ALLOWED_ORIGIN(request);

    if (origin && (
        origin === allowed ||
        origin === "https://katlenarianeso.pages.dev"
    )) {

        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Credentials"] = "true";
        headers["Access-Control-Allow-Headers"] =
            "Content-Type, Authorization";
        headers["Access-Control-Allow-Methods"] =
            "GET, POST, PUT, OPTIONS";
    }
}


function ENV_ALLOWED_ORIGIN(request) {

    /*
     * O secret ALLOWED_ORIGIN será utilizado quando existir.
     * O fallback é o domínio atual do site.
     */

    return request.env?.ALLOWED_ORIGIN ||
           "https://katlenarianeso.pages.dev";
}


/* ======================================================
   MERGE SEGURO
====================================================== */

function mergeConfig(base, incoming) {

    const result = structuredClone(base);

    if (!incoming || typeof incoming !== "object") {
        return result;
    }

    for (const section of Object.keys(result)) {

        if (
            incoming[section] &&
            typeof incoming[section] === "object" &&
            !Array.isArray(incoming[section])
        ) {

            for (const key of Object.keys(result[section])) {

                if (
                    Object.prototype.hasOwnProperty.call(
                        incoming[section],
                        key
                    )
                ) {

                    result[section][key] =
                        incoming[section][key];
                }

            }

        }

    }

    return result;
}


/* ======================================================
   KV
====================================================== */

async function getConfig(env) {

    if (!env.SITE_KV) {
        throw new Error("SITE_KV não está configurado.");
    }

    const stored = await env.SITE_KV.get(CONFIG_KEY, "json");

    if (!stored) {
        return structuredClone(DEFAULT_CONFIG);
    }

    return mergeConfig(DEFAULT_CONFIG, stored);
}


async function saveConfig(env, config) {

    if (!env.SITE_KV) {
        throw new Error("SITE_KV não está configurado.");
    }

    config.updatedAt = new Date().toISOString();

    await env.SITE_KV.put(
        CONFIG_KEY,
        JSON.stringify(config)
    );

    return config;
}


/* ======================================================
   HASH SHA-256
====================================================== */

async function sha256(value) {

    const data = new TextEncoder().encode(value);

    const hash = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/* ======================================================
   COMPARAÇÃO SEGURA
====================================================== */

function safeEqual(a, b) {

    if (
        typeof a !== "string" ||
        typeof b !== "string" ||
        a.length !== b.length
    ) {
        return false;
    }

    let result = 0;

    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}


/* ======================================================
   AUTENTICAÇÃO
====================================================== */

async function authenticate(email, password, env) {

    if (!env.ADMIN_EMAIL) {
        return false;
    }

    if (!env.ADMIN_PASSWORD_HASH) {
        return false;
    }

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return false;
    }

    if (
        email.trim().toLowerCase() !==
        env.ADMIN_EMAIL.trim().toLowerCase()
    ) {
        return false;
    }

    const passwordHash = await sha256(password);

    return safeEqual(
        passwordHash,
        env.ADMIN_PASSWORD_HASH.trim().toLowerCase()
    );
}


/* ======================================================
   HMAC
====================================================== */

async function hmacSign(value, secret) {

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        {
            name: "HMAC",
            hash: "SHA-256"
        },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(value)
    );

    return Array.from(new Uint8Array(signature))
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");
}


/* ======================================================
   SESSION
====================================================== */

async function createSession(env) {

    if (!env.AUTH_SECRET) {
        throw new Error("AUTH_SECRET não configurado.");
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const payload = `${timestamp}`;

    const signature = await hmacSign(
        payload,
        env.AUTH_SECRET
    );

    return `${payload}.${signature}`;
}


async function verifySession(request, env) {

    if (!env.AUTH_SECRET) {
        return false;
    }

    const cookie = request.headers.get("Cookie") || "";

    const match = cookie.match(
        new RegExp(
            `${COOKIE_NAME}=([^;]+)`
        )
    );

    if (!match) {
        return false;
    }

    const token = match[1];

    const parts = token.split(".");

    if (parts.length !== 2) {
        return false;
    }

    const timestamp = Number(parts[0]);
    const signature = parts[1];

    if (!Number.isFinite(timestamp)) {
        return false;
    }

    const now = Math.floor(Date.now() / 1000);

    if (
        now - timestamp < 0 ||
        now - timestamp > SESSION_MAX_AGE
    ) {
        return false;
    }

    const expected = await hmacSign(
        parts[0],
        env.AUTH_SECRET
    );

    return safeEqual(
        signature,
        expected
    );
}


/* ======================================================
   COOKIE
====================================================== */

function sessionCookie(token) {

    return [
        `${COOKIE_NAME}=${token}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Strict",
        `Max-Age=${SESSION_MAX_AGE}`
    ].join("; ");
}


function clearSessionCookie() {

    return [
        `${COOKIE_NAME}=`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Strict",
        "Max-Age=0"
    ].join("; ");
}


/* ======================================================
   LOGIN
====================================================== */

function loginPage() {

return `<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Katlen Ariane — Administração</title>

<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    min-height: 100vh;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 24px;

    background:
        linear-gradient(
            135deg,
            #faf8fc,
            #f4effb
        );

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    color: #24202c;
}


.login {

    width: 100%;

    max-width: 430px;

    background: rgba(255,255,255,.96);

    border: 1px solid #ece5f2;

    border-radius: 24px;

    padding: 38px;

    box-shadow:
        0 20px 60px rgba(50,30,70,.12);
}


.logo {

    width: 64px;

    height: 64px;

    border-radius: 18px;

    display: flex;

    align-items: center;

    justify-content: center;

    margin-bottom: 24px;

    background: #8B5CF6;

    color: white;

    font-size: 25px;

    font-weight: 700;
}


h1 {

    margin: 0 0 8px;

    font-size: 27px;

}


.subtitle {

    margin: 0 0 30px;

    color: #766f7d;

    line-height: 1.6;
}


label {

    display: block;

    margin-bottom: 8px;

    font-size: 14px;

    font-weight: 600;
}


input {

    width: 100%;

    padding: 14px 15px;

    margin-bottom: 18px;

    border: 1px solid #ddd5e4;

    border-radius: 12px;

    outline: none;

    font-size: 15px;

}


input:focus {

    border-color: #8B5CF6;

    box-shadow:
        0 0 0 3px rgba(139,92,246,.12);
}


button {

    width: 100%;

    border: 0;

    border-radius: 12px;

    padding: 15px;

    background: #8B5CF6;

    color: white;

    font-weight: 700;

    font-size: 15px;

    cursor: pointer;
}


button:hover {

    opacity: .92;
}


.error {

    display: none;

    margin-bottom: 18px;

    padding: 12px;

    border-radius: 10px;

    background: #fff0f0;

    color: #b42318;

    font-size: 14px;
}

</style>

</head>


<body>

<div class="login">

    <div class="logo">K</div>

    <h1>Painel administrativo</h1>

    <p class="subtitle">
        Katlen Ariane — Psicanalista
    </p>

    <div id="error" class="error">
        E-mail ou senha incorretos.
    </div>

    <form id="loginForm">

        <label for="email">
            E-mail
        </label>

        <input
            id="email"
            type="email"
            autocomplete="username"
            required
        >

        <label for="password">
            Senha
        </label>

        <input
            id="password"
            type="password"
            autocomplete="current-password"
            required
        >

        <button type="submit">
            Entrar no painel
        </button>

    </form>

</div>


<script>

document
.getElementById("loginForm")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    const error =
        document.getElementById("error");

    error.style.display = "none";

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "/api/admin/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            error.style.display = "block";

            return;
        }

        window.location.href = "/";

    } catch (err) {

        error.textContent =
            "Não foi possível conectar ao servidor.";

        error.style.display = "block";
    }

});

</script>

</body>

</html>`;

}


/* ======================================================
   PAINEL
====================================================== */

function adminPage() {

return `<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Katlen Ariane — Painel</title>

<style>

* {
    box-sizing: border-box;
}


:root {

    --purple: #8B5CF6;

    --purple-dark: #7044d8;

    --bg: #f7f5f9;

    --card: #ffffff;

    --text: #27222d;

    --muted: #77707e;

    --border: #e8e1eb;

}


body {

    margin: 0;

    background: var(--bg);

    color: var(--text);

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}


header {

    position: sticky;

    top: 0;

    z-index: 20;

    background: rgba(255,255,255,.95);

    backdrop-filter: blur(14px);

    border-bottom: 1px solid var(--border);
}


.header-inner {

    max-width: 1280px;

    margin: auto;

    padding: 18px 24px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;
}


.brand {

    display: flex;

    align-items: center;

    gap: 13px;
}


.brand-icon {

    width: 44px;

    height: 44px;

    border-radius: 13px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: var(--purple);

    color: white;

    font-weight: 800;
}


.brand-title {

    font-weight: 750;

    font-size: 17px;
}


.brand-subtitle {

    color: var(--muted);

    font-size: 12px;

    margin-top: 2px;
}


.logout {

    border: 1px solid var(--border);

    background: white;

    border-radius: 10px;

    padding: 10px 14px;

    cursor: pointer;

    font-weight: 600;
}


main {

    max-width: 1280px;

    margin: auto;

    padding: 30px 24px 70px;
}


.hero {

    margin-bottom: 28px;
}


.hero h1 {

    margin: 0 0 8px;

    font-size: 31px;
}


.hero p {

    margin: 0;

    color: var(--muted);
}


.grid {

    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 20px;
}


.card {

    background: var(--card);

    border: 1px solid var(--border);

    border-radius: 18px;

    padding: 23px;
}


.card.full {

    grid-column: 1 / -1;
}


.card h2 {

    margin: 0 0 20px;

    font-size: 18px;
}


.field {

    margin-bottom: 17px;
}


.field:last-child {

    margin-bottom: 0;
}


label {

    display: block;

    margin-bottom: 7px;

    font-size: 13px;

    font-weight: 650;
}


input,
textarea {

    width: 100%;

    border: 1px solid #ded7e2;

    border-radius: 10px;

    padding: 12px 13px;

    outline: none;

    font: inherit;

    background: #fff;
}


textarea {

    min-height: 100px;

    resize: vertical;
}


input:focus,
textarea:focus {

    border-color: var(--purple);

    box-shadow:
        0 0 0 3px rgba(139,92,246,.10);
}


.checkbox {

    display: flex;

    align-items: center;

    gap: 10px;

    margin: 12px 0;
}


.checkbox input {

    width: auto;
}


.actions {

    position: sticky;

    bottom: 18px;

    z-index: 10;

    margin-top: 24px;

    padding: 15px;

    background: rgba(255,255,255,.94);

    backdrop-filter: blur(12px);

    border: 1px solid var(--border);

    border-radius: 16px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    box-shadow:
        0 10px 35px rgba(30,20,40,.10);
}


.save {

    border: 0;

    border-radius: 11px;

    padding: 13px 22px;

    background: var(--purple);

    color: white;

    font-weight: 750;

    cursor: pointer;
}


.save:hover {

    background: var(--purple-dark);
}


.status {

    color: var(--muted);

    font-size: 13px;
}


.success {

    color: #157347;
}


.error {

    color: #b42318;
}


@media (max-width: 800px) {

    .grid {

        grid-template-columns: 1fr;
    }

    .card.full {

        grid-column: auto;
    }

    .actions {

        align-items: stretch;

        flex-direction: column;
    }

    .save {

        width: 100%;
    }

}

</style>

</head>


<body>


<header>

<div class="header-inner">

    <div class="brand">

        <div class="brand-icon">
            K
        </div>

        <div>

            <div class="brand-title">
                Katlen Ariane
            </div>

            <div class="brand-subtitle">
                Painel administrativo
            </div>

        </div>

    </div>

    <button
        class="logout"
        id="logout"
    >
        Sair
    </button>

</div>

</header>


<main>

<div class="hero">

    <h1>
        Configurações do site
    </h1>

    <p>
        Gerencie as informações que serão utilizadas
        pelo site da Katlen Ariane.
    </p>

</div>


<div class="grid">


<!-- ==================================================
     DADOS PROFISSIONAIS
=================================================== -->

<section class="card">

<h2>Dados profissionais</h2>


<div class="field">

<label>
Nome
</label>

<input
    id="site_name"
    type="text"
>

</div>


<div class="field">

<label>
Profissão
</label>

<input
    id="site_profession"
    type="text"
>

</div>


<div class="field">

<label>
Registro profissional
</label>

<input
    id="site_registration"
    type="text"
>

</div>


<div class="field">

<label>
E-mail
</label>

<input
    id="site_email"
    type="email"
>

</div>


<div class="field">

<label>
Telefone
</label>

<input
    id="site_phone"
    type="text"
>

</div>


<div class="field">

<label>
WhatsApp
</label>

<input
    id="site_whatsapp"
    type="text"
    placeholder="5554999999999"
>

</div>


<div class="field">

<label>
Endereço
</label>

<input
    id="site_address"
    type="text"
>

</div>


</section>


<!-- ==================================================
     REDES SOCIAIS
=================================================== -->

<section class="card">

<h2>Redes sociais</h2>


<div class="field">

<label>
Instagram
</label>

<input
    id="social_instagram"
    type="url"
    placeholder="https://instagram.com/..."
>

</div>


<div class="field">

<label>
Facebook
</label>

<input
    id="social_facebook"
    type="url"
>

</div>


<div class="field">

<label>
TikTok
</label>

<input
    id="social_tiktok"
    type="url"
>

</div>


<div class="field">

<label>
LinkedIn
</label>

<input
    id="social_linkedin"
    type="url"
>

</div>


</section>


<!-- ==================================================
     FORMS
=================================================== -->

<section class="card">

<h2>Formulários</h2>


<div class="field">

<label>
Formspree
</label>

<input
    id="forms_formspree"
    type="text"
    placeholder="https://formspree.io/f/..."
>

</div>


</section>


<!-- ==================================================
     RASTREAMENTO
=================================================== -->

<section class="card">

<h2>Marketing e rastreamento</h2>


<div class="field">

<label>
Meta Pixel
</label>

<input
    id="tracking_metaPixel"
    type="text"
>

<div class="checkbox">

<input
    id="tracking_metaPixelEnabled"
    type="checkbox"
>

<label for="tracking_metaPixelEnabled">
Ativar Meta Pixel
</label>

</div>

</div>


<div class="field">

<label>
Google Analytics
</label>

<input
    id="tracking_googleAnalytics"
    type="text"
    placeholder="G-XXXXXXXXXX"
>

<div class="checkbox">

<input
    id="tracking_googleAnalyticsEnabled"
    type="checkbox"
>

<label for="tracking_googleAnalyticsEnabled">
Ativar Google Analytics
</label>

</div>

</div>


<div class="field">

<label>
Google Tag Manager
</label>

<input
    id="tracking_googleTagManager"
    type="text"
    placeholder="GTM-XXXXXXX"
>

<div class="checkbox">

<input
    id="tracking_googleTagManagerEnabled"
    type="checkbox"
>

<label for="tracking_googleTagManagerEnabled">
Ativar Google Tag Manager
</label>

</div>

</div>


</section>


<!-- ==================================================
     FORMAÇÃO
=================================================== -->

<section class="card full">

<h2>Formação e experiência</h2>


<div class="field">

<label>
Formação
</label>

<textarea
    id="content_formation"
></textarea>

</div>


<div class="field">

<label>
Especialização
</label>

<textarea
    id="content_specialization"
></textarea>

</div>


<div class="field">

<label>
Experiência profissional
</label>

<textarea
    id="content_experience"
></textarea>

</div>


<div class="field">

<label>
Neurodesenvolvimento
</label>

<textarea
    id="content_neurodevelopment"
></textarea>

</div>


</section>


<!-- ==================================================
     PÚBLICO
=================================================== -->

<section class="card full">

<h2>
Atendimentos
</h2>


<div class="checkbox">

<input
    id="attendance_families"
    type="checkbox"
>

<label for="attendance_families">
Famílias
</label>

</div>


<div class="checkbox">

<input
    id="attendance_women"
    type="checkbox"
>

<label for="attendance_women">
Mulheres
</label>

</div>


<div class="checkbox">

<input
    id="attendance_children"
    type="checkbox"
>

<label for="attendance_children">
Crianças
</label>

</div>


<div class="checkbox">

<input
    id="attendance_adolescents"
    type="checkbox"
>

<label for="attendance_adolescents">
Adolescentes
</label>

</div>


</section>


</div>


<div class="actions">

<div
    id="status"
    class="status"
>
    Carregando configurações...
</div>


<button
    id="save"
    class="save"
>
    Salvar alterações
</button>

</div>


</main>


<script>


let config = null;


/* ==================================================
   HELPERS
=================================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";

    }

}


function setChecked(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.checked =
            Boolean(value);

    }

}


function getValue(id) {

    return document
        .getElementById(id)
        .value
        .trim();

}


function getChecked(id) {

    return document
        .getElementById(id)
        .checked;

}


/* ==================================================
   CARREGAR
=================================================== */

async function loadConfig() {

    const status =
        document.getElementById("status");

    try {

        const response =
            await fetch(
                "/api/admin/config",
                {
                    credentials: "include"
                }
            );

        if (response.status === 401) {

            window.location.href =
                "/login";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar."
            );

        }


        config =
            await response.json();


        /* DADOS */

        setValue(
            "site_name",
            config.site.name
        );

        setValue(
            "site_profession",
            config.site.profession
        );

        setValue(
            "site_registration",
            config.site.registration
        );

        setValue(
            "site_email",
            config.site.email
        );

        setValue(
            "site_phone",
            config.site.phone
        );

        setValue(
            "site_whatsapp",
            config.site.whatsapp
        );

        setValue(
            "site_address",
            config.site.address
        );


        /* REDES */

        setValue(
            "social_instagram",
            config.social.instagram
        );

        setValue(
            "social_facebook",
            config.social.facebook
        );

        setValue(
            "social_tiktok",
            config.social.tiktok
        );

        setValue(
            "social_linkedin",
            config.social.linkedin
        );


        /* FORMS */

        setValue(
            "forms_formspree",
            config.forms.formspree
        );


        /* TRACKING */

        setValue(
            "tracking_metaPixel",
            config.tracking.metaPixel
        );

        setValue(
            "tracking_googleAnalytics",
            config.tracking.googleAnalytics
        );

        setValue(
            "tracking_googleTagManager",
            config.tracking.googleTagManager
        );


        setChecked(
            "tracking_metaPixelEnabled",
            config.tracking.metaPixelEnabled
        );

        setChecked(
            "tracking_googleAnalyticsEnabled",
            config.tracking.googleAnalyticsEnabled
        );

        setChecked(
            "tracking_googleTagManagerEnabled",
            config.tracking.googleTagManagerEnabled
        );


        /* CONTEÚDO */

        setValue(
            "content_formation",
            config.content.formation
        );

        setValue(
            "content_specialization",
            config.content.specialization
        );

        setValue(
            "content_experience",
            config.content.experience
        );

        setValue(
            "content_neurodevelopment",
            config.content.neurodevelopment
        );


        /* ATENDIMENTOS */

        setChecked(
            "attendance_families",
            config.attendance.families
        );

        setChecked(
            "attendance_women",
            config.attendance.women
        );

        setChecked(
            "attendance_children",
            config.attendance.children
        );

        setChecked(
            "attendance_adolescents",
            config.attendance.adolescents
        );


        status.textContent =
            "Configurações carregadas.";

    } catch (error) {

        console.error(error);

        status.textContent =
            "Erro ao carregar configurações.";

        status.className =
            "status error";
    }

}


/* ==================================================
   SALVAR
=================================================== */

async function saveConfig() {

    const status =
        document.getElementById("status");

    const button =
        document.getElementById("save");


    button.disabled = true;

    button.textContent =
        "Salvando...";


    status.textContent =
        "Salvando alterações...";

    status.className =
        "status";


    const newConfig = {

        site: {

            name:
                getValue("site_name"),

            profession:
                getValue("site_profession"),

            registration:
                getValue("site_registration"),

            description:
                config.site.description,

            phone:
                getValue("site_phone"),

            whatsapp:
                getValue("site_whatsapp"),

            email:
                getValue("site_email"),

            address:
                getValue("site_address")
        },


        social: {

            instagram:
                getValue("social_instagram"),

            facebook:
                getValue("social_facebook"),

            tiktok:
                getValue("social_tiktok"),

            linkedin:
                getValue("social_linkedin")
        },


        forms: {

            formspree:
                getValue("forms_formspree")
        },


        tracking: {

            metaPixel:
                getValue("tracking_metaPixel"),

            googleAnalytics:
                getValue("tracking_googleAnalytics"),

            googleTagManager:
                getValue("tracking_googleTagManager"),

            metaPixelEnabled:
                getChecked(
                    "tracking_metaPixelEnabled"
                ),

            googleAnalyticsEnabled:
                getChecked(
                    "tracking_googleAnalyticsEnabled"
                ),

            googleTagManagerEnabled:
                getChecked(
                    "tracking_googleTagManagerEnabled"
                )
        },


        content: {

            formation:
                getValue("content_formation"),

            specialization:
                getValue("content_specialization"),

            experience:
                getValue("content_experience"),

            neurodevelopment:
                getValue(
                    "content_neurodevelopment"
                )
        },


        attendance: {

            families:
                getChecked(
                    "attendance_families"
                ),

            women:
                getChecked(
                    "attendance_women"
                ),

            children:
                getChecked(
                    "attendance_children"
                ),

            adolescents:
                getChecked(
                    "attendance_adolescents"
                )
        }

    };


    try {

        const response =
            await fetch(
                "/api/admin/config",
                {
                    method: "PUT",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(newConfig)
                }
            );


        if (response.status === 401) {

            window.location.href =
                "/login";

            return;
        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao salvar."
            );

        }


        config = data;


        status.textContent =
            "Alterações salvas com sucesso.";

        status.className =
            "status success";


    } catch (error) {

        console.error(error);

        status.textContent =
            error.message ||
            "Erro ao salvar.";

        status.className =
            "status error";

    } finally {

        button.disabled = false;

        button.textContent =
            "Salvar alterações";

    }

}


/* ==================================================
   LOGOUT
=================================================== */

document
.getElementById("logout")
.addEventListener(
    "click",
    async function() {

        await fetch(
            "/api/admin/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

        window.location.href =
            "/login";

    }
);


/* ==================================================
   SAVE
=================================================== */

document
.getElementById("save")
.addEventListener(
    "click",
    saveConfig
);


/* ==================================================
   START
=================================================== */

loadConfig();

</script>

</body>

</html>`;

}


/* ======================================================
   HANDLER PRINCIPAL
====================================================== */

export default {

    async fetch(request, env) {

        const url =
            new URL(request.url);

        const path =
            url.pathname;

        const method =
            request.method;


        /* ==============================================
           CORS PREFLIGHT
        ============================================== */

        if (method === "OPTIONS") {

            const headers = {};

            addCors(
                headers,
                request
            );

            return new Response(
                null,
                {
                    status: 204,
                    headers
                }
            );

        }


        /* ==============================================
           LOGIN
        ============================================== */

        if (
            path === "/login" &&
            method === "GET"
        ) {

            return html(
                loginPage()
            );

        }


        /* ==============================================
           POST LOGIN
        ============================================== */

        if (
            path === "/api/admin/login" &&
            method === "POST"
        ) {

            try {

                const body =
                    await request.json();


                const authenticated =
                    await authenticate(
                        body.email,
                        body.password,
                        env
                    );


                if (!authenticated) {

                    return json(
                        {
                            success: false,
                            error:
                                "Credenciais inválidas."
                        },
                        401,
                        request
                    );

                }


                const session =
                    await createSession(env);


                const headers = {

                    "Content-Type":
                        "application/json",

                    "Cache-Control":
                        "no-store",

                    "Set-Cookie":
                        sessionCookie(session)

                };


                addCors(
                    headers,
                    request
                );


                return new Response(

                    JSON.stringify({
                        success: true
                    }),

                    {
                        status: 200,
                        headers
                    }

                );

            } catch (error) {

                console.error(error);

                return json(
                    {
                        success: false,
                        error:
                            "Erro interno."
                    },
                    500,
                    request
                );

            }

        }


        /* ==============================================
           LOGOUT
        ============================================== */

        if (
            path === "/api/admin/logout" &&
            method === "POST"
        ) {

            const headers = {

                "Content-Type":
                    "application/json",

                "Set-Cookie":
                    clearSessionCookie(),

                "Cache-Control":
                    "no-store"

            };


            addCors(
                headers,
                request
            );


            return new Response(

                JSON.stringify({
                    success: true
                }),

                {
                    status: 200,
                    headers
                }

            );

        }


        /* ==============================================
           API PÚBLICA
        ============================================== */

        if (
            path === "/api/config" &&
            method === "GET"
        ) {

            try {

                const config =
                    await getConfig(env);


                return json(
                    config,
                    200,
                    request
                );

            } catch (error) {

                console.error(error);

                return json(
                    {
                        error:
                            "Não foi possível carregar a configuração."
                    },
                    500,
                    request
                );

            }

        }


        /* ==============================================
           API ADMIN — GET
        ============================================== */

        if (
            path === "/api/admin/config" &&
            method === "GET"
        ) {

            const authenticated =
                await verifySession(
                    request,
                    env
                );


            if (!authenticated) {

                return json(
                    {
                        error:
                            "Não autorizado."
                    },
                    401,
                    request
                );

            }


            try {

                const config =
                    await getConfig(env);


                return json(
                    config,
                    200,
                    request
                );

            } catch (error) {

                console.error(error);

                return json(
                    {
                        error:
                            "Erro ao carregar configuração."
                    },
                    500,
                    request
                );

            }

        }


        /* ==============================================
           API ADMIN — PUT
        ============================================== */

        if (
            path === "/api/admin/config" &&
            method === "PUT"
        ) {

            const authenticated =
                await verifySession(
                    request,
                    env
                );


            if (!authenticated) {

                return json(
                    {
                        error:
                            "Não autorizado."
                    },
                    401,
                    request
                );

            }


            try {

                const body =
                    await request.json();


                const current =
                    await getConfig(env);


                const updated =
                    mergeConfig(
                        current,
                        body
                    );


                const saved =
                    await saveConfig(
                        env,
                        updated
                    );


                return json(
                    saved,
                    200,
                    request
                );

            } catch (error) {

                console.error(error);

                return json(
                    {
                        error:
                            "Erro ao salvar configuração."
                    },
                    500,
                    request
                );

            }

        }


        /* ==============================================
           PAINEL
        ============================================== */

        if (
            path === "/" &&
            method === "GET"
        ) {

            const authenticated =
                await verifySession(
                    request,
                    env
                );


            if (!authenticated) {

                return Response.redirect(
                    `${url.origin}/login`,
                    302
                );

            }


            return html(
                adminPage()
            );

        }


        /* ==============================================
           404
        ============================================== */

        return new Response(
            "Página não encontrada.",
            {
                status: 404,
                headers: {
                    "Content-Type":
                        "text/plain; charset=UTF-8"
                }
            }
        );

    }

};
