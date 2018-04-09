module.exports = function (filename) {
    const ACTIONS_REGEX = /actions\//;

    return ACTIONS_REGEX.test(filename);
};
