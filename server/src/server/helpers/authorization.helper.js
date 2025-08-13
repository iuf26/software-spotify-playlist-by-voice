import bcrypt from "bcrypt";

export const hashCredentials = async (crendentials) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(crendentials);
    return hash;
  } catch (error) {
    throw new Error(error);
  }
};
