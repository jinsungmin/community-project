#!/bin/bash
FROM node:14-alpine
# 특정 버전 node 이미지를 받아옵니다.
MAINTAINER jinjin
# 작성자의 이름을 적습니다.
WORKDIR /home/app
# 만들 이미지에 작업할 디렉토리로 이동합니다.
COPY . .

RUN npm install
# 이미지 디렉토리에서 npm install 명령어를 실행해 줍니다.
# package.json이 있으므로 npm install로 종속 모듈이 설치가 되겠죠?
RUN npm install -g typescript
# typescript를 이용한 node이므로 전역옵션을 이용하여 typescript 모듈을 설치해줍니다.
COPY . .
# 현재 폴더에 있는 모든 파일들을 복사하여 이미지 디렉토리에 복사합니다.
# 여기과정이 자신이 작성한 코드등 리소스들이 복사됩니다.
RUN npm run build
# typescript로 작성된 node이므로 build를 하여 javascript 파일로 컴파일 해줍니다.
CMD ["npm", "run", "local"]
# 해당 이미지가 실행될때 실행될 명령어입니다.
