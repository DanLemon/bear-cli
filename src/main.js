// console.log("bear")

const program = require("commander")
const { version } = require("./constants")
const path = require("path")
const mapActions = {
    create:{
        alias:"c",
        description:"create a project",
        examples:["bear-cli create <project-name>"]
    },
    config:{
        alias:"conf",
        description:"config project variable",
        examples:["bear-cli config set <k><v>","bear-cli config get <k>"]
    },
    "*":{
        alias:"",
        description:"command not found",
        examples:[]
    }
}
//循环创建命令
Reflect.ownKeys(mapActions).forEach((action)=>{
    program
    .command(action) //配置命令
    .alias(mapActions[action].alias)//配置命令的别名
    .description(mapActions[action].description)//配置命令的描述
    .action(()=>{
        if(action==='*'){
            console.log(mapActions[action].description)
        }else{
            console.log(action)
            //截取命令
            require(path.resolve(__dirname,action))(...process.argv.slice(3))
        }
    })
})
//监听用户的 help 事件
program.on("--help",()=>{
    console.log("\nExamples");
    Reflect.ownKeys(mapActions).forEach(action=>{
        mapActions[action].examples.forEach(exa=>{
            console.log(exa)
        })
    })
})




program.version(version).parse(process.argv)