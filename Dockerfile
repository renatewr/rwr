FROM dr.api.no/amedia/alpine-node:6.7.0

ENV APPNAME tivoli
ADD . /usr/src/app

WORKDIR /usr/src/app

RUN adduser -s /bin/bash -u 1000 -S $APPNAME && \
  chown -R $APPNAME . && \
  rm -f assets/bundles/* && \
  npm install && \
  npm run build-assets && \
  npm prune --production && \
  apk --update del python make expat gdbm sqlite-libs libbz2 libffi g++ gcc && \
  rm -rf /var/cache/apk/*

USER $APPNAME
ENV PORT 9670
EXPOSE $PORT
