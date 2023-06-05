import * as core from '@actions/core'
import {HorizonBase, GitRefType} from './horizon/src/horizon'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const addr: string = core.getInput('addr')
    const type: string = core.getInput('deployMethod')
    const title: string = core.getInput('title')
    const clusterID: number = parseInt(core.getInput('clusterID'))
    const description: string = core.getInput('description')

    const horizonBaseClient = new HorizonBase(addr, token)

    if (type === 'imageDeploy') {
      const tag: string = core.getInput('tag')
      horizonBaseClient.deploy(clusterID, title, tag, description)
    } else if (type === 'buildDeploy') {
      const gitRefType: string = core.getInput('gitRefType')
      if (!Object.values(GitRefType).includes(gitRefType as GitRefType)) {
        throw new Error(
          `gitRefType must be one of ${Object.values(GitRefType)}`
        )
      }

      const ref: string = core.getInput('ref')
      await horizonBaseClient.buildDeploy(
        clusterID,
        gitRefType as GitRefType,
        ref,
        title,
        description
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
