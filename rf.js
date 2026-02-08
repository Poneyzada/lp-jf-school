// rf.js - Espião Fatherflow (Industrial Standard)
// Configurado para: JF School (Projeto p1)

const PROJECT_ID = "p1"; 
const API_URL = "http://164.90.138.233:8000/v1"; // IP Direto para evitar erro de DNS hoje

async function trackLeadIndustrial(dados) {
    console.log("🕵️ Fatherflow: Enviando dados para o bunker...");
    
    const urlParams = new URLSearchParams(window.location.search);
    
    const payload = {
        project_id: PROJECT_ID,
        nome: dados.nome,
        whats: dados.whats.replace(/\D/g, ''), // Limpa o número (só dígitos)
        mensagem: dados.mensagem,
        nicho: "Jiu-Jitsu",
        utm_source: urlParams.get('utm_source') || 'direto',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        ad_id: urlParams.get('ad_id') || '',
        device: /iPhone|Android/i.test(navigator.userAgent) ? "smartphone" : "monitor",
        ua: navigator.userAgent
    };

    try {
        // Envia o lead para o General (server.py)
        fetch(`${API_URL}/track`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
            mode: 'cors' // Importante para cross-origin
        });
    } catch (e) {
        console.error("Fatherflow Offline (Silent Fail):", e);
    }
}