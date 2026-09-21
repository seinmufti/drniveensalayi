# Allows phones/other devices on your LAN to reach drniveen on port 4717.
# Triggers a UAC prompt if not already running as Administrator.

$ruleName = "Seclusion Initiative - drniveen 4717"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdmin) {
  Write-Host "Requesting administrator access..."
  Start-Process powershell.exe -Verb RunAs -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", $PSCommandPath
  )
  exit 0
}

$existing = netsh advfirewall firewall show rule name="$ruleName" 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Firewall rule already exists: $ruleName"
} else {
  netsh advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=4717
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Added firewall rule for TCP port 4717."
  } else {
    Write-Host "Failed to add firewall rule."
    exit 1
  }
}

Write-Host ""
Write-Host "Open on your phone: http://172.20.10.2:4717"
Write-Host "(Use your PC's current LAN IP if different.)"
Write-Host ""
Read-Host "Press Enter to close"
