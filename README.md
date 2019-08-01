# serverless-openapi3-plugin

[![CircleCI](https://circleci.com/gh/ikkyu-3/serverless-openapi3-plugin/tree/master.svg?style=svg)](https://circleci.com/gh/ikkyu-3/serverless-openapi3-plugin/tree/master)
[![npm version](https://badge.fury.io/js/serverless-openapi3-plugin.svg)](https://badge.fury.io/js/serverless-openapi3-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Serverless plugin to resolve `$ref` syntax of OpenAPI3

## install

```sh
npm install --save serverless-openapi3-plugin
```

## usage

```yaml
plugins:
  - serverless-openapi3-plugin

custom:
  openApiPath: './resources/open-api/index.yaml' # OpenApi File
```

## When do you use it ?

When you want to use `$ref` syntax in OpenApi File, use this plugin.

### example project

The example project uses example API of Amazon API Gateway.

```sh
.
├── resources
│   ├── api-gateway.yaml # ApiGateway Resource
│   └── open-api
│       ├── index.yaml # OpenApi Entry File
│       ├── components
│       │   └── schemas.yaml
│       └── paths
│           ├── pets-id.yaml
│           ├── pets.yaml
│           └── root.yaml
└── serverless.yml
```

```yaml
# serverless.yaml
...
resources:
  - ${file(./resources/api-gateway.yaml)}
```

```yaml
# resources/api-gateway.yaml
Resources:
  RestApi:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: rest-api
      Body: ${file(./resources/open-api/index.yaml)} # OpenApi Entry File
```

```yaml
# resources/open-api/index.yaml
paths:
  /pets:
    $ref: './paths/pets.yaml'
  /pets/{petId}:
    $ref: './paths/pets-id.yaml'
  /:
    $ref: './paths/root.yaml'

components:
  schemas:
    $ref: './components/schemas.yaml'
```
