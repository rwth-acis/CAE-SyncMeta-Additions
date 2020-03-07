FROM node:8
USER root

ENV PORT 8070
ENV REQBAZ_BACKEND https://requirements-bazaar.org/bazaar
ENV REQBAZ_FRONTEND https://requirements-bazaar.org

WORKDIR /usr/src/app
COPY . .

RUN apt-get update

RUN apt-get install -y --no-install-recommends supervisor git nginx
RUN npm_config_user=root npm install -g bower grunt-cli grunt polymer-cli

COPY docker/supervisorConfigs /etc/supervisor/conf.d

WORKDIR /usr/src/app/cae-app
RUN npm install && bower install --allow-root

WORKDIR /usr/src/app/widgets
RUN npm install && bower install --allow-root

WORKDIR /usr/src/app
RUN git clone https://github.com/rwth-acis/syncmeta.git

# TODO: Use master branch
WORKDIR /usr/src/app/syncmeta
RUN git checkout develop && npm install && bower install --allow-root

WORKDIR /usr/src/app
RUN git clone https://github.com/rwth-acis/CAE-WireframingEditor.git

# TODO: Use master branch
WORKDIR /usr/src/app/CAE-WireframingEditor
RUN git checkout develop && npm install

WORKDIR /usr/src/app
COPY docker/docker-entrypoint.sh docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
