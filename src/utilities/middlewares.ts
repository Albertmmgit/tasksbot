import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; 
  
    
    if (!token) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({ message: "Token inválido."});
        }

        req.userId = decoded.user_id; 
    
     
        next(); 
    });
};
