FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/snakeserver
WORKDIR /usr/src/snakeserver

# Install app dependencies
COPY package.json /usr/src/snakeserver/
RUN npm install

# Bundle app source
COPY . /usr/src/snakeserver


EXPOSE 5000
CMD [ "npm", "start" ]
