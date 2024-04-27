import bcrypt from "bcrypt"

// Encrypt the password using bcrypt.
export const encryptedPwd = async (password) => await bcrypt.hash(password, 12);

// Check for the password validation.
export const passwordMatch = async (clientPass, dbPass) => await bcrypt.compare(clientPass, dbPass);

