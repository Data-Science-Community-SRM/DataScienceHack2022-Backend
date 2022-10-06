import {Request,Response} from 'express';
import Logger from '../../core/Logger';
import { Corporatesubdomains } from '../Assets/Corporate/Corporate';
import { Creativessubdomains } from '../Assets/Creatives/Creatives';
import { BlockchainTaks, MLTasks, Techsubdomains, WebDevTaks } from '../Assets/Tech/Tech';
import { CreateUserInput } from '../schema/user.schema';
import { createUser, findUser, updateUser } from '../service/user.service';


export async function createUserHandler(req:Request<{},{},CreateUserInput["body"]>, res: Response){
    try {
        //@ts-ignore
        const user = await createUser(req.body);
        return res.send(user);
    } catch (e:any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function setSubdomainHandler(req : Request, res : Response){
    try {
        let userId = res.locals.user.user;
        const subdomain = req.body.subdomain;
        const user = await findUser({_id : userId});
        
        //@ts-ignore
        if(user.subdomain === ""){
            const updateduser = await updateUser({_id : userId}, {subdomain : subdomain})
            return res.send(updateduser);
        }else{
            return res.status(403);
        }
    } catch (e:any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function submitProjectLinkHandler(req:Request, res: Response) {
    try {
        let userId = res.locals.user.user;
        const projectlink = req.body.projectlink;
        const updateduser = await updateUser({_id: userId}, {projectlink : projectlink});
        return res.send(updateduser);
    } catch (e:any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function unsubmitProjectLinkHandler(req:Request, res: Response) {
    try {
        let userId = res.locals.user.user;
        const updateduser = await updateUser({_id: userId}, {projectlink : ""});
        return res.send(updateduser);
    } catch (e:any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getSubDomainsHandler(req: Request, res : Response){
    try {
        let userId = res.locals.user.user;
        const user = await findUser({ _id: userId });
        const domain = user!.domain;
        if (domain == "Tech"){
            res.send(Techsubdomains);
        }else if(domain == "Creatives"){
            res.send(Creativessubdomains);
        }else if(domain == "Corpo"){
            res.send(Corporatesubdomains);
        }
    } catch (e : any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getTasksHandler (req:Request, res:Response) {
    try {
        let userId = res.locals.user.user;
        const user = await findUser({ _id: userId });
        const subdomain = user!.subdomain;
        if(subdomain == "Web Dev"){
            res.send(WebDevTaks);
        }else if(subdomain == "AI/ML"){
            res.send(MLTasks);
        }else if(subdomain == "Blockchain"){
            res.send(BlockchainTaks);
        }
    } catch (e:any) {
        Logger.error(e);
        return res.status(409).send(e.message);
    }
}