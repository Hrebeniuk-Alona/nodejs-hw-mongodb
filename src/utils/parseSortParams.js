import { SORT_ORDER} from '../constants/index.js';

function parseSortBy(value) {
    if (typeof value === 'undefined') {
        return '_id';
    }
    const keys = ['_id', 'name', 'isFavourite', 'contactType', 'email', 'phoneNumber', 'createdAt',];

    if (keys.includes(value)) {
        return value;
    }
    
    return '_id';
}

function parseSortOrder(value) {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value);
    if (isKnownOrder) return value;
    return SORT_ORDER.ASC;
}



export function parseSortParams(query) {
    const { sortBy, sortOrder } = query;

    const parsedSortBy = parseSortBy(sortBy);
    const parsedSortOrder = parseSortOrder(sortOrder);

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder,
    };
}