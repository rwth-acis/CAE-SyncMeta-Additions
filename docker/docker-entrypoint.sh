#!/bin/bash

#### Check environment variables ####
ENV_VARIABLE_NOT_SET=false
check_if_exists () {
    if [[ -z "$1" ]]; then
        echo "$2 env variable is not set"
        ENV_VARIABLE_NOT_SET=true
    fi
}

check_if_exists "$WEBHOST" "WEBHOST"
check_if_exists "$PORT" "PORT"
check_if_exists "$YJS" "YJS"
check_if_exists "$CODEGEN" "CODEGEN"
check_if_exists "$CAE_BACKEND_URL" "CAE_BACKEND_URL"
check_if_exists "$CODE_EDITOR_BOWER" "CODE_EDITOR_BOWER"
check_if_exists "$ROLEHOST" "ROLEHOST"
check_if_exists "$REQBAZ_BACKEND" "REQBAZ_BACKEND"
check_if_exists "$REQBAZ_FRONTEND" "REQBAZ_FRONTEND"

if [ "$ENV_VARIABLE_NOT_SET" = true ] ; then
    echo "Missing environment variables, exiting..."
    exit 1
fi

#### CAE Frontend ####
cd widgets
CONFIG_JS_PATH=src/liveCodeEditorWidget/lib/config.js
cp src/liveCodeEditorWidget/lib/config.js.sample $CONFIG_JS_PATH
sed -i "s=<placeholder_codegen>=$CODEGEN=g" $CONFIG_JS_PATH
sed -i "s=<placeholder_bower_components>=$CODE_EDITOR_BOWER=g" $CONFIG_JS_PATH
sed -i "s=<placeholder_yjs_websocket_server>=$YJS=g" $CONFIG_JS_PATH
grunt --host="$WEBHOST/cae-frontend" --yjsserver=$YJS --caehost=$CAE_BACKEND_URL --reqbazbackend=$REQBAZ_BACKEND --reqbazfrontend=$REQBAZ_FRONTEND
cd ..

#### Syncmeta ####
cd syncmeta
SYNCMETA_CONF=.localGruntConfig.json
cp .localGruntConfig.json.sample $SYNCMETA_CONF
sed -i "s=http://localhost:8081=$WEBHOST/syncmeta=g" .localGruntConfig.json
sed -i "s=http://127.0.0.1:8073=$ROLEHOST=g" .localGruntConfig.json
sed -i "s=http://localhost:1234=$YJS=g" .localGruntConfig.json
grunt build
cd ..

#### Wireframe ####
cd CAE-WireframingEditor
sed -i "s=https://rwth-acis.github.io/CAE-WireframingEditor/role/=$WEBHOST/wireframe/=g" role/app.js
sed -i "s=https://rwth-acis.github.io/CAE-WireframingEditor/role/=$WEBHOST/wireframe/=g" role/yireframe.xml
sed -i "s=room: space || 'yireframe',=room: space || 'yireframe', url: '$YJS'=g" role/app.js
cd ..

##### Nginx ####
cp docker/nginx.conf /etc/nginx/conf.d/default.conf
sed -i "s=<port>=$PORT=g" /etc/nginx/conf.d/default.conf
/etc/init.d/nginx start

#### Supervisor ####
/usr/bin/supervisord -n