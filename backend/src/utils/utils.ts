import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Adverts } from '../adverts/adverts.entity';

export const deleteUserAtributes = (user: User) => {
  const newUser = user;
  delete newUser.password;
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
  'user.roles',
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
  'user.roles',
  'user.phoneNumber',
  'category.id',
  'category.name',
  'adverts_photos.id',
  'adverts_photos.originalname',
  'adverts_photos.encoding',
  'adverts_photos.mimetype',
  'adverts_photos.destination',
  'adverts_photos.filename',
  'adverts_photos.path',
  'address.id',
  'address.city',
  'address.number',
  'address.street',
  'address.zip',
  'address.uf',
];


