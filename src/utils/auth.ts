import bcrypt from "bcrypt";

export const hashPassword = async (password : string) => {
    //generamos un salt y luego hasheamos la contraseña
    //un salt es un valor aleatorio que se usa para hacer el hash más seguro
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
}