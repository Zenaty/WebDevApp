const youtubeService = require("../services/youtubeService");
const favoriteRepo = require("../repositories/favoriteRepository");

function wantsJson(req) {
  const accept = req.headers.accept || "";
  return accept.includes("application/json");
}

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

  // NEW: return favorites as JSON (for no-refresh UI updates)
  async favoritesJson(req, res) {
    const favorites = await favoriteRepo.listByUser(req.session.user.id);
    return res.json({ ok: true, favorites });
  }

  async addFavorite(req, res) {
    const { videoId, title, channelTitle, thumbnailUrl } = req.body;

    if (!videoId || !title) {
      if (wantsJson(req))
        return res.status(400).json({ ok: false, error: "Missing fields" });
      return res.redirect("/videos");
    }

    await favoriteRepo.add({
      userId: req.session.user.id,
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
    });

    if (wantsJson(req)) {
      return res.json({ ok: true });
    }

    const redirectTo = req.body.redirectTo || "/videos";
    return res.redirect(redirectTo);
  }

  async deleteFavorite(req, res) {
    const favoriteId = req.params.id;

    await favoriteRepo.remove({
      userId: req.session.user.id,
      favoriteId,
    });

    if (wantsJson(req)) {
      return res.json({ ok: true });
    }

    return res.redirect("/videos");
  }
}

module.exports = new VideoController();
