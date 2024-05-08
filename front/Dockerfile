FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build

FROM ubuntu:latest
RUN mkdir /app
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build-stage /app/dist/front/browser/ /app
COPY nginx.conf /etc/nginx/nginx.conf
RUN adduser --disabled-password --gecos "" nginx
RUN chown -R nginx:nginx /app /var/log/nginx /var/lib/nginx /etc/nginx
RUN touch /tmp/nginx.pid && chown -R nginx:nginx /tmp/nginx.pid

#RUN nginx -t
RUN service nginx restart
#RUN service nginx reload

USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

