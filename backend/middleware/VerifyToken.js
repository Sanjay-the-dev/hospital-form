import  jwt from 'jsonwebtoken';


const VerifyToken = (req, res, next)=> {

    const token = req.cookies.cookies;

    if(!token){
        return   res.status(401).json({errorMessage:"Unauthorised"})
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err,decoded)=>{
            if(err){
                return res.status(403).json({message:"Invalid Token"});
            }

            req.user = decoded;

            next();
        }
    )
    
}



export default VerifyToken;