"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsmanApi = void 0;
class NewsmanApi {
    name = 'newsmanApi';
    displayName = 'NewsMAN API';
    documentationUrl = 'https://api.newsman.app/docs/en';
    properties = [
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
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.userId}}-{{$credentials.apiKey}}',
            },
        },
    };
    // Put the Bearer header on the test request itself. NewsMAN returns HTTP 400
    // (not 401) when Authorization is missing, which n8n surfaces as "Bad Request".
    test = {
        request: {
            baseURL: 'https://api.newsman.app',
            url: '/v2/list/all',
            method: 'GET',
            headers: {
                Authorization: '=Bearer {{$credentials.userId}}-{{$credentials.apiKey}}',
            },
        },
    };
}
exports.NewsmanApi = NewsmanApi;
