FROM node:20-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json .

#RUN npm install
RUN npm install
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
