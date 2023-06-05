export interface DeployRequest {
  title: string
  description: string
  tag?: string
}

export interface HorizonResponse<T> {
  data: T
}

export interface DeployResponse {
  pipelinerunID: number
}

export enum GitRefType {
  Branch = 'branch',
  Tag = 'tag',
  Commit = 'commit'
}

export interface BuildDeployRequest {
  title: string
  description: string
  [key: string]: string
}

export type BuildDeployResponse = DeployResponse

export class HorizonBase {
  private token: string
  private baseUrl: URL

  constructor(baseUrl: string, token: string) {
    this.token = token
    this.baseUrl = new URL(baseUrl)
  }

  async request<Req, Resp>(
    link: string,
    {
      query = {},
      method = 'GET',
      body
    }: {
      query?: Record<string, string>
      method?: string
      body?: Req
    } = {}
  ): Promise<Resp> {
    const url = new URL(link, this.baseUrl)

    if (Object.keys(query).length > 0) {
      url.search = new URLSearchParams(query).toString()
    }

    let data: string | undefined
    if (body && typeof body === 'string') {
      data = body
    } else {
      data = body ? JSON.stringify(body) : undefined
    }

    const resp = await fetch(url, {
      method,
      body: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    })

    if (!resp.ok) {
      throw new Error(`${resp.status} ${resp.statusText}: ${await resp.text()}`)
    }
    const respData = await resp.json()
    if (respData && respData.data) {
      return respData.data
    }
    throw new Error(`${resp.status} ${resp.statusText}: ${await resp.text()}`)
  }

  async deploy(
    cluster_id: number,
    title: string,
    tag?: string,
    description?: string
  ): Promise<DeployResponse> {
    const body: DeployRequest = {
      title,
      description: description ?? '',
      tag
    }
    return this.request(`/apis/core/v2/clusters/${cluster_id}/deploy`, {
      method: 'POST',
      body
    })
  }

  async buildDeploy(
    cluster_id: number,
    gitRefType: GitRefType,
    ref: string,
    title: string,
    description?: string
  ): Promise<BuildDeployResponse> {
    const body: BuildDeployRequest = {
      title,
      description: description ?? '',
      [gitRefType]: ref
    }
    return this.request(`/apis/core/v2/clusters/${cluster_id}/builddeploy`, {
      method: 'POST',
      body
    })
  }
}
