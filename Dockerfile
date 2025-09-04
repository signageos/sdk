FROM node:20-alpine AS runtime

WORKDIR /app

FROM runtime AS dev