import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { posix } from 'node:path';
import { getGenerateURL } from './generateURL.js';
import { getHandleDelete } from './handleDelete.js';
import { getHandleUpload } from './handleUpload.js';
import { getStaticHandler } from './staticHandler.js';
import { isImage } from './utils.js';
export const bunnyStorage = (bunnyStorageOptions)=>(incomingConfig)=>{
        if (bunnyStorageOptions.enabled === false) {
            return incomingConfig;
        }
        const adapter = bunnyInternal(bunnyStorageOptions);
        const collectionsWithAdapter = Object.entries(bunnyStorageOptions.collections).reduce((acc, [slug, collOptions])=>({
                ...acc,
                [slug]: {
                    ...collOptions === true ? {} : collOptions,
                    adapter
                }
            }), {});
        const config = {
            ...incomingConfig,
            collections: (incomingConfig.collections || []).map((collection)=>{
                if (!collectionsWithAdapter[collection.slug]) {
                    return collection;
                }
                return {
                    ...collection,
                    upload: {
                        ...typeof collection.upload === 'object' ? collection.upload : {},
                        adminThumbnail: bunnyStorageOptions.options.adminThumbnail !== undefined ? ({ doc })=>{
                            const { adminThumbnail = true, storage, stream } = bunnyStorageOptions.options;
                            const hasUpdatedAt = doc.updatedAt !== null;
                            const timestampQuery = hasUpdatedAt ? `t=${Date.parse(doc.updatedAt)}` : '';
                            if (stream && doc.bunnyVideoId && typeof doc.bunnyVideoId === 'string') {
                                const baseUrl = `https://${stream.hostname}/${doc.bunnyVideoId}/thumbnail.jpg`;
                                return timestampQuery ? `${baseUrl}?${timestampQuery}` : baseUrl;
                            }
                            if (doc.mimeType && isImage(doc.mimeType)) {
                                const filename = doc.filename;
                                const prefix = doc.prefix || '';
                                const baseUrl = `https://${storage.hostname}/${posix.join(prefix, filename)}`;
                                if (adminThumbnail === true) {
                                    return timestampQuery ? `${baseUrl}?${timestampQuery}` : baseUrl;
                                }
                                const options = adminThumbnail;
                                const queryParams = new URLSearchParams(options.queryParams || {});
                                if (options.appendTimestamp && hasUpdatedAt) {
                                    queryParams.append('t', Date.parse(doc.updatedAt).toString());
                                }
                                const queryString = queryParams.toString();
                                return queryString ? `${baseUrl}?${queryString}` : baseUrl;
                            }
                            return null;
                        } : undefined,
                        disableLocalStorage: true
                    }
                };
            })
        };
        return cloudStoragePlugin({
            collections: collectionsWithAdapter
        })(config);
    };
const bunnyInternal = ({ options })=>{
    const fields = options.stream ? [
        {
            name: 'bunnyVideoId',
            type: 'text',
            admin: {
                disabled: true,
                hidden: true
            }
        }
    ] : [];
    return ({ collection, prefix })=>{
        return {
            name: 'bunny',
            fields,
            generateURL: getGenerateURL(options),
            handleDelete: getHandleDelete(options),
            handleUpload: getHandleUpload({
                ...options,
                prefix
            }),
            staticHandler: getStaticHandler({
                ...options,
                collection,
                prefix
            })
        };
    };
};

//# sourceMappingURL=index.js.map