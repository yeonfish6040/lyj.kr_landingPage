FROM node:22

COPY ./ ./

RUN npm install

CMD ["node", "index.js"]