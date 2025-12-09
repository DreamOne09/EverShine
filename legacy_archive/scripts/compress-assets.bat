@echo off
echo ========================================
echo 壓縮CSS和JavaScript檔案
echo ========================================

REM 備份原始檔案
echo 備份原始檔案...
copy css\style.css css\style.original.css
copy js\main.js js\main.original.js
copy js\starry-background-unified.js js\starry-background-unified.original.js

REM 使用csso壓縮CSS
echo 壓縮CSS...
npx csso css\style.css --output css\style.min.css

REM 使用terser壓縮JavaScript
echo 壓縮JavaScript...
npx terser js\main.js --compress --mangle --output js\main.min.js
npx terser js\starry-background-unified.js --compress --mangle --output js\starry-background-unified.min.js
npx terser js\components.js --compress --mangle --output js\components.min.js
npx terser js\category-mapping.js --compress --mangle --output js\category-mapping.min.js
npx terser js\scroll-progress.js --compress --mangle --output js\scroll-progress.min.js

echo ========================================
echo 壓縮完成！
echo ========================================
echo.
echo 檔案已壓縮：
echo - css/style.min.css
echo - js/main.min.js
echo - js/starry-background-unified.min.js
echo - js/components.min.js
echo - js/category-mapping.min.js
echo - js/scroll-progress.min.js
echo.
echo 原始檔案備份在 *.original.* 檔案中
pause
