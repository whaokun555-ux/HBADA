@echo off
chcp 65001 >nul
echo ========================================
echo   杭州黑白调 · 应聘登记表 — 部署脚本
echo ========================================
echo.

REM Refresh PATH
set "PATH=%PATH%;C:\Program Files\Git\bin;C:\Program Files\Git\cmd"

echo [1/4] 检查 Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ✕ Git 未安装，请先安装 Git
    pause
    exit /b 1
)
echo ✓ Git 就绪
echo.

echo [2/4] 初始化仓库...
git init
git add index.html
git commit -m "应聘登记表 v1.0" 2>nul
echo ✓ 仓库就绪
echo.

echo [3/4] 推送到 GitHub...
echo 请先确保已在 GitHub 创建仓库:
echo https://github.com/new (仓库名: application-form, 不要勾选任何选项)
echo.
set /p REPO="输入仓库地址 (如 https://github.com/你的用户名/application-form.git): "

git remote remove origin 2>nul
git remote add origin %REPO%
git branch -M main 2>nul
git push -u origin main

if errorlevel 1 (
    echo.
    echo ✕ 推送失败，请检查仓库地址和网络
    pause
    exit /b 1
)
echo.

echo [4/4] 开启 GitHub Pages...
echo ✓ 推送成功！
echo.
echo 现在请手动操作最后一步：
echo 1. 打开 %REPO:.git=%/settings/pages
echo 2. Source 选择 "Deploy from a branch"
echo 3. Branch 选择 "main" 保存
echo 4. 等待 1 分钟，页面地址会显示在页面上
echo.
echo 然后用二维码生成器把链接转成二维码即可！
echo ========================================
pause
