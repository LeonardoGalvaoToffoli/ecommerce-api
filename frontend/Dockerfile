# --- Stage 1: build --------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# A URL da API e injetada em build-time (Vite resolve VITE_API_URL no bundle)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: nginx --------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx ja roda como root no foreground por padrao; mantemos o entrypoint default
