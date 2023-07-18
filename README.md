# rabbitmq

### run rabbitmq with docker

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

#### access rabbitmq dashboard

http://localhost:15672/

#### credencials

`user`: guest | `password`: guest

### project

#### installation of dependencies

```bash
yarn install
```

#### run script with the example of a direct exchange

```bash
yarn run handler:direct
```

#### run script with the example of a topic exchange

```bash
yarn run handler:topic
```

#### run script with the example of a fanout exchange

```bash
yarn run handler:fanout
```

#### run script with the example of a headers exchange

```bash
yarn run handler:headers
```
