<a href="https://github.com/horizoncd/actions"><img alt="actions status" src="https://github.com/horizoncd/actions/workflows/check-dist/badge.svg"></a>

This action will trigger the deployment on Horizon.

## Inputs

### `Token`

**Required** The token to use for authentication and authorization in horizon.

### `addr`

**Required** The address of the horizon instance to deploy to. In the form of `http://<ip>:<port>`.

### `deployMethod`

**Required** The method to use for deployment. Can be either `buildDeploy` or `imageDeploy`.

* `buildDeploy` will build the docker image and deploy it to the horizon instance.
* `imageDeploy` will deploy the versioned image specified in the `tag` input to the horizon instance.

### `title`

**Required** The title of the deployment.

### `description`

**Optional** The description of the deployment.

### `clusterID`

**Required** The ID of cluster whose deployment will be triggered.

### `tag`

**Optional** The tag of the image to deploy. Only used if `deployMethod` is set to `imageDeploy`.

### `gitRefType`

**Optional** The type of git ref to use for the deployment. Can be `branch`, `tag`, or `commit`.

### `ref`

**Optional** The git ref to use for the deployment. Only used if `gitRefType` is set to `branch` or `tag`.
