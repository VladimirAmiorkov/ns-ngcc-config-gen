import { writeFile, existsSync, mkdirSync, unlinkSync } from "fs";
import * as lineReader from 'line-reader';

const pluginNamesFilePath = "plugin-names.txt";
const distPath = "./dist";
const outputConfigPath = distPath + "/ngcc.config.js";
let names: Array<string> = [];

lineReader.eachLine(pluginNamesFilePath, function (line: any, last: any) {
    names.push(line);
    if (last) {
        writeToDist();
        return false;
    }
});

function writeToDist() {
    let configStart = `module.exports = {
    "packages": {
        <packages-placeholder>
    }
}`;
    let packagesPlaceholderKey = "<packages-placeholder>";
    let pluginNamePlaceHolderKey = "<plugin-name>";
    let configPluginTemplate =
    `"<plugin-name>": {
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
                }
            }
        }`;
    var packagesJson: any = {};
    packagesJson.packages = [];
    if (names.length > 0) {
        try {
            if (!existsSync(distPath)) {
                mkdirSync(distPath);
            }

            if (existsSync(outputConfigPath)) {
                unlinkSync(outputConfigPath)
            }
            names.forEach(name => {
                let ngccConfig = configPluginTemplate.replace(pluginNamePlaceHolderKey, name);
                if (packagesJson.packages.length !== 0) {
                    packagesJson.packages.push("\r\n        " + ngccConfig);
                } else {
                    packagesJson.packages.push(ngccConfig);
                }
            });
            let appNgccConfig = configStart.replace(packagesPlaceholderKey, packagesJson.packages);
            writeFile(outputConfigPath, appNgccConfig, (err) => {
                if (err) throw err;
                console.log("'ngcc.config.js' file created at './dist");
            });
        } catch (err) {
            console.error(err)
        }
    }
}
