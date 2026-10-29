export interface IProduct {
  _id: string;
  name: string;
  price: number;
  slug: string;
  isDeleted: boolean;
  isActive: boolean;
  category: string;
  subCategory: string;
  imgURL: string;
  createdAt: string;
  updatedAt: string;
}
