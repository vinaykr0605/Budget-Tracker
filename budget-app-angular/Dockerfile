# Stage 1: Build the Angular application
FROM node:22 AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Copy the built application from the 'build' stage.
# The path is /dist/budget-app/browser/ because 'budget-app' is the project name in angular.json
COPY --from=build /usr/src/app/dist/budget-app/browser/ .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
