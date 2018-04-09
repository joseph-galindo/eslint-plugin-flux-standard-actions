'use strict';

// foo
var FILE_NAME = 'actions/action.js';

var rule = require('../rules/object-meets-standard'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('object-meets-standard', rule, {
    valid: [
        {
            code: 'function someAction() { return { type: "actionType" }; }',
            filename: FILE_NAME
        }
    ],

    invalid: [
        {
            code: 'function someAction() { var type = "actionType"; return { type: type }; }',
            filename: FILE_NAME,
            errors: [ { message: 'No code except plain action object is allowed.' } ]
        }
    ]
});
