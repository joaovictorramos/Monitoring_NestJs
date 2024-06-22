## Rodar esta aplicação

### Software necessário

Você deve ter o Docker instalado.

### Configurando o banco

Antes de executar o projeto, é necessário que possua um container no docker de um banco de dados Postgres com o nome **monitoring**.
```
CREATE DATABASE monitoring;
```

Crie as tabelas no banco através deste [schema.sql](schema.sql).

Popule as tabelas **classroom**, **days_of_the_week** e **matter** para conseguir utilizar os métodos de cadastrar e atualizar monitores.

**classroom**
```
INSERT INTO classroom
(id, name, block, type)
VALUES
(UUID_GENERATED_V4(), 'G104', 'G', 'SALA');
```

**days_of_the_week**
```
INSERT INTO days_of_the_week
(id, days_week)
VALUES
(UUID_GENERATED_V4, 'DOMINGO'),
(UUID_GENERATED_V4, 'SEGUNDA-FEIRA'),
(UUID_GENERATED_V4, 'TERÇA-FEIRA'),
(UUID_GENERATED_V4, 'QUARTA-FEIRA'),
(UUID_GENERATED_V4, 'QUINTA-FEIRA'),
(UUID_GENERATED_V4, 'SEXTA-FEIRA'),
(UUID_GENERATED_V4, 'DOMINGO');
```

**matter**
```
INSERT INTO matter
(id, name, teacher, type, period, start_hour, end_hour, days_of_the_week_id)
VALUES
(UUID_GENERATED_V4, 'Programação Web', 'Diego', 'OBRIGATÓRIA', 7, '18:00:00', '21:40:00', '[id gerado em days_of_the_week]');
```

### Gerando as imagens

Crie a imagem do backend do programa inserindo o código:
```
docker build -t "backend:1.0" .
```

### Integração com Front

Realize a integração com o front-end para acessar as telas do programa: [Front-end](https://github.com/joaovictorramos/Monitoring_ReactJs)

### Rodando

Execute o arquivo docker-compose:
```
docker-compose up
```

### Acessando o banco

Acesse o banco de dados:
```
docker exec -it monitoring_nestjs-db-1 psql -U root
```

### Acessando a interface

Acesse a interface do programa:
```
http://localhost:82
```

### Acessando o Redis

Acesse o Redis:
```
http://localhost:8001
```

### Acessando o Swagger

Acesse o Swagger:
```
http://localhost:3000
```