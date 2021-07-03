#!/bin/bash
AWS_PROFILE=$1
IMAGE_NAME=itdda-backend
STACK_NAME=itdda
TARGET=backend
REGISTRY_URL=849667588554.dkr.ecr.ap-northeast-2.amazonaws.com/${IMAGE_NAME}:latest
HOST=ubuntu@api.itdda.com
APP_PATH=/home/ubuntu/${STACK_NAME}
DOCKER_COMPOSE=docker-compose-production.yml
PEM_FILE=~/.ssh/itdda.pem

function printUsage() {
    echo "Usage: deploy-dev.sh {profileName}"
    echo ""
}

function errorCheck() {
    if [[ $? -ne 0 ]]; then
    exit 1
fi
}

if [[ -z ${AWS_PROFILE} ]]; then
  printUsage
  exit 1
fi

set -e

docker build -t ${IMAGE_NAME} .
errorCheck

docker tag ${IMAGE_NAME}:latest ${REGISTRY_URL}
errorCheck

AWS_ID=$(aws sts get-caller-identity --query Account --output text --profile ${AWS_PROFILE})
errorCheck

aws ecr get-login-password --region ap-northeast-2 --profile ${AWS_PROFILE} | docker login --username AWS --password-stdin "${AWS_ID}.dkr.ecr.ap-northeast-2.amazonaws.com"
errorCheck

docker push ${REGISTRY_URL}
errorCheck

ssh ${HOST} -i ${PEM_FILE} "mkdir -p ${APP_PATH}"
errorCheck

scp -i ${PEM_FILE} -d ./${DOCKER_COMPOSE} ${HOST}:${APP_PATH}
errorCheck

ssh ${HOST} -i ${PEM_FILE} "sudo aws ecr get-login-password --region ap-northeast-2 | sudo docker login --username AWS --password-stdin ${AWS_ID}.dkr.ecr.ap-northeast-2.amazonaws.com \
                            && sudo docker pull ${REGISTRY_URL} \
                            && sudo docker stack deploy -c ${APP_PATH}/${DOCKER_COMPOSE} ${STACK_NAME} --prune --with-registry-auth \
                            && sudo docker service update ${STACK_NAME}_${TARGET} --with-registry-auth -q"
errorCheck

ssh ${HOST} -i ${PEM_FILE} "sudo docker system prune -f"
docker system prune -f

echo "Deploy Success!"
