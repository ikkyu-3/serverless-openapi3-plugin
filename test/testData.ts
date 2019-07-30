import Serverless from "serverless";

export const dummyServerless: any = {
  variables: {
    service: {
      resources: {
        Resources: {
          RestApi: {
            Type: "AWS::ApiGateway::RestApi",
            Properties: {
              Name: "rest-api",
              Body: {
                openapi: "3.0.1",
                info: {
                  title: "PetStore",
                  version: "2019-07-27T09:07:00Z"
                },
                servers: [
                  {
                    url:
                      "https://ifi2axc0wi.execute-api.ap-northeast-1.amazonaws.com/{basePath}",
                    variables: {
                      basePath: {
                        default: "/dev"
                      }
                    }
                  }
                ],
                paths: {
                  "/pets": {
                    $ref: "./paths/pets.yaml"
                  },
                  "/pets/{petId}": {
                    $ref: "./paths/pets-id.yaml"
                  },
                  "/": {
                    $ref: "./paths/root.yaml"
                  }
                },
                components: {
                  schemas: {
                    $ref: "./components/schemas.yaml"
                  }
                }
              }
            }
          },
          RestApiDeployment: {
            Type: "AWS::ApiGateway::Deployment",
            Properties: {
              RestApiId: {
                Ref: "RestApi"
              },
              StageName: "dev"
            },
            DependsOn: "RestApi"
          }
        }
      },
      custom: {
        openApiPath: "./open-api/index.yaml"
      }
    }
  },
  config: {
    servicePath: __dirname
  }
};

export const dummyConfig: Serverless.Options = {
  stage: null,
  region: null
};

export const openApi = {
  openapi: "3.0.1",
  info: {
    title: "PetStore",
    version: "2019-07-27T09:07:00Z"
  },
  servers: [
    {
      url:
        "https://ifi2axc0wi.execute-api.ap-northeast-1.amazonaws.com/{basePath}",
      variables: {
        basePath: {
          default: "/dev"
        }
      }
    }
  ],
  paths: {
    "/pets": {
      get: {
        parameters: [
          {
            name: "type",
            in: "query",
            schema: {
              type: "string"
            }
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pets"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          uri:
            "http://petstore.execute-api.ap-northeast-1.amazonaws.com/petstore/pets",
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          requestParameters: {
            "integration.request.querystring.page":
              "method.request.querystring.page",
            "integration.request.querystring.type":
              "method.request.querystring.type"
          },
          passthroughBehavior: "when_no_match",
          httpMethod: "GET",
          type: "http"
        }
      },
      post: {
        operationId: "CreatePet",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet"
              }
            }
          },
          required: true
        },
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewPetResponse"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          uri:
            "http://petstore.execute-api.ap-northeast-1.amazonaws.com/petstore/pets",
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          passthroughBehavior: "when_no_match",
          httpMethod: "POST",
          type: "http"
        }
      },
      options: {
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Methods": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Headers": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Empty"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Methods":
                  "'POST,GET,OPTIONS'",
                "method.response.header.Access-Control-Allow-Headers":
                  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          requestTemplates: {
            "application/json": '{"statusCode": 200}'
          },
          passthroughBehavior: "when_no_match",
          type: "mock"
        }
      }
    },
    "/pets/{petId}": {
      get: {
        operationId: "GetPet",
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          uri:
            "http://petstore.execute-api.ap-northeast-1.amazonaws.com/petstore/pets/{petId}",
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          requestParameters: {
            "integration.request.path.petId": "method.request.path.petId"
          },
          passthroughBehavior: "when_no_match",
          httpMethod: "GET",
          type: "http"
        }
      },
      options: {
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Methods": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Headers": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Empty"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Methods":
                  "'GET,OPTIONS'",
                "method.response.header.Access-Control-Allow-Headers":
                  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          requestTemplates: {
            "application/json": '{"statusCode": 200}'
          },
          passthroughBehavior: "when_no_match",
          type: "mock"
        }
      }
    },
    "/": {
      get: {
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Content-Type": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {}
          }
        },
        "x-amazon-apigateway-integration": {
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Content-Type": "'text/html'"
              },
              responseTemplates: {
                "text/html":
                  '<html>\n    <head>\n        <style>\n        body {\n            color: #333;\n            font-family: Sans-serif;\n            max-width: 800px;\n            margin: auto;\n        }\n        </style>\n    </head>\n    <body>\n        <h1>Welcome to your Pet Store API</h1>\n        <p>\n            You have successfully deployed your first API. You are seeing this HTML page because the <code>GET</code> method to the root resource of your API returns this content as a Mock integration.\n        </p>\n        <p>\n            The Pet Store API contains the <code>/pets</code> and <code>/pets/{petId}</code> resources. By making a <a href="/$context.stage/pets/" target="_blank"><code>GET</code> request</a> to <code>/pets</code> you can retrieve a list of Pets in your API. If you are looking for a specific pet, for example the pet with ID 1, you can make a <a href="/$context.stage/pets/1" target="_blank"><code>GET</code> request</a> to <code>/pets/1</code>.\n        </p>\n        <p>\n            You can use a REST client such as <a href="https://www.getpostman.com/" target="_blank">Postman</a> to test the <code>POST</code> methods in your API to create a new pet. Use the sample body below to send the <code>POST</code> request:\n        </p>\n        <pre>\n{\n    "type" : "cat",\n    "price" : 123.11\n}\n        </pre>\n    </body>\n</html>'
              }
            }
          },
          requestTemplates: {
            "application/json": '{"statusCode": 200}'
          },
          passthroughBehavior: "when_no_match",
          type: "mock"
        }
      }
    }
  },
  components: {
    schemas: {
      Pets: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Pet"
        }
      },
      Empty: {
        type: "object"
      },
      NewPetResponse: {
        type: "object",
        properties: {
          pet: {
            $ref: "#/components/schemas/Pet"
          },
          message: {
            type: "string"
          }
        }
      },
      Pet: {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          type: {
            type: "string"
          },
          price: {
            type: "number"
          }
        }
      },
      NewPet: {
        type: "object",
        properties: {
          type: {
            $ref: "#/components/schemas/PetType"
          },
          price: {
            type: "number"
          }
        }
      },
      PetType: {
        type: "string",
        enum: ["dog", "cat", "fish", "bird", "gecko"]
      }
    }
  }
};
