# eslint-plugin-fsa

This is an ESLint plugin, that restricts developers from writing custom actions for flux. The main purpose is to use human friendly standard action creators.

## Installing

`npm install eslint-plugin-fsa --save-dev`

## ESLint Rules
There is one rule in the plugin:

* object-meets-standard: checks if action functions return an object that meets the [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) standard.

## Sample Configuration File

Here's a sample ESLint configuration file that activates these rules:

```
{
    "extends": "plugin:fsa/recommended",
    "plugins": [
        "fsa"
    ]
}
```

Or turn rules one by one:
```
{
    "plugins": [
        "fsa"
    ],
    "rules": {
    	"fsa/object-meets-standard": 2
    }
}
```
