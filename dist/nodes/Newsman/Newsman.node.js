"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Newsman = void 0;
const descriptionProperties_1 = require("./descriptionProperties");
const cdn_1 = require("./helpers/cdn");
const internalOps_1 = require("./helpers/internalOps");
const json_1 = require("./helpers/json");
const products_1 = require("./helpers/products");
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
            ...((0, internalOps_1.isInternalOpsEnabled)()
                ? [
                    {
                        name: 'newsmanTeamAlerts',
                        required: false,
                    },
                ]
                : []),
        ],
        properties: (0, descriptionProperties_1.buildNewsmanProperties)(),
    };
    async execute() {
        const credentials = await this.getCredentials('newsmanApi');
        const items = this.getInputData();
        const returnData = [];
        const unwrap = (axiosResponse) => axiosResponse?.data ?? axiosResponse;
        const baseUrl = 'https://api.newsman.app/v2/';
        const authToken = `${credentials.userId}-${credentials.apiKey}`;
        const newsmanRequest = async (options) => {
            const url = `${baseUrl}${options.endpoint}/${options.method}`;
            return await this.helpers.httpRequest({
                method: options.httpMethod,
                url,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                qs: options.qs,
                body: options.body,
                json: true,
            });
        };
        const maybeTeamAlert = async (itemIndex, message) => {
            if (!(0, internalOps_1.isInternalOpsEnabled)())
                return;
            let alertsOn = false;
            try {
                alertsOn = this.getNodeParameter('teamAlertsOnFailure', itemIndex, true);
            }
            catch {
                alertsOn = false;
            }
            if (!alertsOn)
                return;
            let teamCreds;
            try {
                teamCreds = await this.getCredentials('newsmanTeamAlerts');
            }
            catch {
                return;
            }
            if (!teamCreds?.chatWebhookUrl)
                return;
            await (0, internalOps_1.sendTeamChatAlert)((opts) => this.helpers.httpRequest(opts), {
                chatWebhookUrl: String(teamCreds.chatWebhookUrl || ''),
                chatChannel: String(teamCreds.chatChannel || ''),
                chatUsername: String(teamCreds.chatUsername || ''),
            }, message);
        };
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            let response;
            try {
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
                    const props = (0, json_1.parseJson)(propsJson, 'propsJson');
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
                    const params = (0, json_1.parseJson)(paramsJson, 'paramsJson');
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
                        recipients = (0, json_1.parseJson)(recipientsExpression, 'recipientsExpression');
                    }
                    else {
                        const recipientsJson = this.getNodeParameter('recipientsJson', i);
                        recipients = (0, json_1.parseJson)(recipientsJson, 'recipientsJson');
                    }
                    if (!message.from_name ||
                        !message.from_email ||
                        !message.subject ||
                        !message.html) {
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
                    const props = (0, json_1.parseJson)(propsJson, 'smsPropsJson');
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
                else if (operation === 'getProductGroups') {
                    const listId = this.getNodeParameter('listId', i);
                    response = await newsmanRequest({
                        endpoint: 'feeds',
                        method: 'getProductGroups',
                        httpMethod: 'GET',
                        qs: { list_id: listId },
                    });
                }
                else if (operation === 'getProductGroup') {
                    const listId = this.getNodeParameter('listId', i);
                    const productGroupId = this.getNodeParameter('productGroupId', i);
                    response = await newsmanRequest({
                        endpoint: 'feeds',
                        method: 'getProductGroup',
                        httpMethod: 'GET',
                        qs: { list_id: listId, product_group_id: productGroupId },
                    });
                }
                else if (operation === 'getProductGroupProducts') {
                    const listId = this.getNodeParameter('listId', i);
                    const productGroupId = this.getNodeParameter('productGroupId', i);
                    const feedOptions = (0, json_1.parseJson)(this.getNodeParameter('feedOptionsJson', i), 'feedOptionsJson') ?? {};
                    response = await newsmanRequest({
                        endpoint: 'feeds',
                        method: 'getProductGroupProducts',
                        httpMethod: 'GET',
                        qs: {
                            list_id: listId,
                            product_group_id: productGroupId,
                            // v2 GET: structured values must be JSON-encoded in the query string
                            options: JSON.stringify(feedOptions),
                        },
                    });
                }
                else if (operation === 'getDraftInfo') {
                    const draftId = this.getNodeParameter('draftId', i);
                    response = await newsmanRequest({
                        endpoint: 'draft',
                        method: 'getDraftInfo',
                        httpMethod: 'GET',
                        qs: { draft_id: draftId },
                    });
                }
                else if (operation === 'parseDraftHandlebars') {
                    const listId = this.getNodeParameter('listId', i);
                    const draftId = this.getNodeParameter('draftId', i);
                    const compileParams = (0, json_1.parseJson)(this.getNodeParameter('compileParamsJson', i), 'compileParamsJson') ?? {};
                    response = await newsmanRequest({
                        endpoint: 'draft',
                        method: 'getParseDraftHTMLHandlebars',
                        httpMethod: 'POST',
                        body: {
                            list_id: listId,
                            draft_id: draftId,
                            compile_params: compileParams,
                        },
                    });
                }
                else if (operation === 'createNewsletter') {
                    const listId = this.getNodeParameter('listId', i);
                    const html = this.getNodeParameter('newsletterHtml', i);
                    const textRaw = this.getNodeParameter('newsletterText', i);
                    const newsletterProps = (0, json_1.parseJson)(this.getNodeParameter('newsletterPropsJson', i), 'newsletterPropsJson') ?? {};
                    const text = textRaw?.trim() ? textRaw : false;
                    const created = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'create',
                        httpMethod: 'POST',
                        body: {
                            list_id: listId,
                            html: html || false,
                            text,
                            newsletter_props: newsletterProps,
                        },
                    });
                    const createdData = unwrap(created);
                    response =
                        typeof createdData === 'number' || typeof createdData === 'string'
                            ? { newsletter_id: createdData }
                            : createdData;
                }
                else if (operation === 'scheduleNewsletter') {
                    const newsletterId = this.getNodeParameter('newsletterId', i);
                    const scheduleTime = this.getNodeParameter('scheduleTime', i);
                    response = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'schedule',
                        httpMethod: 'POST',
                        body: {
                            newsletter_id: newsletterId,
                            schedule_time: scheduleTime,
                        },
                    });
                }
                else if (operation === 'confirmNewsletter') {
                    const newsletterId = this.getNodeParameter('newsletterId', i);
                    response = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'confirm',
                        httpMethod: 'POST',
                        body: { newsletter_id: newsletterId },
                    });
                }
                else if (operation === 'sendNewsletterConfirm') {
                    const newsletterId = this.getNodeParameter('newsletterId', i);
                    response = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'sendConfirm',
                        httpMethod: 'POST',
                        body: { newsletter_id: newsletterId },
                    });
                }
                else if (operation === 'setNewsletterSegments') {
                    const newsletterId = this.getNodeParameter('newsletterId', i);
                    const segmentIds = (0, json_1.parseJson)(this.getNodeParameter('segmentIdsJson', i), 'segmentIdsJson') ?? [];
                    if (!Array.isArray(segmentIds)) {
                        throw new Error('Segment IDs JSON must be an array');
                    }
                    response = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'setSegments',
                        httpMethod: 'POST',
                        body: {
                            newsletter_id: newsletterId,
                            segment_ids: segmentIds,
                        },
                    });
                }
                else if (operation === 'sendNewsletterTest') {
                    const listId = this.getNodeParameter('listId', i);
                    const emails = (0, json_1.parseEmailList)(this.getNodeParameter('testEmails', i), 'Test Emails');
                    const subject = this.getNodeParameter('testSubject', i);
                    const html = this.getNodeParameter('testHtml', i);
                    const text = this.getNodeParameter('testText', i, '');
                    response = await newsmanRequest({
                        endpoint: 'newsletter',
                        method: 'sendTest',
                        httpMethod: 'POST',
                        body: {
                            list_id: listId,
                            html,
                            text: text ?? '',
                            emails,
                            subject,
                        },
                    });
                }
                else if (operation === 'scheduleAutomatedNewsletter') {
                    response = await runAutomatedNewsletter.call(this, {
                        itemIndex: i,
                        newsmanRequest,
                        unwrap,
                        maybeTeamAlert,
                    });
                }
                else {
                    throw new Error(`Unsupported operation: ${operation}`);
                }
            }
            catch (error) {
                if (operation === 'scheduleAutomatedNewsletter') {
                    const errMsg = error instanceof Error ? error.message : String(error);
                    await maybeTeamAlert(i, `Auto NL failure: ${errMsg}`);
                }
                throw error;
            }
            returnData.push(unwrap(response));
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Newsman = Newsman;
async function runAutomatedNewsletter(ctx) {
    const i = ctx.itemIndex;
    const listId = this.getNodeParameter('listId', i);
    const draftId = this.getNodeParameter('draftId', i);
    const automationMode = this.getNodeParameter('automationMode', i, 'preview');
    const isPreview = automationMode === 'preview';
    const isSendTest = automationMode === 'sendTest';
    const productGroupsMap = (0, json_1.parseJson)(this.getNodeParameter('productGroupsMapJson', i), 'productGroupsMapJson');
    const subjects = (0, json_1.parseJson)(this.getNodeParameter('subjectsJson', i), 'subjectsJson');
    const shuffleProducts = this.getNodeParameter('shuffleProducts', i);
    const maxProductsPerGroup = this.getNodeParameter('maxProductsPerGroup', i);
    const titleWordLimit = this.getNodeParameter('titleWordLimit', i);
    const website = this.getNodeParameter('website', i);
    const cdnBaseUrl = this.getNodeParameter('cdnBaseUrl', i);
    const rewriteImagesViaCdn = this.getNodeParameter('rewriteImagesViaCdn', i);
    const productImageResizeMode = this.getNodeParameter('productImageResizeMode', i, 'none');
    const productImageWidth = this.getNodeParameter('productImageWidth', i, 0);
    const productImageHeight = this.getNodeParameter('productImageHeight', i, 0);
    const scheduleDelayMinutes = this.getNodeParameter('scheduleDelayMinutes', i, 3);
    // Prefer dedicated automated-schedule fields; fall back for older saved nodes
    const scheduleTimeRaw = (this.getNodeParameter('scheduleTimeAutomated', i, '') ||
        this.getNodeParameter('scheduleTime', i, '') ||
        '').trim();
    const postScheduleAction = this.getNodeParameter('postScheduleAction', i, 'none');
    const segmentIds = (0, json_1.parseJson)(this.getNodeParameter('segmentIdsJsonAutomated', i, this.getNodeParameter('segmentIdsJson', i, '[]')), 'segmentIdsJsonAutomated') ?? [];
    const bannerSource = this.getNodeParameter('bannerSource', i);
    const includeHtml = isPreview
        ? true
        : this.getNodeParameter('includeHtml', i, false);
    const extraCompileParams = (0, json_1.parseJson)(this.getNodeParameter('extraCompileParamsJson', i, '{}'), 'extraCompileParamsJson') ?? {};
    if (!productGroupsMap || typeof productGroupsMap !== 'object' || Array.isArray(productGroupsMap)) {
        throw new Error('Product Groups Map JSON must be an object of handlebarsKey → product_group_id');
    }
    if (!Array.isArray(subjects) || subjects.length < 1) {
        throw new Error('Subjects JSON must be a non-empty array of strings');
    }
    const subject = String(subjects[Math.floor(Math.random() * subjects.length)]);
    const label = website?.trim() || `list ${listId}`;
    const compileParams = {
        ...(typeof extraCompileParams === 'object' && extraCompileParams
            ? extraCompileParams
            : {}),
    };
    const productCounts = {};
    for (const [key, groupId] of Object.entries(productGroupsMap)) {
        const productsRaw = await ctx.newsmanRequest({
            endpoint: 'feeds',
            method: 'getProductGroupProducts',
            httpMethod: 'GET',
            qs: {
                list_id: listId,
                product_group_id: String(groupId),
                options: JSON.stringify({}),
            },
        });
        const productsList = Array.isArray(productsRaw)
            ? productsRaw
            : Array.isArray(ctx.unwrap(productsRaw))
                ? ctx.unwrap(productsRaw)
                : [];
        const normalized = (0, products_1.normalizeProductGroup)(productsList, {
            titleWordLimit,
            shuffle: shuffleProducts,
            maxProducts: maxProductsPerGroup,
            rewriteViaCdn: rewriteImagesViaCdn,
            website,
            cdnBaseUrl,
            resizeMode: productImageResizeMode,
            imageWidth: productImageWidth,
            imageHeight: productImageHeight,
        });
        if (normalized.length < 1) {
            const msg = `${label}: insufficient products for group '${key}' (id ${groupId}) for NL ${subject}`;
            await ctx.maybeTeamAlert(i, msg);
            throw new Error(msg);
        }
        compileParams[key] = normalized;
        productCounts[key] = normalized.length;
    }
    if (bannerSource === 'manual') {
        let bannerSrc = this.getNodeParameter('bannerSrc', i);
        const bannerUrl = this.getNodeParameter('bannerUrl', i);
        if (!bannerSrc?.trim() || !bannerUrl?.trim()) {
            const msg = `${label}: banner src/url missing for NL ${subject}`;
            await ctx.maybeTeamAlert(i, msg);
            throw new Error(msg);
        }
        if (rewriteImagesViaCdn && website?.trim()) {
            const bannerImageResizeMode = this.getNodeParameter('bannerImageResizeMode', i, 'none');
            const bannerImageWidth = this.getNodeParameter('bannerImageWidth', i, 0);
            const bannerImageHeight = this.getNodeParameter('bannerImageHeight', i, 0);
            bannerSrc = (0, cdn_1.buildStandardCdnUrl)({
                website,
                imgSource: bannerSrc,
                cdnBaseUrl,
                resizeMode: bannerImageResizeMode,
                width: bannerImageWidth,
                height: bannerImageHeight,
            });
        }
        compileParams.banner_src = bannerSrc;
        compileParams.banner_url = bannerUrl;
    }
    else if (bannerSource === 'brandfetch') {
        const siteUrl = this.getNodeParameter('brandfetchSiteUrl', i);
        const headers = (0, json_1.parseJson)(this.getNodeParameter('brandfetchHeadersJson', i, '{}'), 'brandfetchHeadersJson') ?? {};
        if (!siteUrl?.trim()) {
            const msg = `${label}: brandfetch site URL missing for NL ${subject}`;
            await ctx.maybeTeamAlert(i, msg);
            throw new Error(msg);
        }
        let brandResponse;
        try {
            brandResponse = await this.helpers.httpRequest({
                method: 'GET',
                url: 'https://bftch.newsmanapp.com/api/brand',
                qs: { url: siteUrl },
                headers: typeof headers === 'object' && headers ? headers : {},
                json: true,
            });
        }
        catch (error) {
            const msg = `${label}: brandfetch failed for NL ${subject}: ${error instanceof Error ? error.message : String(error)}`;
            await ctx.maybeTeamAlert(i, msg);
            throw new Error(msg);
        }
        const brand = ctx.unwrap(brandResponse) ?? brandResponse;
        let bannerSrc = brand?.banner_src ||
            brand?.src ||
            brand?.image ||
            brand?.banner?.src ||
            '';
        const bannerUrl = brand?.banner_url ||
            brand?.href ||
            brand?.url ||
            brand?.banner?.href ||
            siteUrl;
        if (!bannerSrc) {
            const msg = `${label}: brandfetch returned no banner image for NL ${subject}`;
            await ctx.maybeTeamAlert(i, msg);
            throw new Error(msg);
        }
        if (rewriteImagesViaCdn && website?.trim()) {
            const bannerImageResizeMode = this.getNodeParameter('bannerImageResizeMode', i, 'none');
            const bannerImageWidth = this.getNodeParameter('bannerImageWidth', i, 0);
            const bannerImageHeight = this.getNodeParameter('bannerImageHeight', i, 0);
            bannerSrc = (0, cdn_1.buildStandardCdnUrl)({
                website,
                imgSource: String(bannerSrc),
                cdnBaseUrl,
                resizeMode: bannerImageResizeMode,
                width: bannerImageWidth,
                height: bannerImageHeight,
            });
        }
        compileParams.banner_src = bannerSrc;
        compileParams.banner_url = bannerUrl;
    }
    const parsed = await ctx.newsmanRequest({
        endpoint: 'draft',
        method: 'getParseDraftHTMLHandlebars',
        httpMethod: 'POST',
        body: {
            list_id: listId,
            draft_id: draftId,
            compile_params: compileParams,
        },
    });
    const parsedData = ctx.unwrap(parsed) ?? parsed;
    const html = parsedData?.parsed_html ?? parsedData?.html;
    if (!html) {
        throw new Error('Draft parse did not return parsed_html');
    }
    if (isPreview || isSendTest) {
        const output = {
            mode: isSendTest ? 'sendTest' : 'preview',
            subject,
            html,
            product_counts: productCounts,
            draft_id: draftId,
            list_id: listId,
            parsed: parsedData,
        };
        if (isSendTest) {
            const emails = (0, json_1.parseEmailList)(this.getNodeParameter('testEmails', i), 'Test Emails');
            const sendTestResult = await ctx.newsmanRequest({
                endpoint: 'newsletter',
                method: 'sendTest',
                httpMethod: 'POST',
                body: {
                    list_id: listId,
                    html,
                    text: '',
                    emails,
                    subject,
                },
            });
            output.test_emails = emails;
            output.send_test_result = ctx.unwrap(sendTestResult);
        }
        return output;
    }
    const created = await ctx.newsmanRequest({
        endpoint: 'newsletter',
        method: 'create',
        httpMethod: 'POST',
        body: {
            list_id: listId,
            html,
            text: false,
            newsletter_props: {
                encoding: 'utf-8',
                subject,
            },
        },
    });
    const createdData = ctx.unwrap(created);
    const newsletterId = typeof createdData === 'number' || typeof createdData === 'string'
        ? createdData
        : createdData?.newsletter_id ?? createdData?.id;
    if (!newsletterId) {
        throw new Error('newsletter.create did not return newsletter_id');
    }
    if (Array.isArray(segmentIds) && segmentIds.length > 0) {
        await ctx.newsmanRequest({
            endpoint: 'newsletter',
            method: 'setSegments',
            httpMethod: 'POST',
            body: {
                newsletter_id: newsletterId,
                segment_ids: segmentIds,
            },
        });
    }
    let scheduleTime = scheduleTimeRaw;
    if (!scheduleTime) {
        const delayMs = Math.max(0, Number(scheduleDelayMinutes) || 0) * 60 * 1000;
        const when = new Date(Date.now() + delayMs);
        scheduleTime = formatUtcScheduleTime(when);
    }
    const scheduleResult = await ctx.newsmanRequest({
        endpoint: 'newsletter',
        method: 'schedule',
        httpMethod: 'POST',
        body: {
            newsletter_id: newsletterId,
            schedule_time: scheduleTime,
        },
    });
    let confirmResult = null;
    if (postScheduleAction === 'sendConfirm') {
        confirmResult = await ctx.newsmanRequest({
            endpoint: 'newsletter',
            method: 'sendConfirm',
            httpMethod: 'POST',
            body: { newsletter_id: newsletterId },
        });
    }
    else if (postScheduleAction === 'confirm') {
        confirmResult = await ctx.newsmanRequest({
            endpoint: 'newsletter',
            method: 'confirm',
            httpMethod: 'POST',
            body: { newsletter_id: newsletterId },
        });
    }
    const output = {
        mode: 'schedule',
        subject,
        newsletter_id: newsletterId,
        schedule_time: scheduleTime,
        schedule_result: ctx.unwrap(scheduleResult),
        post_schedule_action: postScheduleAction,
        confirm_result: confirmResult === null ? null : ctx.unwrap(confirmResult),
        product_counts: productCounts,
        draft_id: draftId,
        list_id: listId,
    };
    if (includeHtml) {
        output.html = html;
        output.parsed = parsedData;
    }
    return output;
}
function formatUtcScheduleTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return (`${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
        ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`);
}
