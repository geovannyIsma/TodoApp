#!/bin/bash

# Script for removing Docker Swarm and Docker Machine resources

echo "Starting cleanup process..."

# Step 1: Remove the stack if running
echo "Removing Docker stack..."
eval $(docker-machine env manager 2>/dev/null) || echo "Manager node not accessible, skipping stack removal"
docker stack rm todoapp 2>/dev/null || echo "No stack to remove or command failed"
echo "Waiting for services to be removed..."
sleep 10

# Step 2: Leave the swarm for each node
echo "Removing nodes from swarm..."
# First worker nodes
for worker in worker1 worker2; do
  echo "Processing $worker..."
  if docker-machine ls | grep -q "$worker"; then
    if docker-machine ssh $worker "docker info 2>/dev/null | grep -q 'Swarm: active'"; then
      echo "Leaving swarm on $worker..."
      docker-machine ssh $worker "docker swarm leave --force" || echo "Failed to leave swarm on $worker"
    else
      echo "$worker is not part of a swarm or is not running"
    fi
  else
    echo "$worker machine does not exist"
  fi
done

# Then manager node
echo "Processing manager..."
if docker-machine ls | grep -q "manager"; then
  if docker-machine ssh manager "docker info 2>/dev/null | grep -q 'Swarm: active'"; then
    echo "Leaving swarm on manager..."
    docker-machine ssh manager "docker swarm leave --force" || echo "Failed to leave swarm on manager1"
  else
    echo "manager is not part of a swarm or is not running"
  fi
else
  echo "manager machine does not exist"
fi

# Step 3: Stop and remove the Docker Machine VMs
echo "Removing Docker Machine instances..."
for machine in manager worker1 worker2; do
  echo "Stopping and removing $machine..."
  docker-machine stop $machine 2>/dev/null || echo "Could not stop $machine (might not exist)"
  docker-machine rm -f $machine 2>/dev/null || echo "Could not remove $machine (might not exist)"
done

# Step 4: Reset Docker environment variables
echo "Resetting Docker environment to local..."
eval $(docker-machine env --unset 2>/dev/null) || echo "Failed to unset Docker environment"

echo "Cleanup complete!"
echo "To verify all Docker Machines are gone, run: docker-machine ls"
