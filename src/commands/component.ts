import { GluegunToolbox } from 'gluegun'
import { join } from 'path'
import { configInterfacesComponent } from '../modules/interfaces'
import { createdConfigInternationalization } from '../modules/internationalization'
import { questionsComponent } from '../modules/questions/questionsComponent'

module.exports = {
  name: 'create:component',
  description: 'Create new custom component vtex.io inside react/components',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, prompt, template, print, packageManager } = toolbox
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
        if (hasInternationalization) {
          await createdConfigInternationalization({
            componentName: name,
            filesystem,
            print,
            prompt,
            packageManager
          })
        }
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

        await configInterfacesComponent({
          componentName: name,
          composition,
          filesystem,
          interfaceName,
          interfaces,
          render,
          selectedAlloweds
        })
        print.success('Your component created with success')
      }
    } catch (error) {
      print.error(error.message)

      if (error.locale !== 'component') {
        const files = await filesystem.findAsync('react', {
          files: true,
          directories: true,
          matching: `*${error.componentName}*`
        })

        if (files) {
          await filesystem.removeAsync(
            join('react', `${error.componentName}.ts`)
          )
          await filesystem.removeAsync(
            join('react', 'components', `${error.componentName}`)
          )
        }
      }
    }
  }
}
