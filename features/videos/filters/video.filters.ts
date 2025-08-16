import { parseAsString, parseAsInteger } from 'nuqs';

export const videoFiltersClient = {
    filter: {
        title: parseAsString.withDefault(''),
        createdAt: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(12),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
};