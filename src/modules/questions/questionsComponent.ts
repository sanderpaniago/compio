import { GluegunFilesystem, GluegunPrompt } from 'gluegun'
import { join } from 'path'
import { InterfaceComponent } from '../../types'

type QuestionsProps = {
  filesystem: GluegunFilesystem
  prompt: GluegunPrompt
}

type ResponseQuestion = {
  name?: string | undefined
  interfaceName?: string | undefined
  hasSchema?: boolean | undefined
  hasInternationalization?: boolean | undefined
  composition?: 'blocks' | 'children' | string | undefined
  render?: 'server' | 'lazy' | 'client' | string | undefined
  selectedAlloweds?: string[] | undefined
  interfaces?: InterfaceComponent | undefined
}

type QuestionComponentFunction = ({
  filesystem,
  prompt
}: QuestionsProps) => Promise<ResponseQuestion>

export const questionsComponent: QuestionComponentFunction = async ({
  filesystem,
  prompt
}) => {
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

  if (!name) {
    throw {
      message: 'Please, enter the name of your component'
    }
  }

  if (!interfaceName) {
    throw {
      message: 'Please, enter the name of your interface-component'
    }
  }

  const verifyHasComponent = await filesystem.existsAsync(
    join('react', `${name}.ts`)
  )

  if (verifyHasComponent) {
    throw {
      message: `It's have component ${name} already exists, try again!`
    }
  }

  if (!interfaceName) {
    throw {
      message: 'Not found interface name!, try again!'
    }
  }

  const interfacesFile = await filesystem.readAsync(
    join('store', 'interfaces.json')
  )

  let interfaces = {}

  if (interfacesFile) {
    interfaces = JSON.parse(interfacesFile)
  }

  if (interfaces[interfaceName]) {
    throw {
      message: `It's have interface name ${interfaceName}, try again!`
    }
  }

  const hasSchema = await prompt.confirm('Your component have schema?')

  const hasInternationalization = await prompt.confirm(
    'Your component have internationalization?'
  )

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

  return {
    name,
    interfaces,
    interfaceName,
    hasSchema,
    hasInternationalization,
    composition,
    render,
    selectedAlloweds
  }
}
