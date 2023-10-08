# H3JWT

A simple and flexible JWT middleware for H3 applications. [H3](https://github.com/unjs/h3) is a minimal h(ttp) framework built for high performance and portability.

![jwt compatible](http://jwt.io/img/badge-compatible.svg
)



## Table of Contents]

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic usage](#basic-usage)
  - [Custom Token Extraction](#custom-token-extraction)
  - [Configuration Options](#configuration-options)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Token extraction from headers, cookies, and query parameters.
- Customizable token extraction.
- TypeScript support.

## Installation

```bash
npm install h3-jwt --save
```

## Usage

### Basic usage

```typescript
import {createApp, eventHandler, toNodeListener,} from "h3";
import {createServer} from "node:http";
import h3Jwt from "../src/middleware/jwtMiddleware";

const app = createApp();
const port = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET || "secret"

app.use("/", eventHandler((event) => {

app.use('/hello', eventHandler((event) => {
        // console.log(event._headers)
        return {
            message: "Hello World"
        }
    }))


 app.use('/login', eventHandler((event) => {
        // console.log(event._headers)
        return {
            message: "Login"
        }
    }))

    app.use(h3Jwt({
        secretKey: secret,
        getToken: h3Cookie("token"),
        algorithms: ["HS256"]
}))

    app.use('/protected', eventHandler((event) => {

        return {
                message: "Protected route"
            }
}))

}))
```

### Custom Token Extraction

```typescript
import { h3Jwt, fromHeader, fromCookie } from 'h3-jwt';

app.use('/protected', h3Jwt({
  secret: 'YOUR_SECRET_KEY',
  getToken: (event) => {
    return h3Header() || h3Cookie('cookieName') || h3Query('queryName');
  }
}));
```

## Configuration Options

Detail the options users can pass to your middleware, like:

- **secret** (string): Secret key for JWT decoding. **Required**.
- **getToken** (Function): Custom function for token extraction. Defaults to extraction from the `Authorization` header.



## Testing

This package is thoroughly tested. To run tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This package is licensed under the MIT License. See the `LICENSE` file for details.

---

