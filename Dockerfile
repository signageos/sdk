FROM node:22-alpine AS runtime

WORKDIR /app

FROM runtime AS dev