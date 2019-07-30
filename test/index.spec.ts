import ServerlessOpenapi3Plugin from "../src/index";
import { dummyServerless, dummyConfig, openApi } from "./testData";

describe("ServerlessOpenapi3Plugin Test", () => {
  const plugin = new ServerlessOpenapi3Plugin(dummyServerless, dummyConfig);

  it("should replace OpenApi Object of RestApi Resource with resolved OpenApi Object", async () => {
    const func = plugin.hooks["package:createDeploymentArtifacts"];
    await func();

    expect(
      dummyServerless.variables.service.resources.Resources.RestApi.Properties
        .Body
    ).toEqual(openApi);
  });
});
