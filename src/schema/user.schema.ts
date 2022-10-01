import { omit } from 'lodash';
import {string,object,TypeOf, number} from 'zod';

export const createUserSchema = object({
    body : object({
        name : string({
            required_error : "Name is required !!"
        }),
        password: string({
            required_error: "Name is required",
        }).min(6, "Password too short - should be 6 chars minimum"),
        passwordConfirmation: string({
            required_error: "passwordConfirmation is required",
        }),
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        about : string({
            required_error : "About Section is required"
        }).min(100, "Tell us more we don't collect your data :)"),
        contactno : string({
            required_error : "Contact number is required"
        }).length(10, "Enter a valid phone number"),
        github : string({
            required_error : "Github Link is required"
        }),
        linkedin : string({
            required_error : "LinkedIn profile link is required"
        }),
        domain : string({
            required_error : "Domain you entered is needed"
        }),
        subdomain : string().optional(),
        projectlink : string().optional()
    }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
})

const subdomainSchema = {
    body : object({
        subdomain : string({
            required_error : "Sub Domain string is required"
        })
    })
}

const submitProjectSchema ={
    body : object({
        projectlink : string({
            required_error : "Project link is required"
        })
    })
}

export const SetSubDomainSchema = object({...subdomainSchema});
export const SubmitProjectSchema = object({...submitProjectSchema});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.passwordConfirmation">