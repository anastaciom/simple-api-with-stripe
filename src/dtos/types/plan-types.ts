interface IFeaturesList {
  [key: string]: string | boolean;
  disabled: boolean;
}

export type TPlanDto = {
  createdAt?: Date;
  description?: string;
  id?: string;
  isActive: boolean;
  name: string;
  price: number;
  priceId: string;
  themeColor: string;
  featuresList: IFeaturesList[];
  typeOfCharge: string;
  updatedAt?: Date;
};
