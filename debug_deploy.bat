@echo off
echo ========================================== > deploy_log.txt
echo [STEP 1] Checking Git Status... >> deploy_log.txt
git status >> deploy_log.txt 2>&1

echo. >> deploy_log.txt
echo [STEP 2] Adding files... >> deploy_log.txt
git add . >> deploy_log.txt 2>&1

echo. >> deploy_log.txt
echo [STEP 3] Committing... >> deploy_log.txt
git commit -m "refactor: optimize starry background and content references (retry)" >> deploy_log.txt 2>&1

echo. >> deploy_log.txt
echo [STEP 4] Pushing to Remote... >> deploy_log.txt
git push origin main >> deploy_log.txt 2>&1

echo. >> deploy_log.txt
echo [STEP 5] Done. >> deploy_log.txt

