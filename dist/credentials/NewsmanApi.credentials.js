"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsmanApi = void 0;
class NewsmanApi {
    name = 'newsmanApi';
    displayName = 'NewsMAN API';
    documentationUrl = 'https://ssl.newsman.app/api/';
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
    test = {
        request: {
            baseURL: '=https://ssl.newsman.app/api/1.2/rest/{{$credentials?.userId}}/{{$credentials?.apiKey}}',
            url: '/list.all.json',
        },
    };
}
exports.NewsmanApi = NewsmanApi;
