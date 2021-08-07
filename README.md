![Badge](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Badge](https://img.shields.io/badge/next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Badge](https://img.shields.io/badge/NestJS-e0234e?style=flat&logo=nestjs&logoColor=white)
![Badge](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Badge](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)
![Badge](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white)
![Badge](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white)
![Badge](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)
![Badge](https://img.shields.io/badge/styled--components-DB7093?style=flat&logo=styled-components&logoColor=white)
![Badge](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

# Site de anúncios

Um site que permite que as pessoas postem anúncios na internet.

<p>
<br/>
<br/>
<img src="images/1.png">
<br/>
<br/>
<img src="images/2.png">
<br/>
<br/>
<img src="images/3.png">
<br/>
<br/>
</p>


## Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/install/).

## Como Usar

```bash
# Clone este repositório
$ git clone <https://github.com/hudsonfranca/AnunciosApp.git>

# Acesse a pasta do projeto no terminal/cmd
$ cd AnunciosApp

# Execute a aplicação em modo de desenvolvimento
$ docker-compose up  

# Para criar anúncios você precisa cadastrar uma categoria no banco de dados
$ curl -d '{"name":"eletronicos"}' -H "Content-Type: application/json" -X POST http://localhost:4000/category

# A aplicação inciará na porta:3000 - acesse <http://localhost:3000>

# Desative o Adblock porque ele pode causar alguma interferência na aplicação.
```

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Typescript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [Nestjs](https://nestjs.com/)
- [Nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Postgresql](https://www.postgresql.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Yarn](https://yarnpkg.com/)
- [styled-components](https://styled-components.com/)





