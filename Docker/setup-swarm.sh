#!/bin/bash

# Crear máquinas Docker - 1 manager y 2 workers
echo "Creando nodo manager de Docker Machine..."
docker-machine create --driver virtualbox --virtualbox-no-vtx-check manager

echo "Creando nodos worker de Docker Machine..."
docker-machine create --driver virtualbox --virtualbox-no-vtx-check worker1
docker-machine create --driver virtualbox --virtualbox-no-vtx-check worker2

# Inicializar Docker Swarm en el manager
echo "Inicializando Docker Swarm en el manager..."
eval $(docker-machine env manager)
MANAGER_IP=$(docker-machine ip manager)
docker swarm init --advertise-addr $MANAGER_IP

# Obtener token para los workers
JOIN_TOKEN=$(docker swarm join-token worker -q)

# Unir workers al Swarm
echo "Uniendo nodos worker al Swarm..."
eval $(docker-machine env worker1)
docker swarm join --token $JOIN_TOKEN $MANAGER_IP:2377

eval $(docker-machine env worker2)
docker swarm join --token $JOIN_TOKEN $MANAGER_IP:2377

# Volver al manager para verificar los nodos
echo "Verificando nodos del clúster Swarm..."
eval $(docker-machine env manager)
docker node ls

echo "¡Configuración del clúster Docker Swarm completada!"
echo "Para desplegar el stack, ejecute: docker stack deploy -c docker-stack.yml todoapp"
