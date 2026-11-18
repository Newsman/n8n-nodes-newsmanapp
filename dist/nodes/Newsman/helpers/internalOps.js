"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_OPS_ENV = void 0;
exports.isInternalOpsEnabled = isInternalOpsEnabled;
exports.sendTeamChatAlert = sendTeamChatAlert;
exports.INTERNAL_OPS_ENV = 'NEWSMAN_INTERNAL_OPS';
function isInternalOpsEnabled() {
    const raw = String(process.env[exports.INTERNAL_OPS_ENV] || '')
        .trim()
        .toLowerCase();
    return raw === '1' || raw === 'true' || raw === 'yes';
}
async function sendTeamChatAlert(httpRequest, credentials, text) {
    const webhookUrl = String(credentials.chatWebhookUrl || '').trim();
    if (!webhookUrl) {
        return { ok: false, error: 'Missing chatWebhookUrl' };
    }
    const channel = String(credentials.chatChannel || '').trim() || '#support';
    const username = String(credentials.chatUsername || '').trim() || 'ProductApi';
    try {
        await httpRequest({
            method: 'POST',
            url: webhookUrl,
            body: {
                username,
                text,
                channel,
            },
            json: true,
        });
        return { ok: true };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
