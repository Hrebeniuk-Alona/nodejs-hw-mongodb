function parseContactType(type){
    const isString = typeof type === 'string';
    if (!isString) return;
    const isType = (type) => ['work', 'home', 'personal'].includes(type);

    if (isType(type)) return type;
}


function checkIsFavourite(favourite) {
    if(favourite === 'true'){
        return true;
    }
    if (favourite === 'false') {
        return false;
    }

    return undefined;
}


export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;

    const parsedContactType = parseContactType(contactType);
    const checkedIsFavourite = checkIsFavourite(isFavourite);

    return {
        contactType: parsedContactType,
        isFavourite: checkedIsFavourite,
    };

};