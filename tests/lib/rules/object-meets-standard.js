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

                export { myAction };
            `,
            filename: FILE_NAME
        },
        {
            code: `
                export const myAction = () => {
                    return {
                        type: 'MY_ACTION_TYPE',
                        payload: 'my_payload'
                    };
                };
            `,
            filename: FILE_NAME
        }
    ],

    invalid: [
        {
            code: `
                const myAction = () => {
                    return {
                        type: 'MY_ACTION_TYPE',
                        payload: 'my_payload',
                        incorrectProp: 'This prop is not FSA-compliant.'
                    };
                };

                export { myAction };
            `,
            filename: FILE_NAME,
            errors: [
                {
                    message: 'The action creator does not return an FSA-compliant object.'
                }
            ]
        },
        {
            code: `
                const myAction = () => {
                    return 7;
                };

                export { myAction };
            `,
            filename: FILE_NAME,
            errors: [
                {
                    message: 'Action creators must return an object expression.'
                }
            ]
        }
    ]
});
