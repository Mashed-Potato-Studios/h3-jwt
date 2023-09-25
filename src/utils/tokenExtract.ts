import {defineEventHandler, H3Event, getCookie, setResponseStatus, getQuery, getRouterParam} from "h3";


function h3Header() {
    return defineEventHandler(async (event: H3Event) => {
        if (event.node.req.headers.authorization && event.node.req.headers.authorization.split(' ')[0] === 'Bearer') {
            return event.node.req.headers.authorization.split(' ')[1];
        }
    })
}

function h3Cookie(cookieName: string) {
    return defineEventHandler(async (event: H3Event) => {
        const token = getCookie(event, cookieName)
        if (token) {
            return token
        }
    })
}

function h3Query(queryName: string) {
    return defineEventHandler(async (event: H3Event) => {
        const token = getRouterParam(event, queryName)
        if (token) {
            return token
        }
    })
}


export {h3Header, h3Cookie, h3Query}