exports.emptyFields = (obj) => {
    const newObj = {};
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        if (obj[k].length > 0) return (newObj[k] = obj[k]);
    });
    return newObj;
};
