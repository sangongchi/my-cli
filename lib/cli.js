#! /usr/bin/env node

const { program } = require("commander"); // 处理命令
const chalk = require("chalk");
const packageInfo = require("../package.json");
const createProject = require("./create");

program
  // 定义命令和参数
  .command("create <app-name>")
  .description("create a new project1")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .option("-d --debug-and", "output extra debugging")
  .option("-p --params <name>", "添加参数", "blue")
  .option("-c, --cheese <type>", "add the specified type of cheese", "blue")
  .action((name, options) => {
    //根据用户输入命令执行后续创建项目
    createProject(name, options);
  });

program.on("--help", () => {
  console.log(chalk.blue('亲，你终于知道要寻求帮助了'));
});

// 设置查看版本号 my-cli -v
program.version(`v${packageInfo.version}`).usage("<command> [option]");

program.parse(process.argv);
