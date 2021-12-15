FROM mhart/alpine-node:latest

RUN apk update
RUN apk add python2	

WORKDIR /usr/src/app
RUN apk add --update nodejs nodejs-npm
COPY package*.json ./
RUN  npm install

RUN npm install -g gulp

COPY index.html /tmp/index.html
COPY start.sh /tmp/start.sh
USER 1000
CMD ["sh","/tmp/start.sh"]
