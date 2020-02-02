FROM node:current-alpine

# Set working directory to /stock-app/server
WORKDIR /usr/src/stock-app/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3031

CMD ["npm", "run", "server:watch"]
