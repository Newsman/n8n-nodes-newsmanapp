"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsmanApi = void 0;
class NewsmanApi {
    name = 'newsmanApi';
    displayName = 'NewsMAN API';
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
}
exports.NewsmanApi = NewsmanApi;
