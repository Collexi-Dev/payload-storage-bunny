import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types';
import type { BunnyAdapterOptions } from './types.js';
type Args = {
    prefix?: string;
} & BunnyAdapterOptions;
export declare const getHandleUpload: ({ prefix, storage, stream }: Args) => HandleUpload;
export {};
