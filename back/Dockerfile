#FROM ubuntu:latest
#LABEL authors="Valentin Lemaire"
## Install nodejs
#RUN apt-get update
#RUN apt-get install -y ca-certificates curl gnupg
#RUN mkdir -p /etc/apt/keyrings
#ARG NODE_MAJOR=20
#RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
#RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
#RUN apt-get update
#RUN apt-get install nodejs -y
## Build app
#ENV NODE_ENV production
#WORKDIR /app
#COPY . .
#RUN npm ci
#
#EXPOSE 3000
#CMD ["node", "app.js"]

FROM node:20
WORKDIR /app
COPY . .
COPY package*.json ./
COPY ../selfsigned.crt ./
COPY ../selfsigned.key ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

