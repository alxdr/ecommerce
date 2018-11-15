# SimpleCommerce

A simple ecommerce project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure that Node 8 and NPM are installed first, then install all dependencies.

```
npm install
```

and also make a .env file filled with the appropriate values,

```
touch .env
```

and also get a TLS encryption certificate and key to enable HTTPS for CERT_PATH and KEY_PATH in .env,

and also an url to a hosted mongodb instance or your own local one for DB in .env,

and lastly, get a Stripe account and activate its platform feature to get STRIPE_PUBLIC, STRIPE_SECRET, CLIENT_ID in .env

```
# .env file should look something like this

DB=<mongodb uri>
PORT=3000
FAKER_PORT=8080
NODE_ENV=development
SESSION_SECRET=<any random string>
CERT_PATH=<path to cert>
KEY_PATH=<path to key>
STRIPE_SECRET=<stripe secret key>
STRIPE_PUBLIC=<stripe public key>
CLIENT_ID=<stripe client ID>
```

### Running

```
npm start
```

## Running the tests

```
npm test
```

## Built with

Node, Express, Mongoose, React, Passport, Nodemailer, Esm, Axios, Helmet, Csurf, Stripe,
Babel, Parcel, ESLint, Prettier, Jest, Supertest and many others

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
