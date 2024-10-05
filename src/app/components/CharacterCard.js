export default function CharacterCard({ character, onClick }) {
    return (
        <div 
          onClick={() => onClick(character)} 
          key={character.id} 
          className="p-4 flex items-center justify-between border border-gray-600 rounded-[8px] h-[40px] cursor-pointer">
            <span className="text-[22px] font-bold">{character.name}</span>
            <span className="text-[20px]">Статус: {character.status}</span>
            <span className="text-[20px]">Раса: {character.species}</span>
        </div>
    );
}