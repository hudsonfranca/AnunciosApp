import { User } from './user/user.entity';
import { Category } from './category/category.entity';
import { Adverts } from './adverts/adverts.entity';

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

export const deleteAdvertsAtributes = (adverts: Adverts) => {
  const newAdverts = adverts;
  delete newAdverts.updatedAt;
  delete newAdverts.createdAt;
  delete newAdverts.user.confirmationToken;
  delete newAdverts.user.password;
  delete newAdverts.user.recoverToken;
  delete newAdverts.user.updatedAt;
  delete newAdverts.user.createdAt;
  delete newAdverts.user.address.createdAt;
  delete newAdverts.user.address.updatedAt;
  return newAdverts;
};

export const deleteCategoryAtributes = (category: Category) => {
  const newCategory = category;
  delete newCategory.updatedAt;
  delete newCategory.createdAt;

  return newCategory;
};

export const userSelectAtributes = [
  'user.id',
  'user.name',
  'user.email',
  'user.role',
  'user.phoneNumber',
  'address.id',
  'address.city',
  'address.number',
  'address.street',
  'address.zip',
  'address.uf',
];

export const advertsSelectAtributes = [
  'adverts.id',
  'adverts.name',
  'adverts.price',
  'adverts.description',
  'user.id',
  'user.name',
  'user.email',
  'user.role',
  'user.phoneNumber',
  'category.id',
  'category.name',
];
