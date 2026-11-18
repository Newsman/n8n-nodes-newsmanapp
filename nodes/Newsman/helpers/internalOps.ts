export const INTERNAL_OPS_ENV = 'NEWSMAN_INTERNAL_OPS';

export function isInternalOpsEnabled(): boolean {
  const raw = String(process.env[INTERNAL_OPS_ENV] || '')
    .trim()
    .toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

export type TeamChatCredentials = {
  chatWebhookUrl?: string;
  chatChannel?: string;
  chatUsername?: string;
};

export async function sendTeamChatAlert(
  httpRequest: (options: {
    method: 'POST';
    url: string;
    body: Record<string, any>;
    json: true;
  }) => Promise<any>,
  credentials: TeamChatCredentials,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
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
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
