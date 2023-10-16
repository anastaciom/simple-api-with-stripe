import { TImageDto } from "./types/image-types";

export class ImageDto {
  constructor(data: TImageDto) {
    Object.assign(this, data);
  }
}
