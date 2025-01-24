# Flag projeto backend clínica

Este é um projeto que foi realizado durante o curso da FLAG de fullstack web development na parte do backend.
Este projeto consiste na criação de uma base de dados e uma API que simulam as funcionalidades básicas que permitem a gestão de uma clínica médica. Além de possuir o backend, este projeto inclui também uma aplicação básica de frontend onde o cliente consome os dados da API e pode fazer a gestão dos dados através de uma aplicação web.

--- 
- [Tecnologias utilizadas](#tecnologias-utilizadas) 
- - [Backend](#backend) 
- - [Frontend](#frontend) 
- [Instalação e configuração](#instalação-e-configuração)
- [Configuração do Backend](#configuração-do-backend) 
- [Criação da base de dados](#criação-da-base-de-dados) 
- [Criação do user ADMIN](#criação-do-user-admin) 
- [Execução do servidor](#executar-o-servidor) 
- [Utilização da API](#utilização-da-api) 
- [Autenticação](#autenticação) 
- [Endpoints](#endpoints) 
- [Criação de um médico e paciente](#criação-de-um-médico-e-paciente) 
- [Schemas dos restantes endpoints](#schemas-dos-restantes-endpoints)
- [Testes unitários](#testes-unitários) 
- [Instalação do frontend](#instalação-do-frontend)


## Tecnologias utilizadas

Para a realização deste projeto foram utilizadas as seguintes tecnologias:

### Backend:
- nodeJS / Fastify
- mySQL
- Typescript
- Prisma
- Postman (Extensão do vscode)
- Bcrypt
- Zod
- Dayjs
- Vitest

### Frontend:
- React
- Typescript
- CSS (SASS)
- Axios
- React icons
- React Hook Form
- React Router Dom

## Instalação e configuração

Para começar, a estrutura inical do projeto deve ser esta:
```
└── 📁 clinica-client
└── 📁 clinica-server
└── README.md
```

Vamos proceder primeiramente à configuração do **Backend**.

 1. Abrir um novo terminal e inserir `cd clinica-server` ou o comando correspondente do sistema operativo utilizado para mudar de pasta.
 
 2. Estando dentro da pasta **clinica-server**, executar o comando `npm install` para instalar os node modules.
 
 3. #### Configuração do .env
	 No arquivo `.env.example` estão presentes as variaveis globais usadas no backend.
```
PORT=3333
DATABASE_URL="mysql://user:password@localhost:3306/databasename"
JWT_SECRET="supersecretkey"
ADMIN_EMAIL="email-admin"
ADMIN_PASSWORD="pasword-admin"
```

No campo `DATABASE_URL`,  deve alterar os seguintes campos:
`user` - O seu user do mysql.
`password` - A sua password do mysql
`databasename` - O nome da base de dados pode ser escolhido pelo utilizador, ex: *clinica-backend

`ADMIN_EMAIL` - O email do utlizador que posteriormente irá ser criado com a role de **ADMIN**. Ex: *admin@clinica.com .
`ADMIN_PASSWORD` - A password do admin para se logar com a role de **ADMIN**.

- Depois de definir as suas variaveis deve alterar o nome do ficheiro de `.env.example` para `.env` , ou se preferir, criar um novo ficheiro `.env` e colar as suas variaveis de ambiente para o novo ficheiro.

4. #### Criação da base de dados
	Após definir as suas variaveis de ambiente, deve executar o comando `npx prisma migrate dev` para criar as migrações necessárias e aplica-las à base de dados. Verifique sempre se o path do terminal está no local correto, `clinica-server` !

5. #### Criação do user ADMIN
	Após isto, antes de executar o projeto, devemos criar um user com a role de ADMIN para poder ter acesso a features extra. Para isso, deve correr o comando `npx prisma db seed` para criar um ADMIN que utiliza o valor das variaveis inseridas no ficheiro `.env`.

6. #### Executar o servidor
	No final, basta apenas correr o servidor com o comando `npm run dev`, e se tudo der certo, deverá ver a seguinte mensagem no seu terminal:
	
	`Server running on PORT: 3333`

	O `PORT: 3333` foi o PORT que foi definido no `.env`


## Utilização da API

Agora com o server a ser executado, temos acesso às seguintes funcionalidades:

 - `Consultas` - Permite criar, editar, apagar e procurar consultas
 - `Medicos` - Permite criar , editar, apagar, e procurar médicos
 - `Pacientes` - Permite criar , editar, apagar, e procurar pacientes
 - `Especialidades` - Permite criar , editar, apagar, e procurar especialidades
 - `Fármacos` - Permite criar , editar, apagar, e procurar fármacos
 - `Receitas` - Permite criar, procurar e apagar receitas de consultas
 - `medico-especialidades` - Permite criar, apagar, e procurar associações entre médicos e especialidades
 - `Users` - Permite fazer registo e login de usuários
 
 Porém, para aceder a estas rotas, o user tem de estar autenticado pois os endpoints estão protegidos com o `@fastify-jwt`.

### Autenticação
Para o user poder se autenticar ele tem de se registar na clinica, para isso o user tem que fazer um pedido **HTTP** ao servidor. Para fazer pedidos pode ser usado a extensão do `Postman` no VScode, ou qualquer outro serviço semelhante.

Para realizar um pedido através do postman e fazer o registo de um user, deve fazer o seguinte:

 1. Mudar o pedido HTTP para `POST`
 2. Mudar o URL do pedido para `http://localhost:3333/register` (mude o port conforme aquilo que foi definido no `.env`)
 3. No body do pedido envie um pedido `raw` em `json` com esta sintaxe:
 ![Registo de um user](https://kappa.lol/R4z3l)

4. Envie o pedido e deverá receber uma resposta com o status `201 Created`

**Vale lembrar que ao fazer um registo através deste pedido estamos a criar um user com a role de `UTENTE`.**

Agora, com o user criado, para fazer login é preciso:

 1. Manter o pedido HTTP em `POST`
 2. Mudar o URL do pedido para `http://localhost:3333/login`
 3. No body do pedido envie um pedido `raw` em `json` com esta sintaxe
![login de um user](https://kappa.lol/w0t97)

4. Envie o pedido e deverá receber uma resposta com o status `200 OK` com o `token` no body da resposta:

![token na resposta](https://kappa.lol/7e_QS)

É com este token que acedemos às rotas da aplicação, por isso é preferivel copiar o token para um lugar seguro para o poder acessar ao fazer os pedidos HTPP.

## Endpoints

Após fazer o login e obter o token de autenticação, tem agora acesso a vários endpoints. Vale destacar que algumas rotas só estão disponiveis a users com uma role específica. As roles que esta aplicação possui são `[ADMIN], [MEDICO], [UTENTE]`, conforme a role do user logado poderá, ou não, aceder a um endpoint específico. Abaixo estão todos os endpoints específicos da API:

#### User:
```
/register - POST
/login - POST
```

#### Medicos:
```
/medicos - GET [ADMIN, MEDICO, UTENTE]
/medicos/:id - GET [ADMIN]
/medicos - POST [ADMIN]
/medicos/:id - PUT [ADMIN]
/medicos/:id - DELETE [ADMIN]
```

#### Pacientes:
```
/pacientes - GET [ADMIN, MEDICO, UTENTE]
/pacientes/:id - GET [MEDICO]
/pacientes - POST [ADMIN]
/pacientes/:id - PUT [ADMIN]
/pacientes/:id - DELETE [ADMIN]
```

#### Especialidades:
```
/especialidades - GET [ADMIN, MEDICO]
/especialidades/:id - GET [ADMIN, MEDICO]
/especialidades - POST [ADMIN]
/especialidades/:id - PUT [ADMIN]
/especialidades/:id - DELETE [ADMIN]
```

#### Fármacos:
```
/farmacos - GET [ADMIN, MEDICO]
/farmacos/:id - GET [ADMIN, MEDICO]
/farmacos - POST [ADMIN]
/farmacos/:id - PUT [ADMIN]
/farmacos/:id - DELETE [ADMIN]
```

#### Receitas:
```
/receitas/:id_consulta_medico/:id_consulta - GET [MEDICO]
/receitas - POST [MEDICO]
/receitas/:id_consulta_medico/:id_consulta/:id_farmaco - DELETE [ADMIN, MEDICO]
```

#### Medicos-Especialidades:
```
/medicos-especialidades/:id_medico - GET [ADMIN, MEDICO, UTENTE]
/medicos-especialidades - POST [ADMIN]
/medicos-especialidades/:id_medico/:id_especialidade - DELETE [ADMIN]
```

#### Consultas:
```
/consultas - GET [ADMIN, MEDICO, UTENTE]
/consultas - POST [ADMIN, UTENTE]
/consultas/:id_medico/:id_consulta - PUT [ADMIN, MEDICO]
/consultas/:id_medico/:id_consulta - DELETE [ADMIN]
```

## Criação de um médico e paciente

Durante a criação dos médicos e pacientes, são criados também `Users` com as respetivas roles, ou seja, como o endpoint para criar um médico requer que seja um `ADMIN` (`/medicos - POST [ADMIN]`) a fazer o pedido, apenas estes têm a possibilidade de criar médicos. Com os pacientes, o próprio utilizador já se auto regista como `UTENTE` ao fazer o registo, dando assim também a opção do `ADMIN` poder criar users com a role `UTENTE` no endpoint `/pacientes - POST`.

Sendo assim, para criar um médico, é necessário fazer o seguinte pedido:

- Pedido **POST** para o URL `http://localhost:3333/medicos` 
- Enviar no body do pedido um `json` com a seguinte sintaxe:
![criação de um médico](https://kappa.lol/wQGAc)

- Incluir no `Authorization` do pedido um `Bearer Token`e inserir o `token` que foi retornado durante o login anteriormente, vale lembrar que apenas users com a role `ADMIN` têm acesso a este endpoint, por isso qualquer outro user que tentar criar um médico não irá conseguir.
![Inclusão do token](https://kappa.lol/adZPj)

- Envie o pedido e deverá receber uma resposta com o status `201 Created` e o médico juntamente com o user será criado com a role de `MEDICO`.

A criação do paciente é relativamente igual à criação de um médico.
**Vale relembrar que agora para fazer pedidos a qualquer endpoint da API tem de se incluir o `Bearer Token` gerado durante o login no `Authorization` do pedido!**

## Schemas dos restantes endpoints
Todos os schemas que possuem aquilo que é obrigatório incluir no `body` do pedido dos restantes endpoints, estão incluidos na pasta `schemas`:
```
└── 📁 clinica-server
	└── 📁 src
		└── 📁 schemas
			└── consultas.schema.ts
			└── especialidades.schema.ts
			└── farmacos.schema.ts
			└── medicoEspecialidades.schema.ts
			└── medicos.schema.ts
			└── pacientes.schema.ts
			└── receitas.schema.ts
			└── users.schema.ts
```
Estes schemas do `zod` são utilizados para fazer algumas verificações no código mas podem ser utilizados para saber que campos devem ser passados no `body` do pedido. Por exemplo, no `medicos.schema.ts` temos o seguinte schema:

```
export  const  createMedicoSchema  =  z.object({

nome:  z.string().min(1),
contacto:  z.string().min(9).optional(),
morada:  z.string().optional(),
email:  z.string().email(),
password:  z.string().min(6),
});

export  const  updateMedicoSchema  =  z.object({

nome:  z.string().min(1).optional(),
contacto:  z.string().min(9).optional(),
morada:  z.string().optional(),
});
```
Como é possivel ver, os campos `contacto` e `morada` não são obrigatórios para o envio do pedido http.

## Testes unitários
A aplicação backend possui ainda testes unitários com o `vitest`, para correr os testes é preciso:

 1. Abrir um novo terminal na linha de comandos e executar o comando `cd clinica-server` ou o comando correspondente do sistema operativo utilizado para mudar de pasta. 
 2. Executar o comando `npm run test` e os testes serão executados.
 
 ![Testes do backend](https://kappa.lol/X1FQw)

## Instalação do frontend

Com o backend da aplicação a funcionar podemos prosseguir à instalação da aplicação cliente da web. Para isso deve seguir os seguintes passos:

 1. Abrir um novo terminal na linha de comandos e executar o comando `cd clinica-client` ou o comando correspondente do sistema operativo utilizado para mudar de pasta.
 2. Executar o comando `npm install` para instalar os node modules da aplicação frontend.
 3. Com os node modules instalados executar o comando `npm run dev`.

A aplicação será corrida no `PORT: 5173`
