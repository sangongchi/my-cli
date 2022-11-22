const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');



async function create(name, options) {
  console.log('根据获取到的值进行后续操作', 'name', name, 'options', options)
  // 首先获取当前命令执行位置
  const cwd = process.cwd()
  console.log('cwd', cwd)
  const targetAir = path.join(cwd, name)
  // 判断文件是否存在
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      // 移除当前文件
      await fs.remove(targetAir)
    } else {
      // 尝试询问用户是否需要重写
      let result = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: '是否想要覆盖当前文件',
        choices: [{
            name: '是',
            value: true
          },
          {
            name: '否',
            value: false
          }
        ]
      }])
      console.log('result', result)
    }
  }
  console.log('targetAir', targetAir)
}
module.exports = create