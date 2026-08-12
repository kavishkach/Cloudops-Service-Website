FROM nginx:1.29-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY src/ /usr/share/nginx/html/

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1

EXPOSE 80