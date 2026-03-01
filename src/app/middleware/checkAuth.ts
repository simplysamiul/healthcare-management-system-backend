/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth = (...authRole: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = cookieUtils.getCookie(req, "better-auth.session-token");
        if (!sessionToken) {
            throw new Error("Unauthorized access! No session token provided.");
        }

        if (sessionToken) {
            const sessionExist = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },

                include: {
                    user: true
                }
            })

            if (sessionExist && sessionExist.user) {
                const user = sessionExist.user;
                const now = new Date();
                const expiresAt = new Date(sessionExist.expiresAt)
                const createdAt = new Date(sessionExist.createdAt)

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const parcentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (parcentRemaining < 20) {
                    res.setHeader('X-Session-Referesh', 'true');
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is not active.')
                }

                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is deleted.')
                }

                if (authRole.length > 0 && !authRole.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, "Forbidden access ! You don't have permisson to access this resource.")
                }

                return next();
            }

            const accessToken = cookieUtils.getCookie(req, "accessToken");

            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.')
            }
        }

        const accessToken = cookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.')
        }
        const verifiedToken = jwtUtils.verifiyToken(accessToken, envVars.ACCESS_TOKEN_SECRET)
        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.')
        }
        if (authRole.length > 0 && !authRole.includes(verifiedToken.data!.role as Role  )) {
            throw new AppError(status.FORBIDDEN, "Forbidden access! You don't have permission to access this resource.")
        }

        next();
    } catch (error: any) {
        next(error)
    }
}