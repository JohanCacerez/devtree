import jwt, {JwtPayload} from 'jsonwebtoken';

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h' // Puedes ajustar el tiempo de expiración según tus necesidades
    })
    return token;
}