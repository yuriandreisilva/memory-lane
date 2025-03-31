Para inciiar o projeto, acesse a pasta raiz e rode os seguintes comandos de forma sequencial: 

```bash
npm install

chmod +x setup_db.sh

./setup.sh

npm run dev
```

Detalhe: Não vi necessidade de rodar com `npm run serve:api`.

Abra em [http://localhost:3000](http://localhost:3000) com seu navegador padrão.

No projeto foi usado apenas Next.js, até mesmo por desafio, pois nunca tinha atuado, apesar de não fugir muito do que já vi (node.js e react).

O projeto consiste em um CRUD, com uma API. Para inserção de memórias (título, descrição, data da memória e imagem). 

O Frontend com Tailwind, consiste em uma tela com scrol infinito das memórias, carregando de 10 em 10. Com opção de remover e editar as memórias.

Opção de order pela data da memória. E opção de compartilhar (não implementada ainda).

