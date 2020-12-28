const axios = require("axios")
const ora = require("ora")
const path = require("path")
const inquirer = require("inquirer")
const { promisify } =require("util")
let downfn = require("download-git-repo")
downfn = promisify(downfn)

//获取仓库模板信息
const fetchRepolist = async ()=>{
    const { data } = await axios.get("https://caz.vercel.app/templates?owner=cyzabc")
    // const { data } = await axios.get("https://api.github.com/users/cyzabc/repos")
    return data;
}
//loading 封装
const waitloading = (fn,message)=> async (...args)=>{
    const spinner = ora(message)
    
    spinner.start()
    // 获取仓库模板信息
    let repos = await fn(...args)
    spinner.succeed()
    return repos;
}
//抓取tags列表
// const fetchTaglist = async (repo) => {
//     const { data } = await axios.get(`https://api.github.com/users/cyzabc/${repo}/tags`)
//     return data
// }
// 分装下载
const downloading = async (repo)=>{
    console.log("=====",repo)
    let api = `cyzabc/${repo}`
    const dest = process.cwd()+"/"+repo
    await downfn(api,dest)
    return dest
}
module.exports = async (proname)=>{
    // console.log(proname)
    //开始加载
    //1.获取项目模板
    let repos = await waitloading(fetchRepolist,"fetch template......")()
    repos = repos.map((item)=>item.name)
    const { repo } = await inquirer.prompt({
        name:"repo",//选择后的结果
        type:"list", //什么方式展现
        message:"please choice a template to create project",
        choices:repos //选择的数据
    });
    //2.获取对应的版本号
    // let tags = await waitloading(fetchTaglist,"获取版本。。。。")(repo)
    // console.log(tags)
    // tags = tags.map( item => item.name)
    // //选择版本号
    // const { tag } = await inquirer.prompt({
    //     name:"tag",//选择后的结果
    //     type:"list", //什么方式展现
    //     message:"please choice a tag to create project",
    //     choices:tags //选择的数据
    // });
    // console.log(repo,tag)
    // 下载
    const result = await waitloading(downloading,"正在下载。。。。")(repo)
    console.log(result)
}