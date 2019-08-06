"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const lodash_1 = require("lodash");
const js_yaml_1 = require("js-yaml");
const json_refs_1 = require("json-refs");
const readFile = util_1.default.promisify(fs_1.default.readFile);
class ServerlessOpenapi3Plugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.hooks = {
            "package:createDeploymentArtifacts": this.createDeployentArtifacts.bind(this)
        };
    }
    async createDeployentArtifacts() {
        const service = this.serverless.variables.service;
        const resources = service.resources;
        const openApiPath = path_1.default.resolve(this.serverless.config.servicePath, service.custom.openApiPath);
        process.chdir(path_1.default.dirname(openApiPath));
        try {
            const yamlFile = await readFile(openApiPath, { encoding: "utf8" });
            const openApi = await json_refs_1.resolveRefs(js_yaml_1.safeLoad(yamlFile), {
                filter: ["relative", "remote"],
                loaderOptions: {
                    processContent: (res, callback) => {
                        callback(js_yaml_1.safeLoad(res.text));
                    }
                }
            }).then((res) => res.resolved);
            this.replaceOpenAPi(resources, openApi);
            await this.serverless.variables.populateService(this.serverless.pluginManager.cliOptions);
        }
        catch (e) {
            console.error(e);
        }
    }
    replaceOpenAPi(resources, openApi) {
        for (let value of Object.values(resources)) {
            if (this.hasOpenApi(value)) {
                value.Body = openApi;
                return;
            }
        }
        Object.entries(resources).forEach(([key, value]) => {
            if (lodash_1.isObject(value) && !lodash_1.isArray(value)) {
                this.replaceOpenAPi(resources[key], openApi);
            }
        });
    }
    hasOpenApi(value) {
        if (!lodash_1.isObject(value)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(value, "Body")) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(value.Body, "openapi")) {
            return false;
        }
        return true;
    }
}
module.exports = ServerlessOpenapi3Plugin;
