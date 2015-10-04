FROM node:4.1
ENV NODE_ENV="production"
ENV PORT="3000"
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
