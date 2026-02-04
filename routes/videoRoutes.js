const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const videoController = require("../controllers/videoController");

router.get("/videos", requireAuth, (req, res) =>
  videoController.show(req, res),
);

router.post("/videos/favorites", requireAuth, (req, res) =>
  videoController.addFavorite(req, res),
);

router.post("/videos/favorites/:id/delete", requireAuth, (req, res) =>
  videoController.deleteFavorite(req, res),
);

router.get("/videos/favorites/json", requireAuth, (req, res) =>
  videoController.favoritesJson(req, res),
);

module.exports = router;
