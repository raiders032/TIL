

#### docker build

> Build an image from a Dockerfile

```
docker build [OPTIONS] PATH | URL | -
```



| Options     | Description                                           |
| ----------- | ----------------------------------------------------- |
| --tag , -t  | Name and optionally a tag in the ‘name:tag’ format    |
| --file , -f | Name of the Dockerfile (Default is ‘PATH/Dockerfile’) |



예시

```shell
docker build -t neptunes032/react-test-app -f ./frontend/Dockerfile.dev ./frontend

docker build -t neptunes032/docker-frontend ./frontend
```



___



#### docker commit

> Create a new image from a container’s changes

```
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

___



#### docker container ls

> List containers

```
docker container ls [OPTIONS]
```

___



#### docker container rm

> Remove one or more containers

```
docker container rm [OPTIONS] CONTAINER [CONTAINER...]
```

___



#### docker exec

> Run a command in a running container

```
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

___



#### docker images

> List images

```
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

___



#### docker image ls

> List images

```
docker image ls [OPTIONS] [REPOSITORY[:TAG]]
```

___



#### docker image rm

> Remove one or more images

```
docker image rm [OPTIONS] IMAGE [IMAGE...]
```



___



#### docker inspect

> Return low-level information on Docker objects

```
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

___



#### docker logs

> Fetch the logs of a container

```
docker logs [OPTIONS] CONTAINER
```

___



#### docker ps

> List containers

```
docker ps [OPTIONS]
```

| Options      | Description                                      |
| ------------ | ------------------------------------------------ |
| --all , -a   | Show all containers (default shows just running) |
| --quiet , -q | Only display numeric IDs                         |
|              |                                                  |

```
// 모든 컨테이너 삭제
docker rm `docker ps -a -q`
```



___



#### docker pull

>  Pull an image or a repository from a registry

```
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

___



#### docker push

> Push an image or a repository to a registry

```
docker push [OPTIONS] NAME[:TAG]
```

___



#### docker run

> Run a command in a new container

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```



| Options            | Description                                        |
| ------------------ | -------------------------------------------------- |
| --attach , -a      | Attach to STDIN, STDOUT or STDERR                  |
| --detach , -d      | Run container in background and print container ID |
| --env , -e         | Set environment variables                          |
| --interactive , -i | Keep STDIN open even if not attached               |
| --publish , -p     | Publish a container’s port(s) to the host          |
| --volume , -v      | Bind mount a volume                                |
|                    |                                                    |



예시

```shell
docker run -e CI=true neptunes032/react-test-app npm run test
```



##### Publish or expose port (-p, --expose)

> This binds port `8080` of the container to TCP port `80` on `127.0.0.1` of the host machine. You can also specify `udp` and `sctp` ports. The [Docker User Guide](https://docs.docker.com/network/links/) explains in detail how to manipulate ports in Docker.

```
docker run -p 127.0.0.1:80:8080/tcp ubuntu bash
```

___



#### docker start

> Start one or more stopped containers

```
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

___



#### docker stop

> Stop one or more running containers

```
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

___

