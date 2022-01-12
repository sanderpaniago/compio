import { GluegunToolbox } from 'gluegun'
import * as path from 'path'

module.exports = {
  name: 'create:context',
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

    if (name) {
      const verifyHasComponent = await filesystem.existsAsync(
        path.join('react', `${name}Provider.ts`)
      )
      if (verifyHasComponent) {
        return print.error(
          `It's have component ${name} already exists, try again!`
        )
      }

      await template.generate({
        template: 'context.tsx.ejs',
        target: `react/context/${name}/index.tsx`,
        props: { name }
      })

      await template.generate({
        template: 'contextExport.ts.ejs',
        target: `react/${name}Provider.ts`,
        props: { name }
      })

      interfaces[interfaceName] = {
        component: `${name}Provider`
      }

      filesystem.write(path.join('store', 'interfaces.json'), interfaces)
    }
  }
}
