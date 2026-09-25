export const ApplicationException = ({
    message ="error",
    options={
        cause : {status : 400}
    }
}={})=>{
    throw new Error(message , options)
}

export const ConflictException = (message = "Conflict", issues={})=>{
    return ApplicationException({
        message,
        options:{
            cause :{status:409 , issues}
        }
    })
}

export const notFoundException = (message = "Notfound", issues={})=>{
    return ApplicationException({
        message,
        options:{
            cause :{status:404 , issues}
        }
    })
}

export const BadException = (message = "Bad request exception", issues={})=>{
    return ApplicationException({
        message,
        options:{
            cause :{status:400 , issues}
        }
    })
}

export const UnauthorizedException = (message = "Unauthorized", issues={})=>{
    return ApplicationException({
        message,
        options:{
            cause :{status:401 , issues}
        }
    })
}

export const ForbiddenException = (message = "Forbidden", issues={})=>{
    return ApplicationException({
        message,
        options:{
            cause :{status:403 , issues}
        }
    })
}