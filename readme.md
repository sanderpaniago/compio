# compio CLI

## 💻 Projeto

O Compio tem como finalidade facilitar a criação de novos component custom para o <a href="https://developers.vtex.com/vtex-developer-docs/docs/welcome" target="_blank">Vtex.io</a>

## 🔧 Instalação

<blockquote style="background: #ffff0011; margin-bottom: 1rem; padding: 1rem;"> ⚠️ Cuidado
a intalação deve ser efetuada na pasta principal do projeto e não dentro da pasta react! </blockquote>

```bash
  yarn add compio
```

A cli foi criada pra suportar a seguinte arquitetura de pastas

```
  ├── ...
  ├── react           # pasta builder React
  │   ├── components
  │   ├── context
  │   └── ...
  │
  ├── store           # pasta builder Store
  │   ├── ...
  │   └── interfaces.json
  │
  ├── manifest.json
  └── ...
```

## 📄 Comandos

### Criar um component

```bash
yarn compio create:component
```

será feito algumas perguntas para a configuração do componente como:

- nome do component
- nome da interface_id
- se o componente tera um schema para o site editor
- tipo da composição do componente
  - blocks: caso deseja utilizar o `ExtensionPoint` para chamar outros componentes. <a href="https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-slots" target="_blank">Veja mais sobre</a>
  - children: caso deseja que o seu component receba filhos.
- em qual camada seu componente sera renderizado: `server`, `client` ou `lazy`
- Caso selecione a opção de `blocks` ira aparecer uma lista dos componentes já resgistrados dentro do `interfaces.json` para que já possa informar quais componetes poderão ser chamados pelo `ExtensionPoint`

### Criar um context

```bash
yarn compio create:context
```

será feito algumas perguntas para a configuração do contex como:

- nome do context
- nome do interface_id do provider
- listagem dos componentes já registrados no arquivo `interfaces.json` para que possa selecionar os componentes em que o contexto ficara disponivel

## 📖 documentação utilizada durante o desenvolvimento

- <a href="https://github.com/vtex-apps/store/blob/40d1564d1ebafae9dd51a319f3db58f1b7fbfa66/BLOCKS.md" target="_blank">Estrutura dos arquivos interfaces, blocks e routes</a>

## 👨🏻‍💻 Author:

- **Sander Paniago** - [LinkedIn](https://www.linkedin.com/in/sander-paniago/) - [instagram](https://www.instagram.com/sander_paniago/)

## 🗝 licenças

Este projeto é licenciado sobre a licença MIT - [LICENSE.md](LICENSE.md) para mais informações.
