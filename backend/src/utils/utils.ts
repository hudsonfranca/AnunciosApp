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
  delete newAdverts.user.password;
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
  'user.first_name',
  'user.last_name',
  'user.email',
  'user.roles',
  'user.phone_number',
  'address.id',
  'address.city',
  'address.number',
  'address.street',
  'address.zip',
  'address.state',
  'address.neighborhood',
];

export const advertsSelectAtributes = [
  'adverts.id',
  'adverts.name',
  'adverts.price',
  'adverts.description',
  'user.id',
  'user.first_name',
  'user.last_name',
  'user.email',
  'user.roles',
  'user.phone_number',
  'category.id',
  'category.name',
  'adverts_photos.id',
  'adverts_photos.originalname',
  'adverts_photos.filename',
  'adverts_photos.url',
  'address.id',
  'address.city',
  'address.number',
  'address.street',
  'address.zip',
  'address.state',
  'address.neighborhood',

];


