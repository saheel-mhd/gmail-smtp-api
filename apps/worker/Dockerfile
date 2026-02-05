FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/worker/package.json ./apps/worker/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install

COPY . .
RUN npm run prisma:generate -w @gmail-smtp/api && npm run build -w @gmail-smtp/worker

CMD ["node", "apps/worker/dist/index.js"]
