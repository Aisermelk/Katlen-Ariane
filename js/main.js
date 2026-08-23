import SITE_CONFIG from '../config/config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Configura Registro Profissional
    const regLabel = document.getElementById('reg-label');
    const regValue = document.getElementById('reg-value');
    
    if (SITE_CONFIG.professionalRegistration) {
        regLabel.textContent = SITE_CONFIG.professionalRegistrationLabel;
        regValue.textContent = SITE_CONFIG.professionalRegistration;
    } else {
        document.getElementById('prof-reg-container').style.display = 'none';
    }

    // Configura Botão WhatsApp
    const whatsappLink = document.getElementById('whatsapp-link');
    if (SITE_CONFIG.whatsapp) {
        whatsappLink.href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Olá Katlen, vim pelo site e gostaria de saber mais sobre o atendimento.`;
    } else {
        whatsappLink.style.display = 'none';
    }

    // Formulário Formspree
    const form = document.getElementById('main-form');
    if (SITE_CONFIG.formspreeEndpoint) {
        form.action = `https://formspree.io/f/${SITE_CONFIG.formspreeEndpoint}`;
    }

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav-menu');
    
    mobileMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
});
