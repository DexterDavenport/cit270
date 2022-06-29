# This is the base image we are inheriting from
FROM node 

# This tells the container to start in that directory
WORKDIR /app

# We are copying the package.json file first so that there isn't a confilct with the nodes_modules directory
COPY package.json ./

RUN npm install

COPY . ./

# This is the last command we need ot start the container/server
CMD npm start

