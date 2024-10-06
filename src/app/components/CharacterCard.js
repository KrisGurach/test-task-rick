export default function CharacterCard({ character, onClick }) {
    return (
        <div 
          onClick={() => onClick(character)} 
          key={character.id} 
          className="p-4 flex items-center justify-between border border-gray-600 rounded-[8px] min-h-[40px] max-h-[80px] cursor-pointer">
            <span className="text-[22px] font-bold mr-[20px]">{character.name}</span>
            <span className="text-[20px] mr-[20px]">Статус: {character.status}</span>
            <span className="text-[20px] mr-[20px]">Раса: {character.species}</span>
        </div>
    );
}