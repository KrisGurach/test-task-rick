"use client";
import { useState, useEffect } from "react";
import CharacterCard from "./components/CharacterCard";
import CharacterPopup from "./components/CharacterPopup";
import mainApi from "./apiService";

const initialFilters = {
  name: "",
  status: "",
  species: "",
  gender: "",
  episode: "",
};

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : initialFilters;
  });
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
    const fetchCharacters = async () => {
      let data = {};
      
      try {
        data = await mainApi.getFilteredCharacters(filters);
      } catch (errorCode) {
        if (errorCode !== 404) {
          console.error("Ошибка при получении персонажей:", error);
        }
      }

      return data;
    };

    const timerId = setTimeout(async () => {
      let allCharacters = await fetchCharacters();

      if (filters.episode) {

      }

      setCharacters(allCharacters?.results ?? []);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timerId);
  }, [filters]);

  useEffect(() => {
    const fetchAllEpisodes = async () => {
      const episodes = await mainApi.getAllEpisodes();
      setEpisodes(episodes);
    };

    if (episodes.length === 0) {
      fetchAllEpisodes();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

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

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const totalCharacters = characters.length;
  const totalPages = Math.ceil(totalCharacters / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCharacters = characters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="bg-black p-10">
      <div className="bg-black text-white min-h-screen p-4 border-2 border-white rounded-[16px]">
        <h1 className="text-3xl font-bold mb-4">Вселенная Рик и Морти</h1>
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
              <option value="Mythological Creature">Мифологическое существо</option>
              
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
          {currentPage > 1 && (
            <button
              className="bg-gray-700 text-white p-2 rounded"
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Назад
            </button>
          )}
          {currentPage < totalPages && (
            <button
              className="bg-gray-700 text-white p-2 rounded"
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Дальше
            </button>
          )}
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