#!/bin/bash

# Switch to the manager node
echo "Switching to manager node..."
eval $(docker-machine env manager)

# Deploy the stack
echo "Deploying the TodoApp stack to the Swarm..."
docker stack deploy -c docker-stack.yml todoapp

docker stack services todoapp

echo "Stack deployed!"
echo "To access the app, use the IP: $(docker-machine ip manager)"
