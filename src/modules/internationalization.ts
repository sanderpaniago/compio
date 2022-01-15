import {
  GluegunFilesystem,
  GluegunPackageManager,
  GluegunPrint,
  GluegunPrompt
} from 'gluegun'
import { join } from 'path'

type createdConfigInternationalizationType = {
  componentName: string
  filesystem: GluegunFilesystem
  print: GluegunPrint
  prompt: GluegunPrompt
  packageManager: GluegunPackageManager
}

const choices = [
  { name: 'Brasil', value: 'br-pt' },
  { name: 'United Kingdom', value: 'gb-en' },
  { name: 'Italia', value: 'it-it' },
  { name: 'Colombia', value: 'co-es' },
  { name: 'Peru', value: 'pe-es' },
  { name: 'Česká republika', value: 'cz-cs' },
  { name: 'Singapore', value: 'sg-en' },
  { name: 'United States', value: 'us-en' },
  { name: 'Argentina', value: 'ar-es' },
  { name: 'España', value: 'es-es' },
  { name: 'Chile', value: 'cl-es' },
  { name: 'México', value: 'mx-es' },
  { name: 'România', value: 'ro' },
  { name: 'France', value: 'fr-fr' }
]

export async function createdConfigInternationalization({
  componentName,
  filesystem,
  print,
  prompt,
  packageManager
}: createdConfigInternationalizationType) {
  const manifestFile = await filesystem.readAsync('manifest.json')
  const manifest = await JSON.parse(manifestFile)
  const hasBuilderMessage = Object.keys(manifest.builders).includes('messages')
  const hasCurrentDependenciesInternationalization = Object.keys(
    manifest.dependencies
  ).includes('vtex.locale-switcher')

  if (!hasBuilderMessage) {
    print.warning(
      'Builder message not found! \nplease access documentation and configure builder: https://vtex.io/docs/getting-started/desenvolva-componentes-usando-vtex-io-e-react/7/'
    )
    return
  }

  if (!hasCurrentDependenciesInternationalization) {
    print.warning(
      'App vtex.locale-switche not found! Please access documentation and configure app location https://developers.vtex.com/vtex-developer-docs/docs/vtex-locale-switcher'
    )
  }

  await packageManager.add('react-intl', {
    dev: false,
    force: 'yarn',
    dir: 'react'
  })

  async function createVariableLanguage(fileName: string) {
    const languageFile = await filesystem.readAsync(join('messages', fileName))

    let languageJson = {}

    if (languageFile) {
      languageJson = await JSON.parse(languageFile)
    }

    languageJson[`store/${componentName}.exampleTitle`] = 'testing'
    languageJson[`admin/editor.${componentName}.exampleInput`] = 'testing'

    await filesystem.writeAsync(join('messages', fileName), languageJson)
  }

  const files = await filesystem.listAsync('messages')

  if (!files) {
    print.warning('\nNot even a file was found inside the messages folder\n')
    const { languageSelect }: { languageSelect: string[] } = await prompt.ask([
      {
        type: 'multiselect',
        name: 'languageSelect',
        message: 'Select languages:',
        choices
      }
    ])

    const languageValues = choices?.filter(item =>
      languageSelect.includes(item.name)
    )

    if (languageSelect) {
      const promisesLanguagesSelect = languageValues.map(item =>
        createVariableLanguage(`${item.value}.json`)
      )

      await Promise.all(promisesLanguagesSelect)
      return print.success('language files configuration success!')
    }
    await createVariableLanguage('pt.json')
    return
  }

  const promises = files.map(item => createVariableLanguage(item))

  await Promise.all(promises)
}
