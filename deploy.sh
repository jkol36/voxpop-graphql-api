#!/usr/bin/env bash

if [ $1 == "prod" ]
 then
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/ && git reset --hard'
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/ && git pull'
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/ && npm install'
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/ && cp /home/ubuntu/ecosystem.config.js .'
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/ && npm start'
   ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/dist && pm2 start'
   echo "success!"

   exit 0
fi

if [ $1 == "dev" ]
then
  ssh $DEV_USER@$DEV_HOST 'rm -rf /home/ubuntu/HHSB-GraphQL-Api/dist/'
  scp -r dist/ $DEV_USER@$DEV_HOST:/home/ubuntu/HHSB-GraphQL-Api/
  ssh $DEV_USER@$DEV_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/dist/ && npm install -g yarn'
  ssh $DEV_USER@$DEV_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/dist/ && yarn install'
  ssh $DEV_USER@$DEV_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/dist/ && yarn start'
  ssh $DEV_USER@$DEV_HOST 'cd /home/ubuntu/HHSB-GraphQL-Api/dist/ && pm2 restart server'

  echo "success!"

  exit 0  
fi

