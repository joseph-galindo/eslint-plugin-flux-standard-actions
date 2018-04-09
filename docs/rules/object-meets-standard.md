# Enforce that action creators export FSA-compliant objects (fsa/object-meets-standard)

This rule prevents Redux action creators from returning objects that do not comply to the [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) standard.

## Rule Details

There are a few limitations to this rule:
- It only applies to files within an `actions/` directory (non-configurable).
- It only applies to action creator functions that are:
   - Arrow function expressions
   - Exported via es6 named exports

The assumption was made that only exported arrow function expressions are potential action creators. This assumption was made because typically, a file can have helper functions (that aren't usually exported), and the actual action creator function (which tends to always be exported).

The following patterns are considered errors:

```js
const myAction = () => {
    return {
        type: 'MY_ACTION_TYPE',
        payload: 'my_payload',
        incorrectProp: 'This prop is not FSA-compliant.'
    };
};

export { myAction };
```

```js
const myAction = () => {
    return 7;
};

export { myAction };
```

The following patterns are **not** considered errors:

```js
const myAction = () => {
    return {
        type: 'MY_ACTION_TYPE',
        payload: 'my_payload'
    };
};

export { myAction };
```

```js
export const myAction = () => {
    return {
        type: 'MY_ACTION_TYPE',
        payload: 'my_payload'
    };
};
```

### Related resources

- [isFSA utility function](https://github.com/redux-utilities/flux-standard-action#isfsaaction) - this does the underlying compliance check in the rule
