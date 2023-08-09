import * as bcrypt from 'bcrypt';

const salt = 12;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  enteredPassword: string,
  targetPassword: string,
) => {
  return await bcrypt.compare(enteredPassword, targetPassword);
};
