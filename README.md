# rabbitmq

### run rabbitmq with docker
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

### access rabbitmq dashboard
http://localhost:15672/
user: guest
password: guest

### installation of dependencies
yarn install

### run script with the example of a direct exchange
yarn run exchange:direct
