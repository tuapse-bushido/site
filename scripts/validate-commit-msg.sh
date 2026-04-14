#!/usr/bin/env sh

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

# 1. Регулярка теперь поддерживает:
# - Опциональный scope в скобках: feat(auth)
# - Восклицательный знак перед двоеточием для Breaking Changes: refactor!
# - Обязательный пробел после двоеточия
valid_prefixes="feat|fix|chore|docs|refactor|test|style|perf|ci|build"
pattern="^($valid_prefixes)(\([^)]+\))?!?: .+"

# 2. Проверка формата
if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌  ОШИБКА: Неверный формат заголовка коммита!"
  echo "-------------------------------------------------------"
  echo "Правильный формат: <тип>(<область>)?: <описание>"
  echo "Типы: $valid_prefixes"
  echo "Пример: refactor(cart)!: удалить старые модели данных"
  echo "-------------------------------------------------------"
  exit 1
fi

# 3. Проверка длины заголовка (мягкое ограничение)
first_line=$(echo "$commit_msg" | head -n 1)
if [ ${#first_line} -gt 72 ]; then
  echo "⚠️  ПРЕДУПРЕЖДЕНИЕ: Заголовок слишком длинный (${#first_line}/72)"
fi

# 4. Проверка на точку в конце (плохой тон для заголовка)
if echo "$first_line" | grep -q "\.$"; then
  echo "❌  ОШИБКА: Заголовок коммита не должен заканчиваться точкой!"
  exit 1
fi

exit 0