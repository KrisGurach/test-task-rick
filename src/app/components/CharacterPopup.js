export default function CharacterPopup({ character, onClose, handleOverlayClick }) {
    return (
        <div 
          onClick={handleOverlayClick}
          className="overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-lg border-2 border-white shadow-lg max-w-[90%] max-h-[80vh] overflow-auto">
                <h2 className="text-xl font-bold mb-2">{character.name}</h2>
                <p className="mb-2">Статус: {character.status}</p>
                <p className="mb-2">Раса: {character.species}</p>
                <p className="mb-2">Пол: {character.gender}</p>
                <p className="mb-4">Локация: {character.location.name}</p>
                <img src={character.image} alt="изображение персонажа" className="mb-4 w-full h-auto rounded" />
                <button 
                    onClick={onClose} 
                    className="bg-gray-700 text-white p-2 rounded transition"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}
