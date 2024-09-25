import Generator from 'yeoman-generator';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

export default class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'redisHost',
        message: '请输入Redis地址',
        default: '127.0.0.1',
      },
      {
        type: 'number',
        name: 'redisPort',
        message: '请输入Redis端口',
        default: 6379,
      },
      {
        type: 'password',
        name: 'redisPassword',
        message: '请输入Redis密码',
        default: '',
      },
      {
        type: 'input',
        name: 'mysqlUser',
        message: '请输入MySQL用户名',
        default: 'root',
      },
      {
        type: 'password',
        name: 'mysqlPassword',
        message: '请输入MySQL用户密码',
        default: '',
      },
      {
        type: 'input',
        name: 'mysqlHost',
        message: '请输入MySQL地址',
        default: '127.0.0.1',
      },
      {
        type: 'number',
        name: 'mysqlPort',
        message: '请输入MySQL端口',
        default: 3306,
      },
      {
        type: 'input',
        name: 'mysqlDatabase',
        message: '请输入MySQL数据库名',
        default: 'sample',
      },
    ]);
  }
  configuring() {
    this.log('1. 初始化项目');
    this.spawnSync('go', ['mod', 'init', this.answers.projectName]);
  }
  writing() {
    this.log('2. 生成项目文件');

    const files = glob.sync(`${this.sourceRoot()}/**`, { dot: true });

    files.forEach(file => {
      if (!fs.statSync(file).isDirectory()) {
        const filePath = path.relative(this.sourceRoot(), file);
        this.fs.copyTpl(
          this.templatePath(filePath),
          this.destinationPath(filePath.substring(0, filePath.lastIndexOf('.'))),
          {
            'redis_host': this.answers.redisHost,
            'redis_port': this.answers.redisPort,
            'redis_pass': this.answers.redisPassword,
            'mysql_user': this.answers.mysqlUser,
            'mysql_pass': this.answers.mysqlPassword,
            'mysql_host': this.answers.mysqlHost,
            'mysql_port': this.answers.mysqlPort,
            'mysql_db': this.answers.mysqlDatabase,
            'project_name': this.answers.projectName,
          },
        );
      }
    });
  }
  install() {
    this.log('3. 安装依赖');
    this.spawnSync('go', ['mod', 'tidy']);
  }
};