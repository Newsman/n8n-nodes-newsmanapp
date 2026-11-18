import { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * NewsMAN-team-only Rocket.Chat webhook credentials.
 * UI usage is gated by NEWSMAN_INTERNAL_OPS on the NewsMAN node.
 */
export class NewsmanTeamAlerts implements ICredentialType {
  name = 'newsmanTeamAlerts';
  displayName = 'NewsMAN Team Alerts';
  documentationUrl = 'https://api.newsman.app/docs/en';

  properties: INodeProperties[] = [
    {
      displayName: 'Chat Webhook URL',
      name: 'chatWebhookUrl',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Rocket.Chat incoming webhook URL for auto-newsletter ops alerts',
    },
    {
      displayName: 'Chat Channel',
      name: 'chatChannel',
      type: 'string',
      default: '#support',
    },
    {
      displayName: 'Chat Username',
      name: 'chatUsername',
      type: 'string',
      default: 'ProductApi',
    },
  ];
}
