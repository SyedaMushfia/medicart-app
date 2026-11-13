FROM node:26-alpine
WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source, then build and test inside the image
COPY . .
RUN npm run build && npm run build:backend && npm test

ENV PORT=3001
EXPOSE 3001
USER node
CMD ["node", "backend/dist/index.js"]
