import {createApp, eventHandler, toNodeListener,} from "h3";
import { createServer } from "node:http";
import jwtMiddleware from "../src/middleware/jwtMiddleware";

const app = createApp();
const port = process.env.PORT || 3000;
 const secret = process.env.JWT_SECRET || "secret"


// app.use(jwtMiddleware(secret))
app.use('/protected', eventHandler((event) => {
      return {
            message: "Protected route"
        }
}))
app.use('/', eventHandler((event) => {
    console.log(event.node.req)
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