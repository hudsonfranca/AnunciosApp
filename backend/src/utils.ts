import { User } from './user/user.entity';

export const deleteUserAtributes = (user: User) => {
  const newUser = user;
  delete newUser.confirmationToken;
  delete newUser.password;
  delete newUser.recoverToken;
  delete newUser.updatedAt;
  delete newUser.createdAt;
  delete newUser.address.createdAt;
  delete newUser.address.updatedAt;
  return newUser;
};

export const userSelectAtributes = [
  'user.id',
  'user.name',
  'user.email',
  'user.phoneNumber',
  'address.id',
  'address.city',
  'address.number',
  'address.street',
  'address.zip',
  'address.uf',
];
