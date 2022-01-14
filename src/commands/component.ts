import { GluegunToolbox } from 'gluegun'
import { configInterfacesComponent } from '../modules/interfaces'
import { questionsComponent } from '../modules/questions/questionsComponent'

module.exports = {
  name: 'create:component',
  description: 'Create new custom component vtex.io inside react/components',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, prompt, template, print } = toolbox
    try {
      const {
        name,
        interfaces,
        interfaceName,
        composition,
        hasInternationalization,
        hasSchema,
        render,
        selectedAlloweds
      } = await questionsComponent({
        filesystem,
        prompt
      })

      if (name) {
        await template.generate({
          template: hasInternationalization
            ? 'componentInternationalization.tsx.ejs'
            : 'component.tsx.ejs',
          target: `react/components/${name}/index.tsx`,
          props: { name, hasSchema }
        })

        await template.generate({
          template: 'componentExport.ts.ejs',
          target: `react/${name}.ts`,
          props: { name }
        })

        configInterfacesComponent({
          componentName: name,
          composition,
          filesystem,
          interfaceName,
          interfaces,
          render,
          selectedAlloweds
        })
      }
    } catch (error) {
      print.error(error.message)
    }
  }
}
