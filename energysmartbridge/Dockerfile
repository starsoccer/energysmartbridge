FROM node:22-bullseye-slim AS build

WORKDIR /build
COPY . .

RUN npm install
RUN npm run build
RUN npm run blob
RUN cp $(command -v node) dist

RUN npx postject dist NODE_SEA_BLOB dist.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 

FROM nginx:1.24.0

RUN apt-get update && apt-get install -y openssl

COPY nginx.conf /etc/nginx/nginx.conf

RUN openssl req  -nodes -new -x509 -sha1 -subj '/CN=energysmartwaterheater.com' -keyout /etc/nginx/energysmartwaterheater.com.key -out /etc/nginx/energysmartwaterheater.com.crt -days 3650

COPY --from=build /usr/local/bin/node /usr/local/bin/node
COPY --from=build /build/node_modules /node_modules

COPY --from=build /build/dist ./app
COPY run.sh .

EXPOSE 443/tcp

CMD [ "sh", "run.sh" ]