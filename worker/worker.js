/**
 * Worker "admin universal" — Katlen Ariane
 *
 * Rotas:
 *   GET  /api/config          -> config pública (sem dados de login) para o site consumir
 *   POST /api/setup           -> cria o usuário admin inicial (só funciona uma vez; exige X-Setup-Token)
 *   POST /api/login           -> autentica e devolve cookie de sessão (httpOnly)
 *   POST /api/logout          -> limpa a sessão
 *   GET  /api/admin/config    -> config completa (autenticado)
 *   PUT  /api/admin/config    -> atualiza config (autenticado)
 *   GET  /admin               -> painel HTML do admin
 *
 * Variáveis de ambiente esperadas (via `wrangler secret put`):
 *   SESSION_SECRET  -> string aleatória longa, usada para assinar o cookie de sessão
 *   SETUP_TOKEN     -> string aleatória usada uma única vez para criar o admin inicial
 *
 * Binding de KV esperado (wrangler.toml): SITE_KV
 */

const SESSION_COOKIE = "katlen_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

const DEFAULT_CONFIG = {
    whatsapp: "",
    formspreeEndpoint: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
    metaPixelId: "",
    gaMeasurementId: "",
    gtmId: "",
    trackingEnabled: { pixel: false, ga: false, gtm: false },
    professionalRegistrationLabel: "Registro profissional",
    professionalRegistration: "0000000",
    formacao: "",
    especializacoes: "",
    experiencia: ""
};

function corsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,X-Setup-Token",
        "Access-Control-Allow-Credentials": "true"
    };
}

function json(data, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...extraHeaders }
    });
}

// ---------- Crypto helpers ----------

function bufToB64Url(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64UrlToBuf(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const bin = atob(str);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
}

async function hashPassword(password, saltB64) {
    const enc = new TextEncoder();
    const salt = saltB64 ? new Uint8Array(b64UrlToBuf(saltB64)) : crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        256
    );
    return { hash: bufToB64Url(bits), salt: bufToB64Url(salt.buffer ? salt.buffer : salt) };
}

async function verifyPassword(password, storedHash, storedSalt) {
    const { hash } = await hashPassword(password, storedSalt);
    // comparação simples (tempo não-constante é aceitável aqui pois o hash já é derivado com PBKDF2 custoso)
    return hash === storedHash;
}

async function hmacSign(data, secret) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    return bufToB64Url(sig);
}

async function createSessionToken(username, secret) {
    const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
    const payloadB64 = bufToB64Url(new TextEncoder().encode(payload));
    const sig = await hmacSign(payloadB64, secret);
    return `${payloadB64}.${sig}`;
}

async function verifySessionToken(token, secret) {
    if (!token || !token.includes(".")) return null;
    const [payloadB64, sig] = token.split(".");
    const expectedSig = await hmacSign(payloadB64, secret);
    if (expectedSig !== sig) return null;
    try {
        const payload = JSON.parse(new TextDecoder().decode(b64UrlToBuf(payloadB64)));
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

function getCookie(request, name) {
    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
}

async function requireAuth(request, env) {
    const token = getCookie(request, SESSION_COOKIE);
    const payload = await verifySessionToken(token, env.SESSION_SECRET);
    return payload; // null se inválido/expirado
}

// ---------- Handlers ----------

async function handleGetPublicConfig(env) {
    const raw = await env.SITE_KV.get("config");
    const config = raw ? JSON.parse(raw) : DEFAULT_CONFIG;
    // Não expõe nada de login; o restante já é destinado a uso público no site.
    return json(config);
}

async function handleSetup(request, env) {
    const setupToken = request.headers.get("X-Setup-Token");
    if (!setupToken || setupToken !== env.SETUP_TOKEN) {
        return json({ error: "Token de setup inválido." }, 401);
    }
    const existing = await env.SITE_KV.get("admin_user");
    if (existing) {
        return json({ error: "Admin já configurado. Use /api/login." }, 403);
    }
    const { username, password } = await request.json();
    if (!username || !password || password.length < 10) {
        return json({ error: "Informe usuário e senha (mínimo 10 caracteres)." }, 400);
    }
    const { hash, salt } = await hashPassword(password);
    await env.SITE_KV.put("admin_user", JSON.stringify({ username, hash, salt }));
    // Garante que já exista uma config default
    const existingConfig = await env.SITE_KV.get("config");
    if (!existingConfig) {
        await env.SITE_KV.put("config", JSON.stringify(DEFAULT_CONFIG));
    }
    return json({ ok: true });
}

async function handleLogin(request, env) {
    const { username, password } = await request.json();
    const raw = await env.SITE_KV.get("admin_user");
    if (!raw) return json({ error: "Admin ainda não configurado." }, 400);
    const admin = JSON.parse(raw);
    if (username !== admin.username) return json({ error: "Usuário ou senha inválidos." }, 401);
    const valid = await verifyPassword(password, admin.hash, admin.salt);
    if (!valid) return json({ error: "Usuário ou senha inválidos." }, 401);

    const token = await createSessionToken(username, env.SESSION_SECRET);
    const cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
    return json({ ok: true }, 200, { "Set-Cookie": cookie });
}

async function handleLogout() {
    const cookie = `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
    return json({ ok: true }, 200, { "Set-Cookie": cookie });
}

async function handleGetAdminConfig(request, env) {
    const session = await requireAuth(request, env);
    if (!session) return json({ error: "Não autenticado." }, 401);
    const raw = await env.SITE_KV.get("config");
    return json(raw ? JSON.parse(raw) : DEFAULT_CONFIG);
}

async function handlePutAdminConfig(request, env) {
    const session = await requireAuth(request, env);
    if (!session) return json({ error: "Não autenticado." }, 401);
    const body = await request.json();
    const merged = { ...DEFAULT_CONFIG, ...body };
    await env.SITE_KV.put("config", JSON.stringify(merged));
    return json({ ok: true, config: merged });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin");

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders(origin) });
        }

        let response;
        if (url.pathname === "/api/config" && request.method === "GET") {
            response = await handleGetPublicConfig(env);
        } else if (url.pathname === "/api/setup" && request.method === "POST") {
            response = await handleSetup(request, env);
        } else if (url.pathname === "/api/login" && request.method === "POST") {
            response = await handleLogin(request, env);
        } else if (url.pathname === "/api/logout" && request.method === "POST") {
            response = await handleLogout();
        } else if (url.pathname === "/api/admin/config" && request.method === "GET") {
            response = await handleGetAdminConfig(request, env);
        } else if (url.pathname === "/api/admin/config" && request.method === "PUT") {
            response = await handlePutAdminConfig(request, env);
        } else {
            response = json({ error: "Rota não encontrada." }, 404);
        }

        const headers = new Headers(response.headers);
        Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));
        return new Response(response.body, { status: response.status, headers });
    }
};
