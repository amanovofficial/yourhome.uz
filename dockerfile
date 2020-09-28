FROM node:latest
WORKDIR /usr/src/yourhome
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]