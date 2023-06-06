#!/usr/bin/env node

import { program } from "commander";
import { HorizonBase } from "./horizon";

const buildDeploy = 'builddeploy'
const imageDeploy = 'imagedeploy'

program
    .requiredOption("-a, --addr <addr>", "address of horizon instance, in the form of <protocol>://<host>:<port>")
    .requiredOption("-t, --token <token>", "token with write permissions to horizon cluster")
    .requiredOption("-c, --cluster-id <cluster-id>", "cluster id")
    .requiredOption("--title <title>", "title of deploy")
    .option("-d, --description <description>", "description of deploy")
    .requiredOption("-m, --deploy-method <method>", "deploy method, one of: deploy, builddeploy or imagedeploy")
    .option("-i, --image-tag <image-tag>", "image tag to deploy")
    .option("-g, --git-ref-type <git-ref-type>", "git ref type, one of: branch, tag, commit")
    .option("-r, --ref <ref>", "git ref to deploy, takes effect only if git-ref-type is specified")

program.parse();

const options = program.opts();
const addr = options.addr;
const token = options.token;
const clusterId =parseInt(options.clusterId, 10);
const title = options.title;
const description = options.description;

const horizon_client = new HorizonBase(addr, token)

console.log(options)

const deployMethod = options.deployMethod;
console.log("deployMethod =", deployMethod)
if(deployMethod === buildDeploy) {
    const gitRefType = options.gitRefType;
    const ref = options.ref;
    horizon_client.buildDeploy(clusterId, gitRefType, ref, title, description).then((resp) => {
        console.log("deployed, pipelinerunID =", resp.pipelinerunID)
    })
}else if (deployMethod === imageDeploy) {
    const imageTag = options.imageTag;
    horizon_client.deploy(clusterId, title, imageTag, description).then((resp) => {
        console.log("deployed, pipelinerunID =", resp.pipelinerunID)
    })
}else {
    console.error("deploy method not specified") 
}