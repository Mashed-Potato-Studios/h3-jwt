import {EventHandler, EventHandlerRequest, createError, defineEventHandler, getCookie, getHeaders, sendError } from "h3";
import jwt, {Secret} from "jsonwebtoken";
import { h3Header, h3Query, h3Cookie } from "../utils/tokenExtract";

function h3JwtMiddleware({options}: {
    options: {
        secretKey: string;
        getToken: EventHandler<EventHandlerRequest, Promise<void>>
    }
}) {
    const getToken = options.getToken || h3Header();
    return defineEventHandler(async (event) => {
        try {
            const token = await getToken(event);
            // @ts-ignore
            if (!token) {
                return sendError(event, createError({
                    statusCode: 401,
                    statusMessage: "Invalid Token!"
                }))
            }
            const decoded = jwt.verify(token, options.secretKey);
            event.context.user = decoded;
        }
        catch (error) {
            console.error(error);
        }
    })
}

export default h3JwtMiddleware;