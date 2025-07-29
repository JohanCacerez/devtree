import bcrypt from "bcrypt";

//esta función recibe una contraseña y devuelve un hash de la contraseña
export const hashPassword = async (password : string) => {
    //generamos un salt y luego hasheamos la contraseña
    //un salt es un valor aleatorio que se usa para hacer el hash más seguro
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
}

//esta función recibe una contraseña y un hash de la contraseña y devuelve true si la contraseña es correcta
export const checkPassword = async (password: string, hashedPassword: string) => {
    //comparamos la contraseña con el hash
    return await bcrypt.compare(password, hashedPassword);
}