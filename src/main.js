const cmd = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

cmd
  .command('install')
  .description('初始化组件模板')
  .action(() => install());

const reactRender = (
  fileName,
  suffix
) => `import React, { useEffect, useState } from 'react';

import './index.${suffix}';

const ${fileName} = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {}, []);

  return <div>${fileName}</div>;
};

export default ${fileName};`;

const vueRender = (fileName, suffix) => `<template></template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  name: ${fileName},
  setup() {
    const obj = reactive({});
    return {
      ...toRefs(obj),
    };
  },
};
</script>

<style ${suffix === 'css' ? ' ' : `lang="${suffix}" `}scoped></style>`;

async function install(dir = '.') {
  const frameworkList = ['React', 'Vue'];
  const cssList = ['css', 'less', 'scss'];
  const { type, name, cssType } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What‘s your project name?',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Which framework does your project use',
      choices: frameworkList,
    },
    {
      type: 'list',
      name: 'cssType',
      message: 'Which css does your project use?',
      choices: cssList,
    },
    // {
    //   type: 'confirm',
    //   name: 'husky',
    //   message: 'Does your project use TypeScript?',
    // },
  ]);
  const currentDir = path.join(dir, name);
  const spinner = ora('Creating...');
  spinner.start();
  if (name === '') {
    spinner.fail();
    console.log(chalk.red('The project name is empty'));
    return;
  }
  if (fs.existsSync(currentDir)) {
    spinner.fail();
    console.log(chalk.red('The project is exist'));
    const { isDelete } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isDelete',
        message: 'Do you want to delete this dir?',
      },
    ]);
    if (!isDelete) {
      return;
    } else {
      deldir(currentDir);
    }
    mkdir(currentDir);
    if (type === frameworkList[0]) {
      const fileName = name.substring(0, 1).toUpperCase() + name.substring(1);
      fs.writeFileSync(
        path.join(currentDir, 'index.js'),
        reactRender(fileName, cssType)
      );
      fs.writeFileSync(path.join(currentDir, `index.${cssType}`), '');
      spinner.succeed();
    }
    if (type === frameworkList[1]) {
      fs.writeFileSync(
        path.join(currentDir, 'index.vue'),
        vueRender(name, cssType)
      );
      spinner.succeed();
    }
  }
}

const mkdir = dir => fs.mkdirSync(dir, { recursive: true });

function deldir(path) {
  let files = [];

  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);

    files.forEach(file => {
      let curPath = path + '/' + file;

      if (fs.statSync(curPath).isDirectory()) {
        deldir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });

    fs.rmdirSync(path);
  }
}

//解析命令行
cmd.parse(process.argv);
