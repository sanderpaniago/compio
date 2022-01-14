import { GluegunFilesystem, GluegunPrint, GluegunTemplate } from 'gluegun'

type createdConfigInternationalizationType = {
  componentName: string
  filesystem: GluegunFilesystem
  template: GluegunTemplate
  print: GluegunPrint
}

export async function createdConfigInternationalization({
  componentName,
  filesystem,
  template,
  print
}: createdConfigInternationalizationType) {
  const hasMessageFolder = await filesystem.existsAsync('message')
  if (hasMessageFolder) {
  }
}
