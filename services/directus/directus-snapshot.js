#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const SNAPSHOT_DIR = path.resolve(__dirname, "./snapshots");

// Ensure snapshot dir exists
if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR);

async function createSnapshot() {
  // Получаем список уже существующих снапшотов
  const files = fs.readdirSync(SNAPSHOT_DIR).filter((f) => f.endsWith(".yaml"));
  let { mode } = await prompt([
    {
      type: "list",
      name: "mode",
      message: "Что вы хотите сделать?",
      choices: [
        { name: "Создать новый снапшот", value: "new" },
        ...(files.length
          ? [{ name: "Заменить существующий снапшот", value: "replace" }]
          : []),
      ],
    },
  ]);

  let filename;
  if (mode === "new") {
    let { snapshotName } = await prompt([
      {
        type: "input",
        name: "snapshotName",
        message: "Введите название для снапшота (без .yaml):",
        validate: (input) =>
          input.match(/^[\w\-]+$/)
            ? true
            : "Только буквы, цифры, тире и нижнее подчёркивание",
      },
    ]);
    filename = `${snapshotName}.yaml`;
  } else {
    let { chosen } = await prompt([
      {
        type: "list",
        name: "chosen",
        message: "Выберите снапшот для замены:",
        choices: files,
      },
    ]);
    filename = chosen;
  }

  // Формируем полный путь
  const filepath = path.join(SNAPSHOT_DIR, filename);

  try {
    // Выполняем directus schema snapshot
    execSync(`npx directus schema snapshot "${filepath}"`, {
      stdio: "inherit",
    });
    console.log(`✅ Снапшот "${filename}" успешно создан/заменён!`);
  } catch (err) {
    console.error("❌ Ошибка при создании снапшота:", err.message);
  }
}

async function restoreSnapshot() {
  // Получаем список снапшотов
  const files = fs.readdirSync(SNAPSHOT_DIR).filter((f) => f.endsWith(".yaml"));
  if (!files.length) {
    console.log("Нет доступных снапшотов для восстановления.");
    return;
  }

  let { chosen } = await prompt([
    {
      type: "list",
      name: "chosen",
      message: "Выберите снапшот для восстановления:",
      choices: files,
    },
  ]);

  const filepath = path.join(SNAPSHOT_DIR, chosen);

  try {
    // Выполняем directus schema apply
    execSync(`npx directus schema apply "${filepath}"`, {
      stdio: "inherit",
    });
    console.log(`✅ Схема успешно восстановлена из снапшота "${chosen}"!`);
  } catch (err) {
    console.error("❌ Ошибка при восстановлении:", err.message);
  }
}

async function main() {
  const { action } = await prompt([
    {
      type: "list",
      name: "action",
      message: "Выберите действие:",
      choices: [
        { name: "Создать или заменить снапшот", value: "create" },
        { name: "Восстановить из снапшота", value: "restore" },
      ],
    },
  ]);

  if (action === "create") {
    await createSnapshot();
  } else {
    await restoreSnapshot();
  }
}

main();
