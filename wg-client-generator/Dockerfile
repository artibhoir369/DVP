# wg-client-generator/Dockerfile

# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with a lightweight web server (nginx)
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output to nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

