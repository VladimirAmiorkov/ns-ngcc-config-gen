# ns-ngcc-config-gen
NodeJS script that generated an `ngcc.config.js` file from a list of packages.

This script assumes that the packages for which it is generating an `ngcc.config.js` contain an **./angular** directory which holds and `index.js` and `index.d.ts` and wil generate config like this:

```
"<plugin-name>": {
    "entryPoints": {
        ".": {
            "ignoreMissingDependencies": true,
        },
        "angular": {
            "override": {
                "main": "./index.js",
                "typings": "./index.d.ts",
            },
            "ignoreMissingDependencies": true,
        },
    },
}
```
