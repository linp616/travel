# 全面排查和修复脚本
Write-Host "=== 全面排查开始 ===" -ForegroundColor Cyan

# 1. 检查网络
Write-Host "`n1. 检查网络连接..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://github.com" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   GitHub 连接成功: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   GitHub 连接失败: $_" -ForegroundColor Red
}

# 2. 检查 Git 状态
Write-Host "`n2. 检查 Git 状态..." -ForegroundColor Yellow
git status
git log --oneline -3

# 3. 检查文件完整性
Write-Host "`n3. 检查关键文件..." -ForegroundColor Yellow
$files = @(
    "src/components/trip/TripForm.tsx",
    "src/app/api/hotels/search/route.ts",
    "src/app/api/xhs-notes/fetch/route.ts",
    "src/lib/db.ts"
)
foreach ($f in $files) {
    if (Test-Path $f) {
        $size = (Get-Item $f).Length
        Write-Host "   $f : $size bytes" -ForegroundColor Green
    } else {
        Write-Host "   $f : MISSING" -ForegroundColor Red
    }
}

# 4. 删除锁文件
Write-Host "`n4. 清理 Git 锁文件..." -ForegroundColor Yellow
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
Write-Host "   锁文件已清理" -ForegroundColor Green

# 5. 尝试推送
Write-Host "`n5. 尝试推送代码..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "   推送成功!" -ForegroundColor Green
} else {
    Write-Host "   推送失败，请检查网络" -ForegroundColor Red
}

Write-Host "`n=== 排查完成 ===" -ForegroundColor Cyan
