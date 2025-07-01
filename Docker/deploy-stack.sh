#!/bin/bash
# Copiar docker-stack.yml al manager
echo "Copiando docker-stack.yml al nodo manager..."
docker-machine scp docker-stack.yml manager:~

# Cambiar al nodo manager
echo "Cambiando al nodo manager..."
eval $(docker-machine env manager)

# Desplegar el stack
echo "Desplegando el stack TodoApp en el Swarm..."
docker stack deploy -c docker-stack.yml todoapp

docker stack services todoapp

echo "¡Stack desplegado!"
echo "Para acceder a la aplicación, use la IP: $(docker-machine ip manager)"
