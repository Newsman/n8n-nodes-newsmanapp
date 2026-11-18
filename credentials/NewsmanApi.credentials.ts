import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class NewsmanApi implements ICredentialType {
  name = 'newsmanApi';
  displayName = 'NewsMAN API';
  documentationUrl = 'https://api.newsman.app/docs/en';

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

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization:
          '=Bearer {{$credentials.userId}}-{{$credentials.apiKey}}',
      },
    },
  };

  // Put the Bearer header on the test request itself. NewsMAN returns HTTP 400
  // (not 401) when Authorization is missing, which n8n surfaces as "Bad Request".
  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.newsman.app',
      url: '/v2/list/all',
      method: 'GET',
      headers: {
        Authorization:
          '=Bearer {{$credentials.userId}}-{{$credentials.apiKey}}',
      },
    },
  };
}
