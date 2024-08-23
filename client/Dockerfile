FROM node:21-alpine

# Create App Directory
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json package-lock.json ./
# RUN npm install -g npm@10.8.0
#RUN npm install

# Install expo-cli globally
RUN npm install --global expo-cli

# Copy app source code
COPY . .

# Exports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Set up a default command
CMD [ "npm", "start" ]
