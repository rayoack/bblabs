FROM node:12-alpine
EXPOSE $PORT
WORKDIR /app/
COPY package.json package-lock.json .eslintrc.js .prettierrc tsconfig.json ./
RUN npm i