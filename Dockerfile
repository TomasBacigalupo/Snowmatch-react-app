# # build env
# FROM node:13.12.0-alpine as build
# WORKDIR /app
# COPY package*.json ./
# #RUN npm ci
# COPY . ./
# RUN npm run deploy-pi

# development env
FROM nginx:stable-alpine
COPY  ./build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# production env
# FROM ckulka/rpi-nginx
# COPY --from=build /app/build /usr/share/nginx/html
# COPY ./deploy/nginx/nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]