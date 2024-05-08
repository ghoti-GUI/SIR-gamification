# Installation

- Install Node.js 20
- Install Nginx
- Install MongoDB
- Install PM2

## Nginx Configuration

Remove the default configuration file:

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Create two new configuration files:
- `/etc/nginx/sites-available/frontend`
- `/etc/nginx/sites-available/backend`

with the following content:

- Frontend: 
```nginx
server{
    listen 80 default_server;
    server_name syd.insa-lyon.fr; # Change this to the domain name of your server
    return 301 https://syd.insa-lyon.fr$request_uri; # Change this to the domain name of your server
}

server{
    listen 443 ssl default_server;
    server_name syd.insa-lyon.fr; # Change this to the domain name of your server
    ssl_certificate /etc/ssl/certs/server.crt; # Change this to the path of the certificate
    ssl_certificate_key /etc/ssl/certs/server.key; # Change this to the path of the certificate key
    gzip on;
    gzip_types      text/plain application/json;
    root   /app/front; # Change this to the path of the frontend

    location / {
      index  index.html;
      try_files $uri $uri/ /index.html;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }
    location ~* (\.html|\/sw\.js)$ {
      expires -1y;
      add_header Pragma "no-cache";
      add_header Cache-Control "public";
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|json)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
}
```
- Backend:
```nginx
server{
    listen 80;
    server_name api.syd.insa-lyon.fr; # Change this to the domain name of the backend
    return 301 https://api.syd.insa-lyon.fr$request_uri; # Change this to the domain name of the backend
}

server{
    listen 443 ssl;
    server_name api.syd.insa-lyon.fr; # Change this to the domain name of the backend
    ssl_certificate /etc/ssl/certs/server.crt; # Change this to the path of the certificate
    ssl_certificate_key /etc/ssl/certs/server.key; # Change this to the path of the certificate key
    gzip on;
    gzip_types      text/plain application/json;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass https://127.0.0.1:3000;
    }
}
```

Then, create a symbolic link to enable the configuration files:

```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/frontend
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/backend
```

Finally, restart Nginx:

```bash
sudo service nginx restart
```

## MongoDB Configuration

Create a database named `syd` and a user with read and write access to this database.

## Backend Configuration
Copy the `backend` folder to the server.
Create a `.env` file in the `backend` folder with the following content:

```bash
FRONTEND_URL=the url of the frontend
MONGO_URI=mongodb://user:password@localhost:27017/syd
ENV=prod
ACCESS_TOKEN_SECRET=a strong secret
COOKIE_SECRET=another strong secret
CERTIFICATE_PATH=path to the certificate
CERTIFICATE_KEY_PATH=path to the certificate key
```

Install the dependencies:

```bash
npm install
```

Start the backend:

```bash
pm2 start app.js --name syd-backend
```

## Frontend Configuration

Build the frontend:

```bash
npm run build
```

Copy the `dist/front/browser` folder to the server.


## PM2 Configuration

With the backend running, save the current processes:

```bash
pm2 save
```

Then, generate the startup script:

```bash
pm2 startup
```

Finally, restart the backend:

```bash
pm2 restart syd-backend
```


