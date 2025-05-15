# baixar o node
FROM node:18-alpine AS build

# copiar os arquivos base do projeto e rodar o build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# baixar o nginx e roda o servidor
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
