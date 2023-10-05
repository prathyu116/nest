import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {


    use(req: any, res: Response, next: NextFunction) {

        


        const authHeaders = req.headers.authorization || (req.headers.Authorization as string);

        if (!authHeaders) {
            return res.status(403).json({
                data: null,
                error: {
                    message: "No authorization header for user",
                },
            });
        }
        const role =["admin"]
        const perm = ["dlt_assigned_study"]
        req.user ={roles:role,permissions:perm}

        next();
    }
}
