import Serverless from "serverless";
import ServerlessOpenapi3Plugin from "../src/index";
import { service, options, openApi } from "./testData";

describe("ServerlessOpenapi3Plugin Test", () => {
  it("should replace OpenApi Object of RestApi Resource with resolved OpenApi Object", async () => {
    const serverless = new Serverless();
    serverless.config.servicePath = __dirname;
    Object.assign((serverless.variables as any).service, service);

    const plugin = new ServerlessOpenapi3Plugin(serverless, options);

    const func = plugin.hooks["package:createDeploymentArtifacts"];
    await func();

    expect(
      (serverless.variables as any).service.resources.Resources.RestApi
        .Properties.Body
    ).toEqual(openApi);
  });
});
