# Database for Employee Table

## Usage
Run the docker image (from inside the `database` directory)
```
docker swarm init
docker secret create db_root_password_secret db_root_password.secret

docker-compose -f docker-compose-windows.yaml up
docker-compose -f docker-compose-linux.yaml up
```