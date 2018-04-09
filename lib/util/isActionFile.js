module.exports = function (filename)
{
    var ACTIONS = /actions/;
    return ACTIONS.test(filename);
}