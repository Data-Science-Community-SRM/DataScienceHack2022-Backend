import { Express,Request, Response} from "express";
import { createUserSessionHandler, deleteSessionsHandler, getUserSessionsHandler } from "./controller/session.controller";
import { createUserHandler, setSubdomainHandler, submitProjectLinkHandler, unsubmitProjectLinkHandler,getSubDomainsHandler, getTasksHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResources";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema, SetSubDomainSchema, SubmitProjectSchema } from "./schema/user.schema";

export default function (app: Express) {
    app.get("/healthCheck",(req:Request, res:Response) => {
        res.sendStatus(200);
    })

    // SESSION ROUTES
    // --------------

    // Login User
    app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler);
    // Get User Sessions
    app.get('/api/sessions',requireUser,getUserSessionsHandler);
    // Delete User Sessions
    app.delete('/api/sessions', requireUser, deleteSessionsHandler);

    // USER ROUTES
    // -----------

    // Register User
    app.post('/api/register', validate(createUserSchema), createUserHandler);
    // Get Sub Domains
    app.get('/api/getsubdomains', requireUser, getSubDomainsHandler);
    // Set Sub Domain
    app.post('/api/setsubdomain', [requireUser,validate(SetSubDomainSchema)], setSubdomainHandler);
    // Submit Project
    app.post('/api/submitproject', [requireUser, validate(SubmitProjectSchema)], submitProjectLinkHandler);
    // Unsubmit Project
    app.options('/api/unsubmitproject', requireUser, unsubmitProjectLinkHandler);

    // TASK ROUTES
    // -----------

    // get tasks 
    app.get('/api/gettask', requireUser, getTasksHandler);
}