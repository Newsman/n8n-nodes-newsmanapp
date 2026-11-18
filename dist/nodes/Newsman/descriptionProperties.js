"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNewsmanProperties = buildNewsmanProperties;
const cdn_1 = require("./helpers/cdn");
const internalOps_1 = require("./helpers/internalOps");
const resizeModeOptions = [
    { name: 'None', value: 'none' },
    { name: 'Width (Preserve Ratio)', value: 'widthPreserve' },
    { name: 'Height (Preserve Ratio)', value: 'heightPreserve' },
    { name: 'Exact Width + Height', value: 'exact' },
    { name: 'Exact + Trim (pr=t)', value: 'exactTrim' },
];
function buildNewsmanProperties() {
    const internal = (0, internalOps_1.isInternalOpsEnabled)();
    const operationOptions = [
        { name: 'Get Lists', value: 'getLists' },
        { name: 'Get Subscriber', value: 'getSubscriberByEmail' },
        { name: 'Get Segments', value: 'getSegments' },
        { name: 'Add Subscriber to Segment', value: 'addSegmentSubscriber' },
        {
            name: 'Add Subscriber to Segment by Email',
            value: 'addSegmentSubscriberByEmail',
        },
        { name: 'Create or Update Subscriber', value: 'saveSubscribe' },
        { name: 'Add Tag to Subscriber', value: 'subscriberAddTag' },
        { name: 'Send Transactional Message', value: 'messageSend' },
        { name: 'Get SMS Lists', value: 'smsLists' },
        { name: 'Create or Update SMS Subscriber', value: 'smsSaveSubscribe' },
        { name: 'Send SMS', value: 'smsSendOne' },
        { name: 'Get Product Groups', value: 'getProductGroups' },
        { name: 'Get Product Group', value: 'getProductGroup' },
        { name: 'Get Product Group Products', value: 'getProductGroupProducts' },
        { name: 'Get Draft Info', value: 'getDraftInfo' },
        { name: 'Parse Draft Handlebars', value: 'parseDraftHandlebars' },
        { name: 'Create Newsletter', value: 'createNewsletter' },
        { name: 'Schedule Newsletter', value: 'scheduleNewsletter' },
        { name: 'Confirm Newsletter', value: 'confirmNewsletter' },
        { name: 'Send Newsletter Confirm', value: 'sendNewsletterConfirm' },
        { name: 'Send Newsletter Test', value: 'sendNewsletterTest' },
        { name: 'Set Newsletter Segments', value: 'setNewsletterSegments' },
        {
            name: 'Schedule Automated Newsletter',
            value: 'scheduleAutomatedNewsletter',
        },
    ];
    const properties = [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            options: operationOptions,
            default: 'getLists',
        },
        // --- shared IDs ---
        {
            displayName: 'List ID',
            name: 'listId',
            type: 'number',
            default: 0,
            description: 'NewsMAN list ID. You can map this from a previous node, for example from Get Lists.',
            placeholder: 'e.g. 12345',
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
                        'getProductGroups',
                        'getProductGroup',
                        'getProductGroupProducts',
                        'parseDraftHandlebars',
                        'createNewsletter',
                        'sendNewsletterTest',
                        'scheduleAutomatedNewsletter',
                    ],
                },
            },
        },
        {
            displayName: 'Segment ID',
            name: 'segmentId',
            type: 'number',
            default: 0,
            placeholder: 'e.g. 6789',
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
            placeholder: 'e.g. 456789',
            displayOptions: {
                show: {
                    operation: ['addSegmentSubscriber', 'subscriberAddTag'],
                },
            },
        },
        {
            displayName: 'Product Group ID',
            name: 'productGroupId',
            type: 'string',
            default: '',
            placeholder: 'e.g. paste product group / sub-feed id',
            displayOptions: {
                show: {
                    operation: ['getProductGroup', 'getProductGroupProducts'],
                },
            },
        },
        {
            displayName: 'Draft ID',
            name: 'draftId',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    operation: [
                        'getDraftInfo',
                        'parseDraftHandlebars',
                        'scheduleAutomatedNewsletter',
                    ],
                },
            },
        },
        {
            displayName: 'Newsletter ID',
            name: 'newsletterId',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    operation: [
                        'scheduleNewsletter',
                        'confirmNewsletter',
                        'sendNewsletterConfirm',
                        'setNewsletterSegments',
                    ],
                },
            },
        },
        // --- feeds options ---
        {
            displayName: 'Options JSON',
            name: 'feedOptionsJson',
            type: 'json',
            default: '{}',
            description: 'Optional feed options, e.g. {"fetch_description":0}. Empty object is fine.',
            displayOptions: {
                show: {
                    operation: ['getProductGroupProducts'],
                },
            },
        },
        // --- draft parse ---
        {
            displayName: 'Compile Params JSON',
            name: 'compileParamsJson',
            type: 'json',
            default: '{}',
            description: 'Handlebars compile parameters object',
            displayOptions: {
                show: {
                    operation: ['parseDraftHandlebars'],
                },
            },
        },
        // --- newsletter create / schedule discrete ---
        {
            displayName: 'HTML',
            name: 'newsletterHtml',
            type: 'string',
            default: '',
            typeOptions: { rows: 6 },
            displayOptions: {
                show: {
                    operation: ['createNewsletter'],
                },
            },
        },
        {
            displayName: 'Text',
            name: 'newsletterText',
            type: 'string',
            default: '',
            description: 'Leave empty to send false (no text part)',
            displayOptions: {
                show: {
                    operation: ['createNewsletter'],
                },
            },
        },
        {
            displayName: 'Newsletter Props JSON',
            name: 'newsletterPropsJson',
            type: 'json',
            default: '{"encoding":"utf-8","subject":"Newsletter subject"}',
            description: 'Must include subject. encoding defaults to utf-8.',
            displayOptions: {
                show: {
                    operation: ['createNewsletter'],
                },
            },
        },
        {
            displayName: 'Schedule Time (UTC)',
            name: 'scheduleTime',
            type: 'string',
            default: '',
            placeholder: 'YYYY-MM-DD HH:MM:SS',
            description: 'UTC time. Leave empty on automated flow to use delay minutes.',
            displayOptions: {
                show: {
                    operation: ['scheduleNewsletter'],
                },
            },
        },
        {
            displayName: 'Schedule Time (UTC)',
            name: 'scheduleTimeAutomated',
            type: 'string',
            default: '',
            placeholder: 'YYYY-MM-DD HH:MM:SS',
            description: 'UTC time. Leave empty to use Schedule Delay (Minutes).',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    automationMode: ['schedule'],
                },
            },
        },
        {
            displayName: 'Segment IDs JSON',
            name: 'segmentIdsJson',
            type: 'json',
            default: '[]',
            description: 'Array of segment ids, e.g. [123, 456]',
            displayOptions: {
                show: {
                    operation: ['setNewsletterSegments'],
                },
            },
        },
        {
            displayName: 'Segment IDs JSON',
            name: 'segmentIdsJsonAutomated',
            type: 'json',
            default: '[]',
            description: 'Optional array of segment ids, e.g. [123, 456]',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    automationMode: ['schedule'],
                },
            },
        },
        // --- subscriber / sms / transactional (existing) ---
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            default: '',
            placeholder: 'e.g. vip',
            displayOptions: {
                show: { operation: ['subscriberAddTag'] },
            },
        },
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            placeholder: 'e.g. person@example.com',
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
            displayName: 'First Name',
            name: 'firstname',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['saveSubscribe'] } },
        },
        {
            displayName: 'Last Name',
            name: 'lastname',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['saveSubscribe'] } },
        },
        {
            displayName: 'Subscriber IP',
            name: 'ip',
            type: 'string',
            required: true,
            default: '127.0.0.1',
            displayOptions: { show: { operation: ['saveSubscribe'] } },
        },
        {
            displayName: 'Props JSON',
            name: 'propsJson',
            type: 'string',
            default: '{"source":"N8N"}',
            displayOptions: { show: { operation: ['saveSubscribe'] } },
        },
        {
            displayName: 'Telephone',
            name: 'telephone',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['smsSaveSubscribe'] } },
        },
        {
            displayName: 'First Name',
            name: 'smsFirstname',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['smsSaveSubscribe'] } },
        },
        {
            displayName: 'Last Name',
            name: 'smsLastname',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['smsSaveSubscribe'] } },
        },
        {
            displayName: 'Subscriber IP',
            name: 'smsIp',
            type: 'string',
            required: true,
            default: '127.0.0.1',
            displayOptions: { show: { operation: ['smsSaveSubscribe'] } },
        },
        {
            displayName: 'Props JSON',
            name: 'smsPropsJson',
            type: 'string',
            default: '{"source":"N8N"}',
            displayOptions: { show: { operation: ['smsSaveSubscribe'] } },
        },
        {
            displayName: 'Text',
            name: 'smsText',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['smsSendOne'] } },
        },
        {
            displayName: 'To',
            name: 'smsTo',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['smsSendOne'] } },
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
                { name: 'From Expression (JSON Array)', value: 'fromExpression' },
                { name: 'Manual JSON', value: 'manualJson' },
            ],
            default: 'fromInputItems',
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'Recipient Email Field',
            name: 'recipientEmailField',
            type: 'string',
            default: 'email',
            displayOptions: {
                show: {
                    operation: ['messageSend'],
                    recipientsSource: ['fromInputItems'],
                },
            },
        },
        {
            displayName: 'Recipient Name Field',
            name: 'recipientNameField',
            type: 'string',
            default: 'name',
            displayOptions: {
                show: {
                    operation: ['messageSend'],
                    recipientsSource: ['fromInputItems'],
                },
            },
        },
        {
            displayName: 'Recipient Params Field',
            name: 'recipientParamsField',
            type: 'string',
            default: 'params',
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
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'From Email',
            name: 'messageFromEmail',
            type: 'string',
            default: 'sender@example.com',
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'Subject',
            name: 'messageSubject',
            type: 'string',
            default: 'Message subject',
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'HTML',
            name: 'messageHtml',
            type: 'string',
            default: '<b>Hello {{name}}</b>',
            typeOptions: { rows: 6 },
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'Recipients (JSON Array)',
            name: 'recipientsExpression',
            type: 'json',
            default: '[]',
            displayOptions: {
                show: {
                    operation: ['messageSend'],
                    recipientsSource: ['fromExpression'],
                },
            },
        },
        {
            displayName: 'Recipients JSON',
            name: 'recipientsJson',
            type: 'json',
            required: true,
            default: '[ { "email":"recipient@example.com", "name":"Recipient 1", "params":{"name":"Adrian Test"} } ]',
            displayOptions: {
                show: {
                    operation: ['messageSend'],
                    recipientsSource: ['manualJson'],
                },
            },
        },
        {
            displayName: 'Global Params JSON',
            name: 'paramsJson',
            type: 'json',
            default: '{"source":"n8n"}',
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'string',
            default: '',
            displayOptions: { show: { operation: ['messageSend'] } },
        },
        // --- composite automated newsletter ---
        {
            displayName: 'Mode',
            name: 'automationMode',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Preview HTML Only',
                    value: 'preview',
                    description: 'Build products + parse draft and return HTML. Does not create, schedule, or confirm a newsletter.',
                },
                {
                    name: 'Preview & Send Test',
                    value: 'sendTest',
                    description: 'Same as preview, then send the HTML as a test via newsletter.sendTest to the given address(es).',
                },
                {
                    name: 'Schedule Newsletter',
                    value: 'schedule',
                    description: 'Full flow: parse draft, create newsletter, schedule, optional confirm.',
                },
            ],
            default: 'preview',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Test Emails',
            name: 'testEmails',
            type: 'string',
            default: '',
            placeholder: 'e.g. you@newsman.com, mate@newsman.com',
            description: 'Required for Preview & Send Test (and Send Newsletter Test). Comma-separated addresses. Uses this node’s client NewsMAN credentials. Ignored in Preview HTML Only / Schedule modes.',
            // show-only (no hide): n8n show+hide combos often fail to reveal fields on saved nodes
            displayOptions: {
                show: {
                    operation: ['sendNewsletterTest', 'scheduleAutomatedNewsletter'],
                },
            },
        },
        {
            displayName: 'Test Subject',
            name: 'testSubject',
            type: 'string',
            default: 'Test newsletter',
            displayOptions: {
                show: { operation: ['sendNewsletterTest'] },
            },
        },
        {
            displayName: 'HTML',
            name: 'testHtml',
            type: 'string',
            default: '',
            typeOptions: { rows: 6 },
            displayOptions: {
                show: { operation: ['sendNewsletterTest'] },
            },
        },
        {
            displayName: 'Text',
            name: 'testText',
            type: 'string',
            default: '',
            description: 'Plain-text alternative (can be empty string).',
            displayOptions: {
                show: { operation: ['sendNewsletterTest'] },
            },
        },
        {
            displayName: 'Product Groups Map JSON',
            name: 'productGroupsMapJson',
            type: 'json',
            default: '{\n  "noutati": "GROUP_ID_1",\n  "recompense": "GROUP_ID_2"\n}',
            description: 'Handlebars key → NewsMAN product_group_id. Paste sub-feed / category group IDs from NewsMAN.',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Subjects JSON',
            name: 'subjectsJson',
            type: 'json',
            default: '["Newsletter subject A", "Newsletter subject B"]',
            description: 'Array of subject strings; one is picked at random.',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Shuffle Products',
            name: 'shuffleProducts',
            type: 'boolean',
            default: false,
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Max Products Per Group',
            name: 'maxProductsPerGroup',
            type: 'number',
            default: 6,
            description: '0 = no limit (keep all products from the group).',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Title Word Limit',
            name: 'titleWordLimit',
            type: 'number',
            default: 8,
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Website',
            name: 'website',
            type: 'string',
            default: '',
            placeholder: 'e.g. petselect.ro',
            description: 'Site host used when rewriting product/banner images via CDN.',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'CDN Base URL',
            name: 'cdnBaseUrl',
            type: 'string',
            default: cdn_1.DEFAULT_CDN_BASE_URL,
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Rewrite Images Via CDN',
            name: 'rewriteImagesViaCdn',
            type: 'boolean',
            default: true,
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Product Image Resize Mode',
            name: 'productImageResizeMode',
            type: 'options',
            options: resizeModeOptions,
            default: 'widthPreserve',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                },
            },
        },
        {
            displayName: 'Product Image Width',
            name: 'productImageWidth',
            type: 'number',
            default: 180,
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                    productImageResizeMode: ['widthPreserve', 'exact', 'exactTrim'],
                },
            },
        },
        {
            displayName: 'Product Image Height',
            name: 'productImageHeight',
            type: 'number',
            default: 180,
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                    productImageResizeMode: ['heightPreserve', 'exact', 'exactTrim'],
                },
            },
        },
        {
            displayName: 'Schedule Delay (Minutes)',
            name: 'scheduleDelayMinutes',
            type: 'number',
            default: 3,
            description: 'Used when Schedule Time (UTC) is empty.',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    automationMode: ['schedule'],
                },
            },
        },
        {
            displayName: 'Post-Schedule Action',
            name: 'postScheduleAction',
            type: 'options',
            noDataExpression: true,
            options: [
                { name: 'None', value: 'none' },
                { name: 'Send Confirm Email', value: 'sendConfirm' },
                { name: 'Confirm via API', value: 'confirm' },
            ],
            default: 'none',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    automationMode: ['schedule'],
                },
            },
        },
        {
            displayName: 'Banner Source',
            name: 'bannerSource',
            type: 'options',
            options: [
                { name: 'None', value: 'none' },
                { name: 'Manual', value: 'manual' },
                { name: 'Brandfetch (stub)', value: 'brandfetch' },
            ],
            default: 'none',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Banner Src',
            name: 'bannerSrc',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    bannerSource: ['manual'],
                },
            },
        },
        {
            displayName: 'Banner URL',
            name: 'bannerUrl',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    bannerSource: ['manual'],
                },
            },
        },
        {
            displayName: 'Brandfetch Site URL',
            name: 'brandfetchSiteUrl',
            type: 'string',
            default: '',
            placeholder: 'https://www.example.com',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    bannerSource: ['brandfetch'],
                },
            },
        },
        {
            displayName: 'Brandfetch Headers JSON',
            name: 'brandfetchHeadersJson',
            type: 'json',
            default: '{}',
            description: 'Placeholder for auth/custom headers (wired later).',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    bannerSource: ['brandfetch'],
                },
            },
        },
        {
            displayName: 'Banner Image Resize Mode',
            name: 'bannerImageResizeMode',
            type: 'options',
            options: resizeModeOptions,
            default: 'none',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                    bannerSource: ['manual', 'brandfetch'],
                },
            },
        },
        {
            displayName: 'Banner Image Width',
            name: 'bannerImageWidth',
            type: 'number',
            default: 600,
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                    bannerSource: ['manual', 'brandfetch'],
                    bannerImageResizeMode: ['widthPreserve', 'exact', 'exactTrim'],
                },
            },
        },
        {
            displayName: 'Banner Image Height',
            name: 'bannerImageHeight',
            type: 'number',
            default: 200,
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    rewriteImagesViaCdn: [true],
                    bannerSource: ['manual', 'brandfetch'],
                    bannerImageResizeMode: ['heightPreserve', 'exact', 'exactTrim'],
                },
            },
        },
        {
            displayName: 'Extra Compile Params JSON',
            name: 'extraCompileParamsJson',
            type: 'json',
            default: '{}',
            description: 'Merged into Handlebars params (does not replace product groups).',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        },
        {
            displayName: 'Include HTML in Output',
            name: 'includeHtml',
            type: 'boolean',
            default: false,
            description: 'When scheduling, also return the generated HTML. Preview mode always returns HTML.',
            displayOptions: {
                show: {
                    operation: ['scheduleAutomatedNewsletter'],
                    automationMode: ['schedule'],
                },
            },
        },
    ];
    if (internal) {
        properties.push({
            displayName: 'Team Alerts On Failure',
            name: 'teamAlertsOnFailure',
            type: 'boolean',
            default: true,
            description: 'Send Rocket.Chat alert via NewsMAN Team Alerts credentials when the automated newsletter fails.',
            displayOptions: {
                show: { operation: ['scheduleAutomatedNewsletter'] },
            },
        });
    }
    return properties;
}
