import {
    EventHandler,
    EventHandlerRequest,
    createError,
    defineEventHandler,
    getCookie,
    getHeaders,
    sendError,
    H3Event
} from "h3";
import jwt, {Secret, Jwt, Algorithm, VerifyOptions, GetPublicKeyOrSecret} from "jsonwebtoken";
import { h3Header, h3Query, h3Cookie } from "../utils/tokenExtract";


/**
 * @type {H3VerifyKey}
 * @description A function that determines how the functon will extract the token from the request
 * @param {EventHandler} request
 */
export type H3VerifyKey = (event: H3Event, token: Jwt | undefined) => Secret | undefined | Promise<Secret | undefined>

/**
 * @type {H3VerifyCallback}
 * @description A function that take error and decoded token as parameters
 */
export type H3VerifyCallback = (request: EventHandlerRequest,error: Error) => void

export type H3isTokeRevoked = (event: H3Event, decodedToken: Jwt | undefined) => boolean | Promise<boolean>

/**
 * @type {H3GetToken}
 * @description A function that determines how the functon will extract the token from the request
 * @param {H3Event}
 */

export type H3GetToken = (event: H3Event) => string | undefined | Promise<string | void>

export type H3JwtOptions = {
    /**
     * @type {Secret | H3VerifyKey}
     * @description A function that determines how the functon will extract the token from the request
     */
    secretKey: Secret | H3VerifyKey,

    /**
     * @type {getToken}
     * @description A function that determines how the functon will extract the token from the request
     */
    getToken?: H3GetToken,

    /**
     * @description Verifies if token is revoked
     */
    isTokenRevoked?: H3isTokeRevoked
    authorizationRequired?: boolean
    eventRequestProperty?: string

    algorithms?: Algorithm[]

    audience?: string | string[]

    issuer?: string

    onExpired?: H3VerifyCallback
} & VerifyOptions;


/**
 * @name h3Jwt
 * @description Returns a H3 middleware that will verify the token
 * @param options {H3JwtOptions}
 * @returns {EventHandler<H3Event, Promise<string | void>>}
 */
function h3Jwt(options: H3JwtOptions) {

    return defineEventHandler(async (event) => {
        if (!options?.secretKey) {
            return sendError(event, createError({
                statusMessage: "secretKey is required!"
            }))
        }
        if (!options.algorithms) {
            return sendError(event, createError({
                statusMessage: "algorithms is required!"
            }))
        }
        if (!Array.isArray(options.algorithms)) {
            return sendError(event, createError({
                statusMessage: "algorithms must be an array!"
            }))
        }

        const H3VerifyKey: H3VerifyKey = typeof options.secretKey === 'function' ? options.secretKey : async () => options.secretKey as Secret;

        const authorizationRequired = typeof options.authorizationRequired === 'undefined' ? true : options.authorizationRequired;

        const eventRequestProperty = typeof options.eventRequestProperty === 'string' ? options.eventRequestProperty : 'auth';

        const getToken = options.getToken || h3Header();
        try {
            const token = await getToken(event);
            // @ts-ignore
            if (!token) {
                if (authorizationRequired) {
                    return sendError(event, createError({
                        statusCode: 401,
                        statusMessage: "Undefined Token!"
                    }))
                } else {
                    return;
                }
            }
            let decoded: Jwt;

            try {
                decoded = jwt.decode(token, { complete: true }) as Jwt;
                const secret = await H3VerifyKey(event, decoded);

                // @ts-ignore
                jwt.verify(token, secret, options);

                const isTokenRevoked = options.isTokenRevoked && await options.isTokenRevoked(event, decoded) || false;

                if (isTokenRevoked) {
                    return sendError(event, createError({
                        statusCode: 401,
                        statusMessage: "Token Revoked!"
                    }))
                }

                event.context.auth = eventRequestProperty
                event.context.decodedToken = decoded.payload
            } catch (e) {
                sendError(event, createError({
                    statusCode: 401,
                    statusMessage: "Invalid Token!"
                }))
            }
        }
        catch (error) {
            console.error(error);
        }
    })
}

export default h3Jwt;