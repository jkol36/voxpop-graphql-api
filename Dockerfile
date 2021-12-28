FROM keymetrics/pm2:latest-stretch

MAINTAINER scoreboardinc

# Prepare app directory
RUN mkdir -p /usr/src/app

# Install dependencies
WORKDIR /usr/src/app

# Update npm
RUN npm install -g npm@latest

COPY package*.json ./

COPY . .

# Building code for production
RUN npm install

# Build files
RUN npm run build

# Install pm2 globally
RUN npm install pm2 -g

RUN rm /etc/localtime

RUN ln -s /usr/share/zoneinfo/America/Los_Angeles /etc/localtime

EXPOSE 3000 465 8080

# Change app directory to build folder
WORKDIR /usr/src/app/dist

CMD ["pm2-runtime","start","ecosystem.config.js"]
