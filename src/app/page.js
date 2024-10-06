"use client";
import { useState, useEffect } from "react";
import CharacterCard from "./components/CharacterCard";
import CharacterPopup from "./components/CharacterPopup";
import mainApi from "./apiService";
import { RequestHelper } from "./helpers/requestHelper";
import { FilterHelper } from "./helpers/filterHelper";

const initialFilters = {
  name: "",
  status: "",
  species: "",
  gender: "",
  episode: "",
};

const ITEMS_PER_PAGE = 10;

export default function Home() {
  //#region states 
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : initialFilters;
  });
  const [episodes, setEpisodes] = useState([]); // все эпизоды
  const [charactersBySearch, setCharactersBySearch] = useState([]); // персонажи по результатам поиска по фильтрам (не эпизодам)
  const [characters, setCharacters] = useState([]); // персонажи для отображения (с учетом всех фильтров)
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  //#endregion

  // all episodes
  useEffect(() => {
    const fetchAllEpisodes = async () => {
      const initialPageNumber = 1;
      
      let episodesFirstPage = [];
      
      try {
        episodesFirstPage = await mainApi.getEpisodesForPage({
          page: initialPageNumber,
        });
  
        const pageCount = episodesFirstPage.info.pages;
        
        // запрашиваем результаты по оставшимся страницам
        const requests = RequestHelper.formRequestsWithPage(
          mainApi.getEpisodesForPage,
          {},
          initialPageNumber + 1,
          pageCount
        );
  
        const results = await Promise.all(requests);
  
        // объединяем результаты первой страницы с оставшимимся (чтобы не делать лишний запрос)
        const allEpisodes = [
          ...episodesFirstPage.results,
          ...results.flatMap(r => r.results)
        ];
  
        return allEpisodes;
      } catch (error) {
        console.error(`Ошибка при получении эпизодов: ${error}`)
        return [];
      }
    };

    if (episodes.length === 0) {
      fetchAllEpisodes().then((allEpisodes) => setEpisodes(allEpisodes));
    }
  }, []);

  const fetchCharacters = async () => {
    const initialPageNumber = 1;

    let charactersFirstPage = {};

    try {
      charactersFirstPage = await mainApi.getFilteredCharacters({
        props: filters,
        page: initialPageNumber,
      });

      const pageCount = charactersFirstPage.info.pages;

      // запрашиваем результаты по оставшимся страницам
      const requests = RequestHelper.formRequestsWithPage(
        mainApi.getFilteredCharacters,
        filters,
        initialPageNumber + 1,
        pageCount
      );

      const results = await Promise.all(requests);

      // объединяем результаты первой страницы с оставшимимся (чтобы не делать лишний запрос)
      const filteredCharacters = [
        ...charactersFirstPage.results,
        ...results.flatMap((r) => r.results),
      ];

      return filteredCharacters;
    } catch (error) {
      console.error(`Ошибка при получении персонажей: ${error}`);
      return [];
    }

    
  };

  const searchCharacters = async () => {
    let characters = await fetchCharacters();

    setCharactersBySearch(characters ?? []);

    if (filters.episode) {
      characters = FilterHelper.filterByEpisode(characters, episodes, filters.episode);
    }

    setCharacters(characters ?? []);
    setCurrentPage(1);
  };

  // изменение полей поиска персонажа. отложенный запрос
  useEffect(() => {
    const timerId = setTimeout(async () => {
      searchCharacters();
    }, 300);

    return () => clearTimeout(timerId);
  }, [filters.name]);

  // изменение полей поиска персонажа. немедленный запрос
  useEffect(() => {
    searchCharacters();
  }, [filters.status, filters.species, filters.gender, episodes]);

  // изменение полей поиска эпизода
  useEffect(() => {
    const timerId = setTimeout(() => {
      const filtered = FilterHelper.filterByEpisode(charactersBySearch, episodes, filters.episode);
      setCharacters(filtered ?? []);
    }, 300);

    return () => clearTimeout(timerId);
  }, [filters.episode]);

  // извлечение фильтров из localStorage
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  // keydown listener
  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  //#region handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      setSelectedCharacter(null);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("overlay")) {
      setSelectedCharacter(null);
    }
  };
  //#endregion

  const totalCharacters = characters.length;
  const totalPages = Math.ceil(totalCharacters / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCharacters = characters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="bg-black p-10 flex justify-center">
      <div className="bg-black text-white min-h-screen p-4 border-2 border-white rounded-[16px] max-w-[940px] w-full">
        <h1 className="text-3xl 2xl:text-4xl font-bold mb-4">
          Вселенная Рик и Морти
        </h1>
        <div className="mb-4 grid grid-cols-1 gap-4">
          <input
            name="name"
            className="bg-black text-white border border-gray-600 placeholder-white p-2 rounded-[8px] mb-2 w-full"
            placeholder="Имя персонажа"
            value={filters.name}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="status"
              className="bg-black text-white border border-gray-600 p-2 rounded-[8px] mb-2 w-full"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Жив?</option>
              <option value="alive">Жив</option>
              <option value="dead">Мёртв</option>
              <option value="unknown">Неизвестно</option>
            </select>
            <select
              name="species"
              className="bg-black text-white border border-gray-600 p-2 rounded-[8px] mb-2 w-full"
              value={filters.species}
              onChange={handleFilterChange}
            >
              <option value="">Раса</option>
              <option value="Human">Человек</option>
              <option value="Alien">Инопланетянин</option>
              <option value="Humanoid">Гуманоид</option>
              <option value="Animal">Животное</option>
              <option value="Robot">Робот</option>
              <option value="Mythological Creature">
                Мифологическое существо
              </option>
            </select>
          </div>

          <select
            name="gender"
            className="bg-black text-white border border-gray-600 p-2 rounded-[8px] mb-2 w-full"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">Пол</option>
            <option value="Female">Женский</option>
            <option value="Male">Мужской</option>
            <option value="Genderless">Без половой принадлежности</option>
            <option value="unknown">Неизвестно</option>
          </select>

          <input
            name="episode"
            className="bg-black text-white border border-gray-600 placeholder-white p-2 rounded-[8px] mb-2 w-full"
            placeholder="Эпизод (S00E00)"
            value={filters.episode}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <p>Найдено {totalCharacters} персонажей</p>

          {currentCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={handleCardClick}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className={`bg-gray-700 text-white p-2 rounded ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
            onClick={() =>
              currentPage > 1 && setCurrentPage((page) => page - 1)
            }
            disabled={currentPage === 1}
          >
            Назад
          </button>

          <button
            className={`bg-gray-700 text-white p-2 rounded ${
              currentPage === totalPages ? "opacity-50" : ""
            }`}
            onClick={() =>
              currentPage < totalPages && setCurrentPage((page) => page + 1)
            }
            disabled={currentPage === totalPages}
          >
            Дальше
          </button>
        </div>

        {selectedCharacter && (
          <CharacterPopup
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
            handleOverlayClick={handleOverlayClick}
          />
        )}
      </div>
    </div>
  );
}
