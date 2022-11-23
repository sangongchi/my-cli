const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const util = require('util');
const figlet = require('figlet');
const chalk = require('chalk');
const { getRepoList, getTagList } = require('./template');

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
  }
  // 对 download-git-repo 进行 promise 化改造
  downloadGitRepo = util.promisify(download);

  // 获取远程模板
  async getRepo() {
    try {
      const repos = await getRepoList();
      if (!repos) return;
      const { repo } = await inquirer.prompt({
        name: 'repo',
        type: 'list',
        choices: repos,
        message: '请选择模板：',
      });
      if (repo) {
        this.getTag(repo);
      }
    } catch (e) {
      console.log(chalk.red('获取模板失败'));
    }
  }
  // 获取对应模板的版本
  async getTag(repo) {
    try {
      const tags = await getTagList(repo);
      if (!tags || !tags.length) {
        this.download(repo);
      } else {
        const tagNameList = tags.map((item) => item.name);
        // 让用户主动选择对应的版本
        const { tag } = await inquirer.prompt({
          name: 'tag',
          type: 'list',
          choices: tagNameList,
          message: '请选择创建模板的版本',
        });
        this.download(repo, tag);
      }
    } catch (e) {
      console.log(chalk.red('获取tag失败'));
    }
  }
  // 下载远程模板
  async download(repo, tag = '') {
    let spinner = null;
    try {
      const repoUrl = `sangongchi1/${repo}${tag ? '#' + tag : ''}`;
      console.log(`------start download---- ${this.name}---->${repoUrl}`);
      spinner = ora('Loading unicorns').start();
      await this.downloadGitRepo(repoUrl, this.name);
      spinner.succeed('项目创建成功');
      console.log(
        figlet.textSync('SUCCESS!', {
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true,
        })
      );
    } catch (e) {
      spinner.fail('项目创建失败');
    }
  }

  // 创建逻辑
  create() {}
}
module.exports = Generator;
