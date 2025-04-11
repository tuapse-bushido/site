#!/bin/sh

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

valid_prefixes="feat|fix|chore|docs|refactor|test|style|perf|ci|build"

if ! echo "$commit_msg" | grep -qE "^($valid_prefixes):"; then
  echo "❌ Коммит должен начинаться с одного из префиксов: $valid_prefixes"
  echo "Пример: feat: добавить корзину"
  exit 1
fi
