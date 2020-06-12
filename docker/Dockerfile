FROM nginx:1.15.7
MAINTAINER mintechai


ARG PROJECT_NAME=galaxy-business-web
ENV TZ=Asia/Shanghai
RUN cp -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo $TZ > /etc/timezone && rm -f /usr/share/nginx/html/* && mkdir /usr/share/nginx/html/dist
ADD ./index.html /usr/share/nginx/html
ADD ./dist /usr/share/nginx/html/dist
ADD ./nginx.conf /etc/nginx
ADD ./default.conf /etc/nginx/conf.d
ENTRYPOINT nginx -g 'daemon off;'
