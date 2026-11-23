# Multi-architecture lightweight production web server
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Clean default nginx website
RUN rm -rf ./*

# Copy web assets
COPY index.html styles.css script.js ./
COPY images/ ./images/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
