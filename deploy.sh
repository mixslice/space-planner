#!/bin/bash

KUBE_DIR=$PWD/kube-deploy
KUBE_SAMPLE_DIR=$PWD/kube-deploy-sample
REPO_NAME=space-planner

docker build -t 493490470276.dkr.ecr.cn-north-1.amazonaws.com.cn/${REPO_NAME}:${1} .

sed "s/<TAG>/$1/g" < ${KUBE_SAMPLE_DIR}/${REPO_NAME}.yml > ${KUBE_DIR}/${REPO_NAME}.yml

eval $(aws ecr get-login --no-include-email --region cn-north-1)
docker push 493490470276.dkr.ecr.cn-north-1.amazonaws.com.cn/${REPO_NAME}:${1}

kubectl apply -f kube-deploy
