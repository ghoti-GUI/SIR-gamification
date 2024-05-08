# Backend for the project

## Setup
### Requirements
- Node.js

### Install dependencies

```bash
npm install
```

### Create .env file
Create a .env file in the root directory of the project and add the following variables:
```
FRONTEND_URL=<your frontend url>
MONOGO_URI=<your mongo uri>
ENV=<dev|prod>
```

### Generate certificates
Generate certificates for HTTPS:
```bash
openssl req -nodes -new -x509 -keyout selfsigned.key -out selfsigned.cert
```

### Run the server
To run the server in development mode:
```bash
npm run dev
```

To run the server in production mode:
```bash
npm run start
```

## API Documentation
Refer to the [API documentation](dreimert.github.io/gamification/api) for more information on the API.
