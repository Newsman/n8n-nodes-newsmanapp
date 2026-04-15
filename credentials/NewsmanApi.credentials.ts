import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NewsmanApi implements ICredentialType {
  name = 'newsmanApi';
  displayName = 'NewsMAN API';

  properties: INodeProperties[] = [
    {
      displayName: 'User ID',
      name: 'userId',
      type: 'string',
      default: '',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];
}
