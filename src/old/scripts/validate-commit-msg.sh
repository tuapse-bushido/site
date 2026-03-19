#!/usr/bin/env sh

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

valid_prefixes="feat|fix|chore|docs|refactor|test|style|perf|ci|build"

if ! echo "$commit_msg" | grep -qE "^($valid_prefixes)(\([^)]+\))?: "; then
  echo "❌ Некорректный формат коммита!"
  echo "Коммит должен начинаться с одного из префиксов:"
  echo "  $valid_prefixes"
  echo "Примеры:"
  echo "  feat: добавить корзину"
  echo "  fix(api): исправить ошибку авторизации"
  exit 1
fi
