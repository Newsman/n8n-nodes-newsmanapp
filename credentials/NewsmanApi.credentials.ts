import {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class NewsmanApi implements ICredentialType {
  name = 'newsmanApi';
  displayName = 'NewsMAN API';
  documentationUrl = 'https://ssl.newsman.app/api/';

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

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '=https://ssl.newsman.app/api/1.2/rest/{{$credentials?.userId}}/{{$credentials?.apiKey}}',
      url: '/list.all.json',
    },
  };
}
