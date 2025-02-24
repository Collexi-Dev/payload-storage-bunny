import ky, { HTTPError } from 'ky';
import { posix } from 'node:path';
import { APIError } from 'payload';
import { getStorageUrl, getVideoId } from './utils.js';
export const getHandleDelete = ({ storage, stream })=>{
    return async ({ doc, filename, req })=>{
        try {
            const videoId = getVideoId(doc, filename);
            if (stream && videoId) {
                await ky.delete(`https://video.bunnycdn.com/library/${stream.libraryId}/videos/${videoId}`, {
                    headers: {
                        accept: 'application/json',
                        AccessKey: stream.apiKey
                    },
                    timeout: 120000
                });
            } else {
                const filePath = posix.join(doc.prefix || '', filename);
                await ky.delete(`https://${getStorageUrl(storage.region)}/${storage.zoneName}/${filePath}`, {
                    headers: {
                        accept: 'application/json',
                        AccessKey: storage.apiKey
                    },
                    timeout: 120000
                });
            }
        } catch (err) {
            if (err instanceof HTTPError) {
                const errorResponse = await err.response.text();
                req.payload.logger.error({
                    error: {
                        response: errorResponse,
                        status: err.response.status,
                        statusText: err.response.statusText
                    },
                    file: {
                        name: filename
                    },
                    storage: storage.zoneName
                });
            }
            req.payload.logger.error({
                error: err,
                file: {
                    name: filename
                },
                storage: storage.zoneName
            });
            throw new APIError(`Error deleting file: ${filename}`, 500);
        }
    };
};

//# sourceMappingURL=handleDelete.js.map