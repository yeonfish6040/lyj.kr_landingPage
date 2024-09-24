FROM public.ecr.aws/docker/library/node:lts-alpine

ENTRYPOINT []

COPY ./ ./

RUN npm install

CMD ["node", "index.js"]