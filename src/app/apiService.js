class MainApi {
    constructor({ baseUrl }) {
        this._baseUrl = baseUrl;
    }

    _getResponseData = (res) => {
        return res.ok ? res.json() : Promise.reject(res.status);
    };

    getFilteredCharacters = async (filters) => {
        const params = new URLSearchParams(filters).toString();
        const res = await fetch(`${this._baseUrl}/character?${params}`);
        return this._getResponseData(res);
    };

    getFilteredEpisodes = async (filters) => {
        const params = new URLSearchParams(filters).toString();
        const res = await fetch(`${this._baseUrl}/episode?${params}`);
        return this._getResponseData(res);
    };

    getEpisodesForPage = async (page) => {
        const res = await fetch(`${this._baseUrl}/episode?page=${page}`);
        return this._getResponseData(res);
    }
}

const config = {
    baseUrl: "https://rickandmortyapi.com/api",
};

const mainApi = new MainApi(config);

export default mainApi;
