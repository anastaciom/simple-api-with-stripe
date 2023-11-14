import { Router } from "express";
import { CheckToken } from "../middlewares/checkToken";
import { SearchImagesController } from "../../controllers/searchImages-controller";

const searchImages = Router();

searchImages.get(
  "/images",
  CheckToken.check,
  // checkPermission(["FAVORITE_PHOTO", "LIST_ALL_RESULTS"]), //TODO: ADJUST LATER,
  SearchImagesController.handle
);

export { searchImages };
