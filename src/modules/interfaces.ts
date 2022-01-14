import { GluegunFilesystem } from 'gluegun'
import { join } from 'path'
import { InterfaceComponent } from '../types'

type ConfigInterfacesType = {
  componentName: string
  interfaces: InterfaceComponent
  interfaceName: string
  filesystem: GluegunFilesystem
  composition: 'blocks' | 'children' | string
  render: 'server' | 'lazy' | 'client' | string
  selectedAlloweds: string[]
}

export async function configInterfacesComponent({
  filesystem,
  interfaces,
  componentName,
  interfaceName,
  composition,
  render,
  selectedAlloweds
}: ConfigInterfacesType) {
  interfaces[interfaceName] = {
    component: componentName
  }

  if (composition) interfaces[interfaceName].composition = composition

  if (render) {
    interfaces[interfaceName].render = render
  }

  if (selectedAlloweds?.length > 0) {
    interfaces[interfaceName].allowed = selectedAlloweds
  }

  filesystem.write(join('store', 'interfaces.json'), interfaces)
}
