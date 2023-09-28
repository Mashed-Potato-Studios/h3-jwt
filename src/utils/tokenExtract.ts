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


function h3Header() {
    return defineEventHandler(async (event: H3Event) => {
        if (event.node.req.headers.authorization && event.node.req.headers.authorization.split(' ')[0] === 'Bearer') {
            return event.node.req.headers.authorization.split(' ')[1];
        }
        return null
    })
}

function h3Cookie(cookieName: string) {
    return defineEventHandler(async (event: H3Event) => {
        const token = getCookie(event, cookieName)
        // console.log("cookie", token)
        if (!token) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: "Undefined Token!"
            }))
        }
        return token
    })
}

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


export {h3Header, h3Cookie, h3Query}