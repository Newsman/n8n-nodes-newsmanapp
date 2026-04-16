"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Newsman = void 0;
class Newsman {
    description = {
        displayName: 'NewsMAN',
        name: 'newsman',
        group: ['transform'],
        version: 1,
        description: 'Interact with NewsMAN API',
        icon: 'file:newsman.icon.png',
        defaults: {
            name: 'NewsMAN',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'newsmanApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Get Lists',
                        value: 'getLists',
                    },
                    {
                        name: 'Get already existing subscriber by Email',
                        value: 'getSubscriberByEmail',
                    },
                    {
                        name: 'Get Segments (by List)',
                        value: 'getSegments',
                    },
                    {
                        name: 'Add Subscriber to Segment',
                        value: 'addSegmentSubscriber',
                    },
                    {
                        name: 'Add Subscriber to Segment (by Email)',
                        value: 'addSegmentSubscriberByEmail',
                    },
                    {
                        name: 'Save Subscriber to List',
                        value: 'saveSubscribe',
                    },
                    {
                        name: 'Subscriber - Add Tag',
                        value: 'subscriberAddTag',
                    },
                    {
                        name: 'Transactional - Message Send',
                        value: 'messageSend',
                    },
                    {
                        name: 'SMS - Get Lists',
                        value: 'smsLists',
                    },
                    {
                        name: 'SMS - Save Subscribe',
                        value: 'smsSaveSubscribe',
                    },
                    {
                        name: 'SMS - Send One',
                        value: 'smsSendOne',
                    },
                ],
                default: 'getLists',
            },
            {
                displayName: 'List ID',
                name: 'listId',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        operation: [
                            'getSegments',
                            'getSubscriberByEmail',
                            'saveSubscribe',
                            'addSegmentSubscriberByEmail',
                            'messageSend',
                            'smsSaveSubscribe',
                            'smsSendOne',
                        ],
                    },
                },
            },
            {
                displayName: 'Segment ID',
                name: 'segmentId',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        operation: ['addSegmentSubscriber', 'addSegmentSubscriberByEmail'],
                    },
                },
            },
            {
                displayName: 'Subscriber ID',
                name: 'subscriberId',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        operation: ['addSegmentSubscriber', 'subscriberAddTag'],
                    },
                },
            },
            {
                displayName: 'Tag',
                name: 'tag',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['subscriberAddTag'],
                    },
                },
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: [
                            'saveSubscribe',
                            'getSubscriberByEmail',
                            'addSegmentSubscriberByEmail',
                        ],
                    },
                },
            },
            {
                displayName: 'First Name (optional)',
                name: 'firstname',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['saveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Last Name (optional)',
                name: 'lastname',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['saveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Subscriber IP (required)',
                name: 'ip',
                type: 'string',
                default: '127.0.0.1',
                displayOptions: {
                    show: {
                        operation: ['saveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Props JSON (optional)',
                name: 'propsJson',
                type: 'string',
                default: '{"source":"N8N"}',
                description: 'Example: {"city":"London"}',
                displayOptions: {
                    show: {
                        operation: ['saveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Telephone',
                name: 'telephone',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['smsSaveSubscribe'],
                    },
                },
            },
            {
                displayName: 'First Name (optional)',
                name: 'smsFirstname',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['smsSaveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Last Name (optional)',
                name: 'smsLastname',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['smsSaveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Subscriber IP (required)',
                name: 'smsIp',
                type: 'string',
                default: '127.0.0.1',
                displayOptions: {
                    show: {
                        operation: ['smsSaveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Props JSON (optional)',
                name: 'smsPropsJson',
                type: 'string',
                default: '{"source":"N8N"}',
                description: 'Example: {"city":"London"}',
                displayOptions: {
                    show: {
                        operation: ['smsSaveSubscribe'],
                    },
                },
            },
            {
                displayName: 'Text',
                name: 'smsText',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['smsSendOne'],
                    },
                },
            },
            {
                displayName: 'To',
                name: 'smsTo',
                type: 'string',
                default: '',
                description: 'Telephone number of the recipient',
                displayOptions: {
                    show: {
                        operation: ['smsSendOne'],
                    },
                },
            },
            {
                displayName: 'Recipients Source',
                name: 'recipientsSource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'From Previous Items (Single API Call)',
                        value: 'fromInputItems',
                    },
                    {
                        name: 'From Expression (JSON Array)',
                        value: 'fromExpression',
                    },
                    {
                        name: 'Manual JSON',
                        value: 'manualJson',
                    },
                ],
                default: 'fromInputItems',
                description: 'How to build the recipients list. For "From Previous Items", connect this node directly after the node that outputs one item per recipient (e.g. Edit Fields). Do not use expressions on this dropdown—use "From Expression" if you need a custom array.',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'Recipient Email Field',
                name: 'recipientEmailField',
                type: 'string',
                default: 'email',
                description: 'Field name from previous node items',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                        recipientsSource: ['fromInputItems'],
                    },
                },
            },
            {
                displayName: 'Recipient Name Field (optional)',
                name: 'recipientNameField',
                type: 'string',
                default: 'name',
                description: 'Optional field name from previous node items',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                        recipientsSource: ['fromInputItems'],
                    },
                },
            },
            {
                displayName: 'Recipient Params Field (optional)',
                name: 'recipientParamsField',
                type: 'string',
                default: 'params',
                description: 'Optional object field from previous node items (for per-recipient template params)',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                        recipientsSource: ['fromInputItems'],
                    },
                },
            },
            {
                displayName: 'From Name',
                name: 'messageFromName',
                type: 'string',
                default: 'NewsMAN',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'From Email',
                name: 'messageFromEmail',
                type: 'string',
                default: 'sender@example.com',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'Subject',
                name: 'messageSubject',
                type: 'string',
                default: 'Message subject',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'HTML',
                name: 'messageHtml',
                type: 'string',
                default: '<b>Hello {{name}}</b>',
                typeOptions: {
                    rows: 6,
                },
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'Recipients (JSON Array)',
                name: 'recipientsExpression',
                type: 'json',
                default: '[]',
                description: 'Must evaluate to an array of objects with at least "email". Example referencing another node: {{ $json.items }} or mapping all items: {{ $(\'Edit Fields\').all().map(i => ({ email: i.json.email, name: i.json.name })) }}',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                        recipientsSource: ['fromExpression'],
                    },
                },
            },
            {
                displayName: 'Recipients JSON (required)',
                name: 'recipientsJson',
                type: 'json',
                default: '[ { "email":"recipient@example.com", "name":"Recipient 1", "params":{"name":"Adrian Test"} } ]',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                        recipientsSource: ['manualJson'],
                    },
                },
            },
            {
                displayName: 'Global Params JSON (optional)',
                name: 'paramsJson',
                type: 'json',
                default: '{"source":"n8n"}',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
            {
                displayName: 'Account ID (optional)',
                name: 'accountId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['messageSend'],
                    },
                },
            },
        ],
    };
    async execute() {
        const credentials = await this.getCredentials('newsmanApi');
        const items = this.getInputData();
        const returnData = [];
        const unwrap = (axiosResponse) => axiosResponse?.data ?? axiosResponse;
        const baseUrl = `https://ssl.newsman.app/api/1.2/rest/${credentials.userId}/${credentials.apiKey}/`;
        const newsmanRequest = async (options) => {
            const url = `${baseUrl}${options.endpoint}.${options.method}.json`;
            return await this.helpers.httpRequest({
                method: options.httpMethod,
                url,
                qs: options.qs,
                body: options.body,
                json: true,
            });
        };
        const parseJson = (value, fieldName) => {
            if (value === null || value === undefined)
                return null;
            if (typeof value === 'object')
                return value;
            const trimmed = String(value)?.trim();
            if (!trimmed)
                return null;
            try {
                return JSON.parse(trimmed);
            }
            catch (error) {
                throw new Error(`Invalid JSON for '${fieldName}'. ${error.message}`);
            }
        };
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            let response;
            if (operation === 'getLists') {
                response = await newsmanRequest({
                    endpoint: 'list',
                    method: 'all',
                    httpMethod: 'GET',
                });
            }
            else if (operation === 'getSubscriberByEmail') {
                const listId = this.getNodeParameter('listId', i);
                const email = this.getNodeParameter('email', i);
                response = await newsmanRequest({
                    endpoint: 'subscriber',
                    method: 'getByEmail',
                    httpMethod: 'GET',
                    qs: { list_id: listId, email },
                });
            }
            else if (operation === 'getSegments') {
                const listId = this.getNodeParameter('listId', i);
                response = await newsmanRequest({
                    endpoint: 'segment',
                    method: 'all',
                    httpMethod: 'GET',
                    qs: { list_id: listId },
                });
            }
            else if (operation === 'addSegmentSubscriber') {
                const segmentId = this.getNodeParameter('segmentId', i);
                const subscriberId = this.getNodeParameter('subscriberId', i);
                response = await newsmanRequest({
                    endpoint: 'segment',
                    method: 'addSubscriber',
                    httpMethod: 'POST',
                    body: { segment_id: segmentId, subscriber_id: subscriberId },
                });
            }
            else if (operation === 'addSegmentSubscriberByEmail') {
                const listId = this.getNodeParameter('listId', i);
                const segmentId = this.getNodeParameter('segmentId', i);
                const email = this.getNodeParameter('email', i);
                const subscriberResponse = await newsmanRequest({
                    endpoint: 'subscriber',
                    method: 'getByEmail',
                    httpMethod: 'GET',
                    qs: { list_id: listId, email },
                });
                const subscriber = Array.isArray(subscriberResponse)
                    ? subscriberResponse[0]
                    : subscriberResponse;
                const subscriberId = subscriber?.subscriber_id ??
                    subscriber?.subscriberId ??
                    subscriber?.id;
                if (!subscriberId) {
                    throw new Error(`Could not resolve subscriber_id for email '${email}' in list '${listId}'`);
                }
                const addResponse = await newsmanRequest({
                    endpoint: 'segment',
                    method: 'addSubscriber',
                    httpMethod: 'POST',
                    body: { segment_id: segmentId, subscriber_id: subscriberId },
                });
                response = {
                    subscriber,
                    addResult: addResponse,
                };
            }
            else if (operation === 'saveSubscribe') {
                const listId = this.getNodeParameter('listId', i);
                const email = this.getNodeParameter('email', i);
                const firstnameRaw = this.getNodeParameter('firstname', i);
                const lastnameRaw = this.getNodeParameter('lastname', i);
                const ip = this.getNodeParameter('ip', i);
                const propsJson = this.getNodeParameter('propsJson', i);
                const firstname = firstnameRaw?.trim() ? firstnameRaw : null;
                const lastname = lastnameRaw?.trim() ? lastnameRaw : null;
                const props = parseJson(propsJson, 'propsJson');
                response = await newsmanRequest({
                    endpoint: 'subscriber',
                    method: 'saveSubscribe',
                    httpMethod: 'POST',
                    body: {
                        list_id: listId,
                        email,
                        firstname,
                        lastname,
                        ip,
                        props: props ?? null,
                    },
                });
                const saveSubscribeData = unwrap(response);
                if (typeof saveSubscribeData === 'number' ||
                    typeof saveSubscribeData === 'string') {
                    response = { subscriber_id: saveSubscribeData };
                }
                else {
                    response = saveSubscribeData;
                }
            }
            else if (operation === 'messageSend') {
                const recipientsSourceRaw = this.getNodeParameter('recipientsSource', i);
                const allowedSources = [
                    'fromInputItems',
                    'manualJson',
                    'fromExpression',
                ];
                if (!allowedSources.includes(recipientsSourceRaw)) {
                    throw new Error('Recipients Source was not saved as a valid mode (often caused by using an expression on the dropdown). Clear the field, pick "From Previous Items" and connect the upstream node, or pick "From Expression (JSON Array)" and set the array there.');
                }
                const recipientsSource = recipientsSourceRaw;
                // Single API call: only first input item runs the send
                if ((recipientsSource === 'fromInputItems' ||
                    recipientsSource === 'fromExpression') &&
                    i > 0) {
                    continue;
                }
                const listId = this.getNodeParameter('listId', i);
                const messageFromName = this.getNodeParameter('messageFromName', i);
                const messageFromEmail = this.getNodeParameter('messageFromEmail', i);
                const messageSubject = this.getNodeParameter('messageSubject', i);
                const messageHtml = this.getNodeParameter('messageHtml', i);
                const paramsJson = this.getNodeParameter('paramsJson', i);
                const accountId = this.getNodeParameter('accountId', i);
                const message = {
                    from_name: messageFromName,
                    from_email: messageFromEmail,
                    subject: messageSubject,
                    html: messageHtml,
                };
                const params = parseJson(paramsJson, 'paramsJson');
                let recipients = null;
                if (recipientsSource === 'fromInputItems') {
                    const emailField = this.getNodeParameter('recipientEmailField', i);
                    const nameField = this.getNodeParameter('recipientNameField', i);
                    const paramsField = this.getNodeParameter('recipientParamsField', i);
                    recipients = items.map((item, itemIndex) => {
                        const row = item.json ?? {};
                        const email = row[emailField];
                        if (!email) {
                            throw new Error(`Missing recipient email at input item ${itemIndex} using field '${emailField}'`);
                        }
                        const recipient = { email };
                        if (nameField && row[nameField] !== undefined) {
                            recipient.name = row[nameField];
                        }
                        if (paramsField && row[paramsField] !== undefined) {
                            recipient.params = row[paramsField];
                        }
                        return recipient;
                    });
                }
                else if (recipientsSource === 'fromExpression') {
                    const recipientsExpression = this.getNodeParameter('recipientsExpression', i);
                    recipients = parseJson(recipientsExpression, 'recipientsExpression');
                }
                else {
                    const recipientsJson = this.getNodeParameter('recipientsJson', i);
                    recipients = parseJson(recipientsJson, 'recipientsJson');
                }
                if (!message.from_name || !message.from_email || !message.subject || !message.html) {
                    throw new Error('messageSend requires From Name, From Email, Subject, and HTML');
                }
                if (recipients === null) {
                    throw new Error('Recipients must be a valid JSON array');
                }
                if (!Array.isArray(recipients)) {
                    throw new Error('Recipients must be an array of objects with at least "email"');
                }
                const body = {
                    list_id: listId,
                    message,
                    recipients,
                    params: params ?? null,
                };
                if (accountId?.trim())
                    body.account_id = accountId.trim();
                response = await newsmanRequest({
                    endpoint: 'transactional',
                    method: 'messageSend',
                    httpMethod: 'POST',
                    body,
                });
            }
            else if (operation === 'subscriberAddTag') {
                const subscriberId = this.getNodeParameter('subscriberId', i);
                const tag = this.getNodeParameter('tag', i);
                const addTagResponse = await newsmanRequest({
                    endpoint: 'subscriber',
                    method: 'addTag',
                    httpMethod: 'POST',
                    body: { subscriber_id: subscriberId, tag },
                });
                response = { success: Boolean(unwrap(addTagResponse)) };
            }
            else if (operation === 'smsLists') {
                response = await newsmanRequest({
                    endpoint: 'sms',
                    method: 'lists',
                    httpMethod: 'GET',
                });
            }
            else if (operation === 'smsSaveSubscribe') {
                const listId = this.getNodeParameter('listId', i);
                const telephone = this.getNodeParameter('telephone', i);
                const firstnameRaw = this.getNodeParameter('smsFirstname', i);
                const lastnameRaw = this.getNodeParameter('smsLastname', i);
                const ip = this.getNodeParameter('smsIp', i);
                const propsJson = this.getNodeParameter('smsPropsJson', i);
                const firstname = firstnameRaw?.trim() ? firstnameRaw : null;
                const lastname = lastnameRaw?.trim() ? lastnameRaw : null;
                const props = parseJson(propsJson, 'smsPropsJson');
                const smsSaveSubscribeResponse = await newsmanRequest({
                    endpoint: 'sms',
                    method: 'saveSubscribe',
                    httpMethod: 'POST',
                    body: {
                        list_id: listId,
                        telephone,
                        firstname,
                        lastname,
                        ip,
                        props: props ?? null,
                    },
                });
                const smsSaveSubscribeData = unwrap(smsSaveSubscribeResponse);
                if (typeof smsSaveSubscribeData === 'number' ||
                    typeof smsSaveSubscribeData === 'string') {
                    response = { subscriber_id: smsSaveSubscribeData };
                }
                else {
                    response = smsSaveSubscribeData;
                }
            }
            else if (operation === 'smsSendOne') {
                const listId = this.getNodeParameter('listId', i);
                const text = this.getNodeParameter('smsText', i);
                const to = this.getNodeParameter('smsTo', i);
                response = await newsmanRequest({
                    endpoint: 'sms',
                    method: 'sendone',
                    httpMethod: 'POST',
                    body: { list_id: listId, text, to },
                });
            }
            else {
                throw new Error(`Unsupported operation: ${operation}`);
            }
            returnData.push(unwrap(response));
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Newsman = Newsman;
