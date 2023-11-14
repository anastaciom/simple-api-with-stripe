export type TImageDto = {
  id: number;
  userPhoto: string;
  userName: string;
  imageType: "photo" | "illustration" | "vector";
  imageUrl: string;
  views: string;
  heigth: number;
  width: number;
};
