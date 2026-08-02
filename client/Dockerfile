# 1단계: React 빌드
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_SERVER_URL=

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

RUN npm run build


# 2단계: Nginx로 정적 파일 실행
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]