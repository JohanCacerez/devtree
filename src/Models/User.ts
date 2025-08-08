import mongoose, { Schema } from "mongoose";

//definir una interfaz para el modelo de usuario
//esto es para que TypeScript sepa qué propiedades tendrá el modelo de usuario
export interface IUser{
    handle: string;
    name: string;
    email: string;
    password: string;
}

//definir el esquema del modelo de usuario
//esto es para que Mongoose sepa cómo se verá el modelo de usuario en la base
const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }

})

//definir el modelo de usuario
//esto es para que Mongoose sepa cómo se verá el modelo de usuario en la base
const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
