module.exports = function (filename) {
    const ACTIONS_REGEX = /\/actions\/[^\/]*\.js/;

    return ACTIONS_REGEX.test(filename);
};
