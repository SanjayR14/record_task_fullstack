# backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# If you have a build step like TypeScript compilation:
# RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./
EXPOSE 5001
CMD [ "npm", "start" ]