FROM node:20-alpine

WORKDIR /app

# Copy backend
COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["npm", "start"]
