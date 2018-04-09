'use strict';

var rules = exports.rules = {
  'object-meets-standard': require('./lib/rules/object-meets-standard')
}


var rules = exports.configs = {
    recommended: {
        rules: {
            'fsa/object-meets-standard': 2
        }
    }
}
