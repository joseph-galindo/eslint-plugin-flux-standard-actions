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
            FunctionDeclaration: function(node) {
                const filename = context.getFilename();

                // If file is not action file, then leave it.
                if (!isActionFile(filename)) {
                    return;
                }

                if(!node.body) {
                    invalidObjectError(node, context);
                }

                // Take body of return statement.
                const returnBody = node.body.body;
                if (!returnBody || returnBody.length !== 1 ||  returnBody[0].type !== 'ReturnStatement') {
                    invalidObjectError(node, context);
                }
            }
        };
    }
};
