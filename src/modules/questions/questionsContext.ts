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
  around?: string[] | undefined
  interfaces?: InterfaceComponent | undefined
}

type QuestionContextFunction = ({
  filesystem,
  prompt
}: QuestionsProps) => Promise<ResponseQuestion>

export const questionsContext: QuestionContextFunction = async ({
  filesystem,
  prompt
}) => {
  const askComponentName = {
    type: 'input',
    name: 'name',
    message: 'Whats name your context?'
  }

  const askComponentInterfaceName = {
    type: 'input',
    name: 'interfaceName',
    message: 'Whats name your provider interface?'
  }

  const { name, interfaceName } = await prompt.ask([
    askComponentName,
    askComponentInterfaceName
  ])

  if (!name) {
    throw {
      message: 'Please, enter the name of your context'
    }
  }

  if (!interfaceName) {
    throw {
      message: 'Please, enter the name of your interface-provider'
    }
  }

  const verifyHasComponent = await filesystem.existsAsync(
    join('react', `${name}Provider.ts`)
  )
  if (verifyHasComponent) {
    throw {
      message: `It's have component ${name} already exists, try again!`
    }
  }

  const interfacesFile = await filesystem.readAsync(
    join('store', 'interfaces.json')
  )

  let interfaces = {}

  if (interfacesFile) {
    interfaces = JSON.parse(interfacesFile)
  }

  const { around }: { around: string[] } = await prompt.ask([
    {
      type: 'multiselect',
      name: 'around',
      message: 'Select your interface dependencies context',
      choices: Object.keys(interfaces).map(item => ({
        name: item,
        value: item
      }))
    }
  ])

  if (interfaces[interfaceName]) {
    throw {
      message: `It's have interface name ${interfaceName}, try again!`
    }
  }

  return {
    name,
    interfaceName,
    interfaces,
    around
  }
}
