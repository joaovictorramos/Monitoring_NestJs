## Rodar esta aplicação

### Software necessário

Você deve ter o Docker instalado.

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
docker exec -it monitoring_nestjs-db-1 psql -U root root
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