import express, { type Express, type RequestHandler } from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

export interface ServiceOptions{
    name: string;
    corsOrigins?:string[];
    authenticate?: RequestHandler;
}

export function createService(options: ServiceOptions){
    const app = express();

    app.disable("x-powered-by");
    app.use(helmet());
    app.use(pinoHttp());
    app.use(express.json({limit: "1mb"}));

    if(options.corsOrigins?.length){
        app.use(cors({origin:options.corsOrigins}));
    }

    app.get("/health/live",(_req,res)=>{
        res.json({service:options.name,status:"ok"});
    })

    app.get("/health/ready",(_req,res)=>{
        // Add DB, signing-provider and dependency checks per service.
        res.json({service:options.name,status:"ready"});
    })

    if(options.authenticate){
        app.use("/api",options.authenticate);
    }

    return app;

}