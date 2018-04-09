'use strict';

const rule = require('../../../lib/rules/object-meets-standard');
const RuleTester = require('eslint').RuleTester;

// FILE_NAME is needed since the rule only looks at files inside an actions/ directory.
const ruleTester = new RuleTester();
const FILE_NAME = 'actions/action.js';

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
