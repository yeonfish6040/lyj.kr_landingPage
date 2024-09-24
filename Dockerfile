FROM public.ecr.aws/docker/library/node:lts-alpine

COPY ./ ./

RUN npm install

CMD ["node", "index.js"]