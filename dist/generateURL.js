import { posix } from 'node:path';
export const getGenerateURL = ({ storage, stream })=>{
    return ({ data, filename, prefix = '' })=>{
        if (stream && data.bunnyVideoId) {
            return `https://${stream.hostname}/${data.bunnyVideoId}/playlist.m3u8`;
        }
        return `https://${storage.hostname}/${posix.join(prefix, filename)}`;
    };
};

//# sourceMappingURL=generateURL.js.map