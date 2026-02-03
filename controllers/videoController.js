const youtubeService = require("../services/youtubeService");
const favoriteRepo = require("../repositories/favoriteRepository");

class VideoController {
  async show(req, res) {
    const q = (req.query.q || "").trim();
    let results = [];
    let error = null;

    if (q) {
      try {
        results = await youtubeService.search(q);
      } catch (e) {
        error = e.message || "Search failed.";
      }
    }

    const favorites = await favoriteRepo.listByUser(req.session.user.id);

    res.render("videos", {
      q,
      results,
      favorites,
      error,
    });
  }

  async addFavorite(req, res) {
    const { videoId, title, channelTitle, thumbnailUrl } = req.body;

    if (!videoId || !title) {
      return res.redirect("/videos");
    }

    await favoriteRepo.add({
      userId: req.session.user.id,
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
    });

    const redirectTo = req.body.redirectTo || "/videos";
    res.redirect(redirectTo);
  }

  async deleteFavorite(req, res) {
    const favoriteId = req.params.id;
    await favoriteRepo.remove({
      userId: req.session.user.id,
      favoriteId,
    });

    res.redirect("/videos");
  }
}

module.exports = new VideoController();
