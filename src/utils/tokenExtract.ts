import {
    defineEventHandler,
    H3Event,
    getCookie,
    setResponseStatus,
    getQuery,
    getRouterParam,
    sendError,
    createError
} from "h3";
import { H3GetToken } from "../middleware/jwtMiddleware";

/**
 * @name h3Header
 * @description Extracts token from header
 * @returns {EventHandler<H3Event, Promise<string | null>>}
 *
 */
function h3Header() {
    return defineEventHandler(async (event: H3Event) => {
        if (event.node.req.headers.authorization && event.node.req.headers.authorization.split(' ')[0] === 'Bearer') {
            return event.node.req.headers.authorization.split(' ')[1];
        }
        return null
    })
}

/**
 * @name h3Cookie
 * @description Extracts token from cookie
 * @param cookieName
 * @returns {EventHandler<H3Event, Promise<string | null>>}
 *
 */
function h3Cookie(cookieName: string) {
    return defineEventHandler(async (event: H3Event) => {
        const token = getCookie(event, cookieName) as string
        // console.log("cookie", token)
        if (!token) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: "Undefined Token!"
            }))
        }
        return token;
    })
}

const h3CookieToken: H3GetToken = defineEventHandler(async (event: H3Event) => {
    const token = getCookie(event, "token") as string
    // console.log("cookie", token)
    if (!token) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: "Undefined Token!"
        }))
    }
    return token;

})

/**
 * @name h3Query
 * @description Extracts token from query
 * @returns {EventHandler<H3Event, Promise<string | null>>}
 * @example /api/user?token=123456
 * @returns 123456
 *
 *
 */
function h3Query() {
    return defineEventHandler(async (event: H3Event) => {
        const query = getQuery(event)
        // console.log("query", query)
        if (!query) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: "Undefined Token!"
            }))
        }
        const { token} = query
        // console.log("token", token)
        return token
    })
}


export {h3Header, h3Cookie, h3Query, h3CookieToken}