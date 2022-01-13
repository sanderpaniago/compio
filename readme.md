# compio CLI

cli para o auxilo de criação de components custom para vtex.io

### Comandos

criar um component

```bash
yarn compio create:component
```

será feito algumas perguntas para a configuração do componente como:

- nome do component
- nome da interface_id
- se o componente tera um schema para o site editor
- tipo da composição do componente
  - blocks: caso deseja utilizar o `ExtensionPointer` para chamar outros componentes dentro do seu.
  - children: caso deseja que o seu component receba filhos.
- em qual camada que seu componente sera renderizado: server, client ou lazy
- Caso selecione a opção de `blocks` ira aparecer uma lista dos componentes já resgistrados dentro do interfaces.json para que já possa informar quais componetes poderão ser chamados pelo `ExtensionPointer`

criar um context

```bash
yarn compio create:context
```

será feito algumas perguntas para a configuração do contex como:

- nome do context
- nome do interface_id do provider
- listagem dos componentes já registrados no arquivo `interfaces.json` para que possa selecionar os componentes em que o contexto ficara disponivel
