export default {
    async fetch(request, env, ctx) {

        const url = new URL(request.url);

        /*
         * =====================================================
         * API PÚBLICA
         * =====================================================
         */

        if (url.pathname === "/api/config") {

            const config =
                await env.SITE_KV.get(
                    "site_config",
                    {
                        type: "json"
                    }
                );

            if (!config) {

                return new Response(
                    JSON.stringify({
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
                    }),
                    {
                        status: 200,

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Cache-Control":
                                "no-store"
                        }
                    }
                );
            }

            return new Response(
                JSON.stringify(config),
                {
                    status: 200,

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Cache-Control":
                            "no-store"
                    }
                }
            );
        }


        /*
         * =====================================================
         * SITE
         * =====================================================
         */

        return env.ASSETS.fetch(request);
    }
};
