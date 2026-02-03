const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
  async listByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM Favorites WHERE userId = ? ORDER BY createdAt DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map((r) => new Favorite(r)));
        },
      );
    });
  }

  async add({ userId, videoId, title, channelTitle, thumbnailUrl }) {
    const createdAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO Favorites (userId, videoId, title, channelTitle, thumbnailUrl, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          videoId,
          title,
          channelTitle || null,
          thumbnailUrl || null,
          createdAt,
        ],
        function (err) {
          if (err) return reject(err);

          // if ignored (already exists), fetch existing row
          if (this.changes === 0) {
            db.get(
              `SELECT * FROM Favorites WHERE userId = ? AND videoId = ?`,
              [userId, videoId],
              (err2, row) => {
                if (err2) return reject(err2);
                resolve(row ? new Favorite(row) : null);
              },
            );
            return;
          }

          resolve(
            new Favorite({
              id: this.lastID,
              userId,
              videoId,
              title,
              channelTitle,
              thumbnailUrl,
              createdAt,
            }),
          );
        },
      );
    });
  }

  async remove({ userId, favoriteId }) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
        [favoriteId, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        },
      );
    });
  }
}

module.exports = new FavoriteRepository();
