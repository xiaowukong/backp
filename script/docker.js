const Listr = require('listr')
const execa = require('execa')
const PACKAGE = require('../package.json')
const PROJECT_NAME = PACKAGE.name
const PROJECT_VERSION = PACKAGE.version
const REGISTRY_HOST = 'registry-vpc.cn-beijing.aliyuncs.com'

let imageName;
let tag;
let now = Date.now();

console.log("=====================================================================")
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  tag = `${PROJECT_VERSION}`;
} else {
  tag = `${PROJECT_VERSION}-${now}`;
}
console.log(tag)

imageName = `${REGISTRY_HOST}/mintechai-galaxy/${PROJECT_NAME}:${tag}`;
process.on('unhandledRejection', err => {
  throw err
});


const run = async () => {

  const tasks = new Listr([

    // {
    //   title: 'npm install',
    //   task: () => execa('npm', ['install'])
    // },
    // {
    //   title: 'npm run build',
    //   task: () => execa.shell(`npm run build`)
    // },
    {
      title: 'prepare',
      task: () => execa.shell(`cd ./docker && rm -rf dist && cp -r ../dist . && cp ../index.html .`)
    },
    {
      title: 'build docker images',
      task: async ctx => {
          await execa.shell(
            `cd ./docker && docker build -f Dockerfile --build-arg PROJECT_NAME=${PROJECT_NAME}  -t ${imageName} ./`
          )
        }
    },
    {
      title: 'push docker images',
      task: async ctx => {
          await execa.shell(`docker push ${imageName}`)
        }
    },
    {
      title: 'write tag',
      task: async ctx => {
        await execa.shell(`echo ${tag} > /tmp/galaxy-business-web.temp`)
      }
    },
  ]);

  tasks.run().catch(err => {
    console.error(err)
  })
}

run();
