FROM node:18-alpine

WORKDIR /app

# Install all deps (devDeps needed for tsc compilation)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Compile TypeScript → JavaScript in-place (no outDir, so .ts and .js co-exist).
# After this step every require('../models/index.model') resolves to the compiled .js.
RUN npx tsc

# Remove devDeps — ts-node / typescript no longer needed at runtime
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/server.js"]
