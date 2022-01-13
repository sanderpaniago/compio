# compio CLI

cli para o auxilo de criação de components custom para vtex.io

### Comandos

criando um component

```bash
yarn compio create:component
```

será feito algumas perguntas para a configuração do compoente como:

- nome do component
- nome da interface_id
- se o componente tera um schema para o site editor
- tipo da composição do componente
  _ blocks: caso deseja utilizar o `ExtensionPointer` para chamar outros componentes dentro do seu.
  _ children: caso deseja que o seu component receba filhos.
- em qual camada que seu componente sera renderizado: server, client ou lazy
- Caso selecione a opção de `blocks` ira aparecer uma lista dos componentes já resgistrados dentro do interfaces.json para que já possa informar quais componetes poderão ser chamados pelo `ExtensionPointer`
