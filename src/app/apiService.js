class MainApi {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getResponseData = (res) => {
    return res.ok ? res.json() : Promise.reject(res.status);
  };

  getFilteredCharacters = async ({ props, page }) => {
    const requestData = { ...props, page };
    const params = new URLSearchParams(requestData).toString();
    const res = await fetch(`${this._baseUrl}/character?${params}`);
    return this._getResponseData(res);
  };

  getEpisodesForPage = async ({ page }) => {
    const res = await fetch(`${this._baseUrl}/episode?page=${page}`);
    return this._getResponseData(res);
  };
}

const config = {
  baseUrl: "https://rickandmortyapi.com/api",
};

const mainApi = new MainApi(config);

export default mainApi;
