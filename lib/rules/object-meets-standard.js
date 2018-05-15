const isFSA = require('flux-standard-action').isFSA;
const isActionFile = require('../util/isActionFile');

/*
 * TODO: add support for the following:
 * - default exports
 * - commonJS style exports
 * - using `function myAction () {...} syntax`
 * - config flag, to remove the assumption that exported functions are the action creators
 * - flag to change action regex used in util
 */
module.exports = {
    meta: {
        docs: {
            description: "Enforce that Redux action creator functions return Flux Standard Action compliant action objects.",
            category: "Best Practices",
            recommended: true
        }
    },
    create: function(context) {
        // Helpers
        function didNotReturnObjectError(node, context) {
            context.report(node, 'Action creators must return an object expression.');
        };
        function invalidObjectError(node, context) {
             context.report(node, 'The action creator does not return an FSA-compliant object.');
        };

        // Return rule implementation
        return {
            ArrowFunctionExpression: function(node) {
                const filename = context.getFilename();

                // If file is not action file, then leave it.
                if (!isActionFile(filename)) {
                    return;
                }

                // If an anonymous arrow function, just return for now.
                if (!node.parent.id) {
                    return;
                }

                let actionCreatorName = node.parent.id.name;
                let fileRoot = node.parent;

                while (fileRoot.parent) {
                    fileRoot = fileRoot.parent;
                }

                // This rule assumes that only export-ed arrow functions are action creator functions.
                // This assumption is made, since often an action creator file may have a mix of helper functions and the action creator function.
                let exportNodes = fileRoot.body.filter((node) => {
                    return (node.type === 'ExportNamedDeclaration');
                });
                let arrowFunctionIsExported = false;

                for (let i = exportNodes.length; i--;) {
                    let currentNode = exportNodes[i];

                    // If we already determined this ArrowFunctionExpression is exported in some way, break from the loop.
                    if (arrowFunctionIsExported) {
                        break;
                    }

                    // First, check if this arrow function is in a separate export.
                    // such as `export { myAction };`
                    // If it isn't, we continue to check if the arrow function is exported during declaration.
                    if (currentNode.specifiers) {
                        let exports = currentNode.specifiers;

                        // local is correct, regardless of export aliasing
                        let match = currentNode.specifiers.filter((specifier) => {
                            return (specifier.local.name === actionCreatorName);
                        });

                        // If a match is found, the ArrowFunctionExpression is exported.
                        // For now we assume that means it's an action creator, so flag to CONTINUE linting.
                        if (match.length) {
                            arrowFunctionIsExported = true;
                            break;
                        }
                    }

                    // This covers inline exports like `export const myAction = () => {...};`
                    if (currentNode.declaration) {
                        if (currentNode.declaration.declarations[0].id.name === actionCreatorName) {
                            arrowFunctionIsExported = true;
                            break;
                        }
                    }
                }

                // If this arrow function is not exported, we assume it's not an action creator.
                // So we return early and stop linting on this specific arrow function expression.
                if (!arrowFunctionIsExported) {
                    return;
                }

                // At this point, we have an ArrowFunctionExpression, inside a .js file in an /actions folder, that is exported through es6 modules.
                // So now, we assume the fn is an action creator, and check that its return statement (which should be an object) is FSA-compliant.
                // First, we want to parse out the return statement from the AST.
                let returnNode = node.body.body.filter((fnNode) => {
                    return (fnNode.type === 'ReturnStatement');
                })[0];

                // If there is no explicit return, or arg given to the explicit return, just return early for now.
                if (!returnNode || !returnNode.argument) {
                    return;
                }

                // Enforce that action creators return object expressions.
                if (returnNode.argument.type !== 'ObjectExpression') {
                    didNotReturnObjectError(node, context);

                    return;
                }

                // Re-construct the returned action object, using the AST.
                // TODO: reconsider using escodegen here.
                let actionObject = {};

                for (let j = 0; j < returnNode.argument.properties.length; j++) {
                    let currentProperty = returnNode.argument.properties[j];

                    actionObject[currentProperty.key.name] = '';
                }

                // Finally, feed that object into the `isFSA(action)` utility provided at:
                // https://github.com/redux-utilities/flux-standard-action#isfsaaction
                let isCompliant = isFSA(actionObject);

                if (!isCompliant) {
                    invalidObjectError(node, context);

                    return;
                }
            }
        };
    }
};
