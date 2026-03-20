param(
    [switch]$UseLocalPostgres,
    [string]$DbContainerName = "survey-postgres-local",
    [string]$DbName = "surveydb_dev",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "postgres",
    [int]$DbPort = 5432,
    [int]$BackendPort = 8080,
    [int]$FrontendPort = 3000
)

$ErrorActionPreference = "Stop"

function Test-CommandExists {
    param([Parameter(Mandatory = $true)][string]$CommandName)
    return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}

function Ensure-FrontendEnv {
    param(
        [Parameter(Mandatory = $true)][string]$FrontendPath,
        [Parameter(Mandatory = $true)][string]$ApiBaseUrl
    )

    $envPath = Join-Path $FrontendPath ".env"
    $examplePath = Join-Path $FrontendPath ".env.example"

    if (-not (Test-Path $envPath)) {
        if (Test-Path $examplePath) {
            Copy-Item $examplePath $envPath -Force
        } else {
            Set-Content -Path $envPath -Value "" -Encoding UTF8
        }
    }

    $content = Get-Content -Path $envPath -Raw

    if ($content -match "(?m)^VITE_API_BASE_URL=") {
        $content = [regex]::Replace($content, "(?m)^VITE_API_BASE_URL=.*$", "VITE_API_BASE_URL=$ApiBaseUrl")
    } else {
        if (-not [string]::IsNullOrWhiteSpace($content) -and -not $content.EndsWith("`n")) {
            $content += "`r`n"
        }
        $content += "VITE_API_BASE_URL=$ApiBaseUrl`r`n"
    }

    Set-Content -Path $envPath -Value $content -Encoding UTF8
}

function Ensure-PostgresContainer {
    param(
        [Parameter(Mandatory = $true)][string]$ContainerName,
        [Parameter(Mandatory = $true)][string]$Database,
        [Parameter(Mandatory = $true)][string]$User,
        [Parameter(Mandatory = $true)][string]$Password,
        [Parameter(Mandatory = $true)][int]$Port
    )

    if (-not (Test-CommandExists -CommandName "docker")) {
        throw "Docker is required when -UseLocalPostgres is not set. Install Docker Desktop or use -UseLocalPostgres."
    }

    $existing = docker ps -a --filter "name=^/$ContainerName$" --format "{{.Names}}"

    if (-not $existing) {
        Write-Host "Creating PostgreSQL container '$ContainerName'..."
        docker run --name $ContainerName `
            -e "POSTGRES_DB=$Database" `
            -e "POSTGRES_USER=$User" `
            -e "POSTGRES_PASSWORD=$Password" `
            -p "${Port}:5432" `
            -d postgres:15-alpine | Out-Null
    } else {
        $running = docker inspect -f "{{.State.Running}}" $ContainerName
        if ($running -ne "true") {
            Write-Host "Starting existing PostgreSQL container '$ContainerName'..."
            docker start $ContainerName | Out-Null
        }
    }

    Write-Host "Waiting for PostgreSQL to become healthy..."
    for ($i = 0; $i -lt 30; $i++) {
        $ready = docker exec $ContainerName pg_isready -U $User -d $Database 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL is ready."
            return
        }
        Start-Sleep -Seconds 2
    }

    throw "PostgreSQL did not become ready in time."
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"

if (-not (Test-Path $backendPath)) {
    throw "Backend folder not found at $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "Frontend folder not found at $frontendPath"
}

$requiredCommands = @("java", "mvn", "node", "npm")
foreach ($cmd in $requiredCommands) {
    if (-not (Test-CommandExists -CommandName $cmd)) {
        throw "Missing required command: $cmd"
    }
}

if (-not $UseLocalPostgres) {
    Ensure-PostgresContainer -ContainerName $DbContainerName -Database $DbName -User $DbUser -Password $DbPassword -Port $DbPort
} else {
    Write-Host "Using local PostgreSQL. Ensure it is running on localhost:$DbPort and database '$DbName' exists."
}

$apiBaseUrl = "http://localhost:$BackendPort/api"
Ensure-FrontendEnv -FrontendPath $frontendPath -ApiBaseUrl $apiBaseUrl

$jwtSecret = [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 } | ForEach-Object { [byte]$_ }))

$backendCommand = @"
Set-Location '$backendPath'
`$env:DB_URL='jdbc:postgresql://localhost:$DbPort/$DbName'
`$env:DB_USERNAME='$DbUser'
`$env:DB_PASSWORD='$DbPassword'
`$env:JWT_SECRET='$jwtSecret'
mvn spring-boot:run -Dspring-boot.run.profiles=dev
"@

$frontendCommand = @"
Set-Location '$frontendPath'
if (-not (Test-Path 'node_modules')) { npm install }
npm run dev -- --port $FrontendPort
"@

Write-Host "Starting backend in a new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand | Out-Null

Write-Host "Starting frontend in a new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand | Out-Null

Write-Host ""
Write-Host "Local development started."
Write-Host "Frontend: http://localhost:$FrontendPort"
Write-Host "Backend:  http://localhost:$BackendPort"
Write-Host "Swagger:  http://localhost:$BackendPort/swagger-ui.html"
Write-Host ""
Write-Host "Tip: Close the opened backend/frontend PowerShell windows to stop app processes."
if (-not $UseLocalPostgres) {
    Write-Host "To stop DB container later: docker stop $DbContainerName"
}
