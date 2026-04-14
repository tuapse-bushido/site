#!/bin/sh
set -e

MAIN_BRANCH="main"
DEPLOY_BRANCH="deploy"

echo "🌿 Syncing '$DEPLOY_BRANCH' with '$MAIN_BRANCH'..."

# Рабочее дерево должно быть чистым
if ! git diff-index --quiet HEAD --; then
  echo "⚠️ Working tree is not clean. Commit or stash your changes first."
  exit 1
fi

# Обновляем ссылки
git fetch origin "$MAIN_BRANCH" "$DEPLOY_BRANCH"

# Переходим в deploy
git checkout "$DEPLOY_BRANCH"

# Подтягиваем последние изменения deploy
git pull origin "$DEPLOY_BRANCH"

# Мержим main в deploy (как и раньше)
echo "🔄 Merging '$MAIN_BRANCH' into '$DEPLOY_BRANCH'..."
git merge "origin/$MAIN_BRANCH" --no-edit

# Добавляем изменённые файлы, если есть
git add -A

# Коммитим только если merge создал изменения
if git diff --cached --quiet; then
  echo "✅ No changes to commit."
else
  git commit -m "chore: sync deploy with main"
fi

# Пушим обновлённую ветку deploy
echo "📤 Pushing '$DEPLOY_BRANCH'..."
git push origin "$DEPLOY_BRANCH"

echo "✅ Deploy branch is up to date!"
