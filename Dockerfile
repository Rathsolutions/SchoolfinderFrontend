FROM nginx:latest
COPY dist /usr/share/nginx/html
COPY nginxConfig/default /etc/nginx/conf.d/default.conf
