'use strict';

const rule = require('../../../lib/rules/object-meets-standard');
const RuleTester = require('eslint').RuleTester;

// FILE_NAME is needed since the rule only looks at files inside an actions/ directory.
const parseConfig = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    }
};
const ruleTester = new RuleTester(parseConfig);
const FILE_NAME = 'actions/myAction.js';

ruleTester.run('object-meets-standard', rule, {
    valid: [
        {
            code: `
                const myAction = () => {
                    return {
                        type: 'MY_ACTION_TYPE',
                        payload: 'my_payload'
                    };
                };
                const thing = 'x';

                export { myAction, thing };
            `,
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
