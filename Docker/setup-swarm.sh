#!/bin/bash

# Create Docker machines - 1 manager and 2 workers
echo "Creating Docker Machine manager node..."
docker-machine create --driver virtualbox --virtualbox-no-vtx-check manager

echo "Creating Docker Machine worker nodes..."
docker-machine create --driver virtualbox --virtualbox-no-vtx-check worker1
docker-machine create --driver virtualbox --virtualbox-no-vtx-check worker2

# Initialize Docker Swarm on manager
echo "Initializing Docker Swarm on manager..."
eval $(docker-machine env manager)
MANAGER_IP=$(docker-machine ip manager)
docker swarm init --advertise-addr $MANAGER_IP

# Get join token for workers
JOIN_TOKEN=$(docker swarm join-token worker -q)

# Join workers to the Swarm
echo "Joining worker nodes to the Swarm..."
eval $(docker-machine env worker1)
docker swarm join --token $JOIN_TOKEN $MANAGER_IP:2377

eval $(docker-machine env worker2)
docker swarm join --token $JOIN_TOKEN $MANAGER_IP:2377

# Switch back to manager to verify the nodes
echo "Verifying Swarm cluster nodes..."
eval $(docker-machine env manager)
docker node ls

echo "Docker Swarm cluster setup complete!"
echo "To deploy the stack, run: docker stack deploy -c docker-stack.yml todoapp"
