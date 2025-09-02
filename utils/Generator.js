import inquirer from 'inquirer';
import download from 'download-git-repo'; // 下载 git 模板
import ora from 'ora';
import util from 'util';
import figlet from 'figlet';
import chalk from 'chalk';
import { getRepoList, getTagList } from './template.js';

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
      const repoChoices = Array.isArray(repos)
        ? repos.map((r) => (typeof r === 'string' ? r : r && r.name)).filter(Boolean)
        : [];
      if (!repoChoices.length) return;
      const { repo } = await inquirer.prompt({
        name: 'repo',
        type: 'list',
        choices: repoChoices,
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
      const tagItems = Array.isArray(tags) ? tags : [];
      if (!tagItems.length) {
        this.download(repo);
      } else {
        const tagNameList = tagItems.map((item) => (typeof item === 'string' ? item : item && item.name)).filter(Boolean);
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
      await this.downloadGitRepo(repoUrl, this.name, {});
      spinner.succeed('项目创建成功');
      console.log(figlet.textSync('SUCCESS!'));
    } catch (e) {
      spinner && spinner.fail('项目创建失败');
    }
  }

  // 创建逻辑
  create() {}
}
export default Generator;
