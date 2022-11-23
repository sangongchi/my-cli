const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Generator = require('../utils/Generator');
const ora = require('ora');

async function create(name, options) {
  console.log('name', name, 'options', options);
  // 首先获取当前命令执行位置
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  // 判断文件是否存在
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      // 移除当前文件
      await fs.remove(targetAir);
    } else {
      // 尝试询问用户是否需要重写
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '是否想要覆盖当前文件',
          choices: [
            {
              name: '是',
              value: true,
            },
            {
              name: '否',
              value: false,
            },
          ],
        },
      ]);
      if (!action) return;
      if (action) {
        const oraRemove = ora('nRemoveing').start();
        await fs.remove(targetAir);
        oraRemove.stop();
      }
    }
  }
  // 选择模板准备创建
  const createGenerator = new Generator(name, targetAir);
  createGenerator.getRepo();
}
module.exports = create;
