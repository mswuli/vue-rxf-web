#Dockerfile文件
FROM docker.io/node
# Create app directory
RUN mkdir -p /home/Service
WORKDIR /home/Service
# Bundle app source
COPY . /home/Service
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]