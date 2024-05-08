import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
    const decodedToken = jwt.decode(token);

    return decodedToken;
}