import { GluegunToolbox } from 'gluegun'
import * as path from 'path'
import { questionsContext } from '../modules/questions/questionsContext'

module.exports = {
  name: 'create:context',
  description: 'Create new custom component vtex.io inside react/components',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, prompt, template, print } = toolbox
    try {
      const {
        around,
        interfaceName,
        interfaces,
        name
      } = await questionsContext({ filesystem, prompt })

      if (name) {
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

        around.forEach(item => {
          interfaces[item].around =
            interfaces[item]?.around?.length > 0
              ? [...interfaces[item].around, interfaceName]
              : [interfaceName]
        })

        filesystem.write(path.join('store', 'interfaces.json'), interfaces)
      }
    } catch (error) {
      print.error(error.message)
    }
  }
}
