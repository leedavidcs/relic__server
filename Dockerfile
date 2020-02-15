# Use the latest 'node' official version
FROM node:12.15.0-alpine

# Install python for dependencies that require node-gyp support
RUN apk add --no-cache --virtual .gyp python make g++

# Execute as unprivileged user that comes built into the node image from Docker.
USER node

# Ensure that the unprivileged user can install dependencies to the workdir
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
WORKDIR /home/node

# Copy package.json, package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci


# Copy all remaining files from the current directory
  # Note: 'node_modules' will not be overwritten because of .dockerignore
  # See: .dockerignore for the full list of ignored files
COPY . .

# # This app listens on port 3031, but the container should launch on port 80, so it will respond to
#   # http://localhost:80 on your computer
EXPOSE 3031

# Start the container using the server:dev command
CMD ["npm", "run", "server:dev"]
