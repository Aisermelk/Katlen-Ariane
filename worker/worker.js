export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * =====================================================
         * HEADERS
         * =====================================================
         */

        const corsHeaders = {
            "Access-Control-Allow-Origin":
                "https://katlenarianeso.pages.dev",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type, Authorization",

            "Cache-Control":
                "no-store"
        };


        /*
         * =====================================================
         * CORS
         * =====================================================
         */

        if (request.method === "OPTIONS") {

            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }


        /*
         * =====================================================
         * API PÚBLICA
         * GET /api/config
         * =====================================================
         */

        if (
            url.pathname === "/api/config" &&
            request.method === "GET"
        ) {

            const defaultConfig = {

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

                professionalRegistrationLabel:
                    "Registro profissional",

                professionalRegistration:
                    "CBPC 2022-6172",

                formacao: "",

                especializacoes: "",

                experiencia: ""
            };


            try {

                const config =
                    await env.SITE_KV.get(
                        "site_config",
                        {
                            type: "json"
                        }
                    );


                const finalConfig = {

                    ...defaultConfig,

                    ...(config || {}),

                    trackingEnabled: {

                        ...defaultConfig.trackingEnabled,

                        ...(config?.trackingEnabled || {})
                    }
                };


                return new Response(
                    JSON.stringify(
                        finalConfig
                    ),
                    {
                        status: 200,

                        headers: {
                            ...corsHeaders,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            } catch (error) {

                console.error(
                    "Erro ao acessar SITE_KV:",
                    error
                );


                return new Response(
                    JSON.stringify({
                        error:
                            "Erro ao carregar configuração.",
                        message:
                            error.message
                    }),
                    {
                        status: 500,

                        headers: {
                            ...corsHeaders,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }
        }


        /*
         * =====================================================
         * STATUS DO WORKER
         * =====================================================
         */

        if (
            url.pathname === "/" &&
            request.method === "GET"
        ) {

            return new Response(
                JSON.stringify({

                    status: "online",

                    worker:
                        "katlen-admin",

                    api:
                        "/api/config"
                }),
                {
                    status: 200,

                    headers: {
                        ...corsHeaders,

                        "Content-Type":
                            "application/json"
                    }
                }
            );
        }


        /*
         * =====================================================
         * ROTA NÃO ENCONTRADA
         * =====================================================
         */

        return new Response(
            JSON.stringify({

                error:
                    "Rota não encontrada",

                path:
                    url.pathname
            }),
            {
                status: 404,

                headers: {
                    ...corsHeaders,

                    "Content-Type":
                        "application/json"
                }
            }
        );
    }
};
