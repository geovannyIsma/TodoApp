# PowerShell script to clean up Docker Swarm and Docker Machine resources on Windows

Write-Host "Starting cleanup process..." -ForegroundColor Green

# Step 1: Remove the stack if running
Write-Host "Removing Docker stack..." -ForegroundColor Cyan
try {
    & docker-machine env manager1 | Invoke-Expression
    & docker stack rm todoapp
    Write-Host "Waiting for services to be removed..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10
} 
catch {
    Write-Host "Manager node not accessible or stack removal failed" -ForegroundColor Yellow
}

# Step 2: Leave the swarm for each worker node
Write-Host "Removing nodes from swarm..." -ForegroundColor Cyan
$machines = @("worker1", "worker2", "manager1")

foreach ($machine in $machines) {
    Write-Host "Processing $machine..." -ForegroundColor Cyan
    
    # Check if machine exists
    $machineExists = & docker-machine ls | Select-String -Pattern $machine
    
    if ($machineExists) {
        try {
            # Check if machine is in swarm
            $swarmActive = & docker-machine ssh $machine "docker info 2>/dev/null | grep -q 'Swarm: active' && echo 'true' || echo 'false'"
            
            if ($swarmActive -eq "true") {
                Write-Host "Leaving swarm on $machine..." -ForegroundColor Cyan
                & docker-machine ssh $machine "docker swarm leave --force"
            } else {
                Write-Host "$machine is not part of a swarm or is not running" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Failed to process $machine: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "$machine machine does not exist" -ForegroundColor Yellow
    }
}

# Step 3: Stop and remove the Docker Machine VMs
Write-Host "Removing Docker Machine instances..." -ForegroundColor Cyan
foreach ($machine in $machines) {
    Write-Host "Stopping and removing $machine..." -ForegroundColor Cyan
    & docker-machine stop $machine 2>$null
    & docker-machine rm -f $machine 2>$null
}

# Step 4: Reset Docker environment variables
Write-Host "Resetting Docker environment to local..." -ForegroundColor Cyan
try {
    & docker-machine env --unset | Invoke-Expression
} catch {
    Write-Host "Failed to unset Docker environment" -ForegroundColor Yellow
}

Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "To verify all Docker Machines are gone, run: docker-machine ls" -ForegroundColor Cyan
