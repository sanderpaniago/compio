import { GluegunToolbox } from 'gluegun'
import * as path from 'path'

module.exports = {
  name: 'create:component',
  description: 'Create new custom component vtex.io inside react/components',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, prompt, template, print } = toolbox

    const askComponentName = {
      type: 'input',
      name: 'name',
      message: 'Whats name your component?'
    }

    const askComponentInterfaceName = {
      type: 'input',
      name: 'interfaceName',
      message: 'Whats name your component interface?'
    }

    const { name, interfaceName } = await prompt.ask([
      askComponentName,
      askComponentInterfaceName
    ])

    if (!interfaceName) {
      return print.error('Not found interface name!, try again!')
    }

    const interfacesFile = await filesystem.readAsync(
      path.join('store', 'interfaces.json')
    )

    let interfaces = {}

    if (interfacesFile) {
      interfaces = JSON.parse(interfacesFile)
    }

    if (interfaces[interfaceName]) {
      return print.error(
        `It's have interface name ${interfaceName}, try again!`
      )
    }

    const hasSchema = await prompt.confirm('Your component have schema?')

    const askComponentInterFaceComposition = {
      type: 'select',
      name: 'composition',
      message: 'Select composition type:',
      choices: ['blocks', 'children']
    }

    const askComponentInterfaceRender = {
      type: 'select',
      name: 'render',
      message: 'Your component render in?',
      choices: ['server', 'client', 'lazy']
    }

    const { composition, render } = await prompt.ask([
      askComponentInterFaceComposition,
      askComponentInterfaceRender
    ])

    let selectedAlloweds: string[]

    if (composition === 'blocks' && Object.keys(interfaces).length > 0) {
      const { alloweds }: { alloweds: string[] } = await prompt.ask([
        {
          type: 'multiselect',
          name: 'alloweds',
          message: 'Select your blocks dependencies component',
          choices: Object.keys(interfaces).map(item => ({
            name: item,
            value: item
          }))
        }
      ])

      selectedAlloweds = alloweds
    }

    if (name) {
      const verifyHasComponent = await filesystem.existsAsync(
        path.join('react', `${name}.ts`)
      )
      if (verifyHasComponent) {
        return print.error(
          `It's have component ${name} already exists, try again!`
        )
      }

      await template.generate({
        template: 'component.tsx.ejs',
        target: `react/components/${name}/index.tsx`,
        props: { name, hasSchema }
      })

      await template.generate({
        template: 'componentExport.ts.ejs',
        target: `react/${name}.ts`,
        props: { name }
      })

      interfaces[interfaceName] = {
        component: name
      }

      if (composition) interfaces[interfaceName].composition = composition

      if (render) {
        interfaces[interfaceName].render = render
      }

      if (selectedAlloweds?.length > 0) {
        interfaces[interfaceName].allowed = selectedAlloweds
      }

      filesystem.write(path.join('store', 'interfaces.json'), interfaces)
    }
  }
}
