export class FilterHelper {
  static _getIdFromUrl = (str) => {
    const match = str.match(/\/([^\/]*)$/);
    return match ? Number(match[1]) : Number(str);
  };

  static filterByEpisode = (characters, allEpisodes, episodeInputValue) => {
    if (!characters || !episodeInputValue) {
      return characters;
    }

    const episodeIds = allEpisodes
      .filter((e) => e.episode.toUpperCase() === episodeInputValue.toUpperCase())
      .map((e) => e.id);

    characters = characters.filter((ch) => {
      const characterEpisodeIds = ch.episode.map((e) => this._getIdFromUrl(e));
      return characterEpisodeIds.includes(episodeIds[0]);
    });

    return characters;
  };
}
