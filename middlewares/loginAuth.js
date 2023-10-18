exports.isAuth = (AccessPermission = false)=>{
    return (req, res, next) => {
        if(!req.session.user){
            let error = new Error('Not authenticated.');
            error.statusCode = 401;
            error.message = 'notLogin';
            throw error;
        }
        if(req.session.user.isAdmin){
            next();
        }else{
            if(AccessPermission === false){
                let error = new Error('Not authenticated.');
                error.statusCode = 403;
                error.message = 'notAccessible';
                throw error;
            }
            next();
        }

    }    
}


