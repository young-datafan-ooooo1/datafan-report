// 检查common- 私服包是否是最新状态
const packageInfo = require('./../../package.json')
const semver = require('semver')
const packageJson = require('package-json')
const chalk = require('chalk')
const { execSync } = require('child_process')
const path = require('path')

const dependencies = packageInfo.dependencies
const MODULES = [
  '@sense70/common-component-vue',
  '@sense70/common-dsmanage-vue',
  '@sense70/common-sysmanage-vue',
  '@young-datafan/datafan-ui'
].filter((i) => Object.keys(dependencies).includes(i))
const NEED_UPDATE = []
const NEED_PULL = []
const PROMISE_SEQUENCE = []

MODULES.forEach((name) => {
  PROMISE_SEQUENCE.push(
    new Promise((resolve, reject) => {
      packageJson(name, {
        // 语义化版本标签
        version: packageInfo.dependencies[name],
        registryUrl: 'http://mvn.senses-ai.com:8081/repository/npm-group/'
      })
        .then((res) => {
          if (semver.lt(require(`${name}/package.json`).version, res.version)) {
            const str = execSync('git remote -v', {
              cwd: path.resolve(__dirname, './../../node_modules/' + name)
            })
              .toString()
              .trim()
            str.includes(name.replace('@sense70/', '').replace('@young-datafan/', ''))
              ? NEED_PULL.push(name)
              : NEED_UPDATE.push(name)
          }
          resolve()
        })
        .catch((e) => reject(e))
    })
  )
})

Promise.all(PROMISE_SEQUENCE).then(() => {
  if (NEED_PULL.length > 0) {
    console.log(
      chalk.bold.green('🦊 以下包需要更新，因为它是git仓库，所以不做任何处理。')
    )
    console.log(NEED_PULL)
    console.log(chalk.bold.green('请手动git更新'))
    // NEED_PULL.forEach(name => {
    //   execSync(`git pull origin master:master --ff-only`, {
    //     cwd: path.resolve(__dirname, './../../node_modules/' + name),
    //     stdio: [0, 1, 2]
    //   })
    // })
  }
  if (NEED_UPDATE.length > 0) {
    console.log(
      chalk.bold.green('🚀 以下包需要更新，将自动执行yarn upgrade命令')
    )
    console.log(NEED_UPDATE)
    const cmd = NEED_UPDATE.map((name) => `yarn upgrade ${name}`)

    execSync(cmd.join(' && '), {
      cwd: path.join(process.cwd()),
      stdio: [0, 1, 2]
    })
  }
})