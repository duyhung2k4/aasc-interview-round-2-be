# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Copy the rest of the application code into the working directory
COPY . .

# Compile TypeScript files
RUN tsc

# Expose the port the app runs on
EXPOSE 10000

# Define the command to run the application
CMD ["node", "dist/index.js"]
