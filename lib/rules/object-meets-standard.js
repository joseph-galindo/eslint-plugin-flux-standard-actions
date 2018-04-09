const isActionFile = require('../util/isActionFile');

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
        function invalidObjectError(node, context) {
             context.report(node, 'No code except plain action object is allowed.');
        };

        // Return rule implementation
        return {
            ArrowFunctionExpression: function(node) {
                const filename = context.getFilename();

                // If file is not action file, then leave it.
                if (!isActionFile(filename)) {
                    return;
                }

                let actionCreatorName = node.parent.id.name;
                let fileRoot = node.parent;

                // This rule assumes that only export-ed arrow functions are action creator functions.
                // This is done for files where we may have a mix of helper functions and action creator functions.
                while (fileRoot.parent) {
                    fileRoot = fileRoot.parent;
                }

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
                        if (currentNode.declaration.declarations[0].id.name !== actionCreatorName) {
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

            }
        };
    }
};
