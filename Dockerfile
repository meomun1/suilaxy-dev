FROM node:22-alpine as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

# server environment
FROM nginx:1.19
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=react-build /app/build /usr/share/nginx/html