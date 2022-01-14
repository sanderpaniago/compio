export type InterfaceComponent = {
  [interfaceName: string]: {
    component: string
    render?: 'server' | 'lazy' | 'client' | string
    composition?: 'blocks' | 'children' | string
    around?: string[]
    allowed?: string[]
  }
}
