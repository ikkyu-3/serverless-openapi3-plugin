import fs from "fs";
import path from "path";
import util from "util";
import { isObject, isArray } from "lodash";
import { safeLoad } from "js-yaml";
import { resolveRefs } from "json-refs";
import * as Serverless from "serverless";

interface Variables {
  populateService(cliOptions: any): Promise<void>;
}

const readFile = util.promisify(fs.readFile);

class ServerlessOpenapi3Plugin {
  public hooks: { [x: string]: () => void };

  private serverless: Serverless;
  private options: Serverless.Options;

  public constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "package:createDeploymentArtifacts": this.createDeployentArtifacts.bind(
        this
      ),
    };
  }

  private async createDeployentArtifacts(): Promise<void> {
    const service = (this.serverless.variables as { [x: string]: any }).service;
    const resources = service.resources;
    const openApiPath = path.resolve(
      this.serverless.config.servicePath,
      service.custom.openApiPath
    );

    process.chdir(path.dirname(openApiPath));

    try {
      const yamlFile = await readFile(openApiPath, { encoding: "utf8" });
      const files = safeLoad(yamlFile);
      if (typeof files !== "object") return;
      const openApi = await resolveRefs(files, {
        filter: ["relative", "remote"],
        loaderOptions: {
          processContent: (
            res: { [x: string]: any },
            callback: (arg0: any) => void
          ): void => {
            callback(safeLoad(res.text));
          },
        },
      }).then(
        (res: { [x: string]: any }): { [x: string]: any } => res.resolved
      );

      this.replaceOpenAPi(resources, openApi);
      await (this.serverless.variables as Variables).populateService(
        this.serverless.pluginManager.cliOptions
      );
    } catch (e) {
      console.error(e);
    }
  }

  private replaceOpenAPi(
    resources: { [x: string]: any },
    openApi: { [x: string]: any }
  ): void {
    for (const value of Object.values(resources)) {
      if (this.hasOpenApi(value)) {
        value.Body = openApi;
        return;
      }
    }

    Object.entries(resources).forEach(([key, value]): void => {
      if (isObject(value) && !isArray(value)) {
        this.replaceOpenAPi(resources[key], openApi);
      }
    });
  }

  private hasOpenApi(value: any): boolean {
    if (!isObject(value)) {
      return false;
    }

    if (!Object.prototype.hasOwnProperty.call(value, "Body")) {
      return false;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        (value as { [x: string]: any }).Body,
        "openapi"
      )
    ) {
      return false;
    }

    return true;
  }
}
export = ServerlessOpenapi3Plugin;
