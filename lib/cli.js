#! /usr/bin/env node

import { program } from "commander"; // 处理命令
import chalk from "chalk";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageInfo = require("../package.json");

program
  // 定义命令和参数
  .command("create <app-name>")
  .description("create a new project1")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .option("-d --debug-and", "output extra debugging")
  .option("-p --params <name>", "添加参数", "blue")
  .option("-c, --cheese <type>", "add the specified type of cheese", "blue")
  .action(async (name, options) => {
    //根据用户输入命令执行后续创建项目（懒加载）
    const { default: createProject } = await import("./create.js");
    await createProject(name, options);
  });

program.on("--help", () => {
  console.log(chalk.blue('亲，你终于知道要寻求帮助了'));
});

// 设置查看版本号，支持 -V / --version（-v 已在上方兼容处理）
program.version(`v${packageInfo.version}`).usage("<command> [option]");

program.parse(process.argv);
