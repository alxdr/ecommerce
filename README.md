# SimpleCommerce

A simple ecommerce project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install all dependencies first

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
DB=
PORT=3000
FAKER_PORT=8080
NODE_ENV=development
SESSION_SECRET=random
CERT_PATH=
KEY_PATH=
STRIPE_SECRET=
STRIPE_PUBLIC=
CLIENT_ID=
```

### Running

```
npm start
```

## Running the tests

```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
