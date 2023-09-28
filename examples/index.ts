import {createApp, eventHandler, toNodeListener,} from "h3";
import { createServer } from "node:http";
import h3Jwt from "../src/middleware/jwtMiddleware";
import {h3Cookie, h3Header, h3Query} from "../src";

const app = createApp();
const port = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET || "SECRET"


app.use(h3Jwt({
    options: {
        secretKey: secret,
        getToken: h3Header()
    }
}))
app.use('/protected', eventHandler((event) => {
      return {
            message: "Protected route"
        }
}))
app.use('/', eventHandler((event) => {
    // console.log(event._headers)
    return {
        message: "Hello World"
    }
}))

const server = createServer(toNodeListener(app));
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

export default app;