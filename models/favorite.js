class Favorite {
  constructor({
    id,
    userId,
    videoId,
    title,
    channelTitle,
    thumbnailUrl,
    createdAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.videoId = videoId;
    this.title = title;
    this.channelTitle = channelTitle;
    this.thumbnailUrl = thumbnailUrl;
    this.createdAt = createdAt;
  }
}

module.exports = Favorite;
