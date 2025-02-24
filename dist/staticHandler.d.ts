import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types';
import type { CollectionConfig } from 'payload';
import type { BunnyAdapterOptions } from './types.js';
type Args = {
    collection: CollectionConfig;
    prefix?: string;
} & BunnyAdapterOptions;
export declare const getStaticHandler: ({ collection, prefix, storage, stream, }: Args) => StaticHandler;
export {};
