import { Router } from "express";
import { SearchPhotosController } from "../../controllers/searchPhotos-controller";
import { CheckToken } from "../middlewares/checkToken";

const searchPhotos = Router();

searchPhotos.get(
  "/photos",
  CheckToken.check,
  // checkPermission(["FAVORITE_PHOTO", "LIST_ALL_RESULTS"]), //TODO: ADJUST LATER,
  SearchPhotosController.handle
);

export { searchPhotos };
