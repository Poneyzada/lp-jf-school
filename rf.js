/**
 * rf.js — Fatherflow Intelligence Layer
 * Versão: 3.0 (Universal / Multi-Cliente)
 */

const RF_CONFIG = {
    PROJECT_ID: "p1",
    NICHO: "Jiu-Jitsu",
    API_URL: "https://api.fatherflow.com.br/v1",
    DEBUG: false
};

function _rfGetCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function _rfGetUTMs() {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source:   p.get('utm_source')   || 'direto',
        utm_medium:   p.get('utm_medium')   || '',
        utm_campaign: p.get('utm_campaign') || '',
        utm_content:  p.get('utm_content')  || '',
        utm_term:     p.get('utm_term')      || '',
        gclid:        p.get('gclid')         || '',
        ad_id:        p.get('ad_id') || p.get('adid') || ''
    };
}

function _rfGetMetaCookies() {
    const _p = new URLSearchParams(window.location.search);
    const fbclid = _p.get('fbclid');
    return {
        fbp: _rfGetCookie('_fbp') || '',
        fbc: _rfGetCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '')
    };
}

function _rfGetDevice() {
    const ua = navigator.userAgent;
    if (/iPad|tablet/i.test(ua)) return 'tablet';
    if (/iPhone|Android|Mobile/i.test(ua)) return 'smartphone';
    return 'desktop';
}

function _rfGetPageInfo() {
    return {
        page_url:   window.location.href,
        page_title: document.title,
        referrer:   document.referrer || '',
        screen:     `${screen.width}x${screen.height}`,
        language:   navigator.language || ''
    };
}

async function trackLeadIndustrial(dados) {
    if (!dados.nome || !dados.whats) {
        console.warn('[RF] nome e whats sao obrigatorios.');
        return;
    }

    let whats = dados.whats.replace(/\D/g, '');
    if (whats.length <= 11 && !whats.startsWith('55')) whats = '55' + whats;

    const payload = {
        project_id:   RF_CONFIG.PROJECT_ID,
        nicho:        dados.nicho || RF_CONFIG.NICHO,
        nome:         dados.nome,
        whats:        whats,
        mensagem:     dados.mensagem   || '',
        email:        dados.email      || '',
        cidade:       dados.cidade     || '',
        objetivo:     dados.objetivo   || '',
        faixa:        dados.faixa      || '',
        turno:        dados.turno      || '',
        tipo:         dados.tipo       || '',
        ..._rfGetUTMs(),
        ..._rfGetMetaCookies(),
        device:       _rfGetDevice(),
        user_agent:   navigator.userAgent,
        ..._rfGetPageInfo(),
        ...Object.fromEntries(
            Object.entries(dados).filter(([k]) =>
                !['nome','whats','mensagem','email','cidade','objetivo','faixa','turno','tipo','nicho'].includes(k)
            )
        ),
        captured_at: new Date().toISOString()
    };

    if (RF_CONFIG.DEBUG) console.log('[RF] Payload:', payload);

    try {
        const res = await fetch(`${RF_CONFIG.API_URL}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
        const json = await res.json();
        if (RF_CONFIG.DEBUG) console.log('[RF] Resp:', json);
        return json;
    } catch (e) {
        if (RF_CONFIG.DEBUG) console.warn('[RF] Silent fail:', e);
        return null;
    }
}
