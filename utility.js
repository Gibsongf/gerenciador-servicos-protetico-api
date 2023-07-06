exports.emptyFields = (obj) => {
    const newObj = {};
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        if (obj[k].length > 0) {
            newObj[k] = obj[k];
        }
    });
    return newObj;
};
