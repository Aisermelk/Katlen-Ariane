export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * =====================================================
         * CORS
         * =====================================================
         */

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };


        /*
         * =====================================================
         * OPTIONS / CORS
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
         * =====================================================
         */

        if (
            url.pathname === "/api/config" &&
            request.method === "GET"
        ) {

            try {

                const config =
                    await env.SITE_KV.get(
                        "site_config",
                        {
                            type: "json"
                        }
                    );


                /*
                 * Se ainda não existir
                 * configuração no KV
                 */

                if (!config) {

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


                    return new Response(
                        JSON.stringify(
                            defaultConfig
                        ),
                        {
                            status: 200,

                            headers: {
                                ...corsHeaders,

                                "Content-Type":
                                    "application/json",

                                "Cache-Control":
                                    "no-store"
                            }
                        }
                    );
                }


                /*
                 * Retorna configuração
                 */

                return new Response(
                    JSON.stringify(config),
                    {
                        status: 200,

                        headers: {
                            ...corsHeaders,

                            "Content-Type":
                                "application/json",

                            "Cache-Control":
                                "no-store"
                        }
                    }
                );


            } catch (error) {

                console.error(
                    "Erro ao consultar SITE_KV:",
                    error
                );


                return new Response(
                    JSON.stringify({
                        error:
                            "Erro ao carregar configuração."
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
         * TESTE DO WORKER
         * =====================================================
         */

        if (
            url.pathname === "/" ||
            url.pathname === "/health"
        ) {

            return new Response(
                JSON.stringify({
                    status: "online",
                    worker: "katlen-admin",
                    api: "/api/config"
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
                error: "Rota não encontrada"
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
