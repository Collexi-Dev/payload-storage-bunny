export const getStorageUrl = (region)=>{
    if (!region) {
        return 'storage.bunnycdn.com';
    }
    return `${region}.storage.bunnycdn.com`;
};
export const getVideoId = (doc, filename)=>{
    if (doc && typeof doc === 'object' && 'filename' in doc && doc.filename === filename && 'bunnyVideoId' in doc) {
        return doc.bunnyVideoId;
    }
    return undefined;
};
export const isImage = (mimeType)=>mimeType.startsWith('image/');
export const isVideo = (mimeType)=>mimeType.startsWith('video/');

//# sourceMappingURL=utils.js.map