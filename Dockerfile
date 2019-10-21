FROM node:10.15.3-alpine

# Set working directory to /stock-app/server
WORKDIR /stock-app/app/server

# Copy source files to working directory
COPY . .

# Expose ports
EXPOSE 3031

# Clean install dependencies
RUN npm ci

CMD ["npm", "run", "sls:dev"]
