# 创建 CT AI 快捷方式的脚本

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$shortcutPath = Join-Path $scriptPath "CT AI.lnk"
$targetPath = Join-Path $scriptPath "启动CT AI.ps1"
$iconPath = Join-Path $env:ProgramFiles "PowerShell\7\pwsh.exe"

# 检查目标文件是否存在
if (-not (Test-Path $targetPath)) {
    Write-Host "错误: 找不到启动脚本: $targetPath" -ForegroundColor Red
    exit 1
}

# 创建快捷方式
try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$targetPath`""
    $Shortcut.WorkingDirectory = $scriptPath
    $Shortcut.Description = "CT AI 智能图像编辑应用"
    
    # 尝试使用 PowerShell 图标，如果不存在则使用默认图标
    if (Test-Path $iconPath) {
        $Shortcut.IconLocation = "$iconPath,0"
    }
    
    $Shortcut.Save()
    
    Write-Host "✓ 快捷方式创建成功: $shortcutPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "现在你可以双击 'CT AI.lnk' 来启动应用了！" -ForegroundColor Cyan
} catch {
    Write-Host "错误: 无法创建快捷方式: $_" -ForegroundColor Red
    exit 1
}

