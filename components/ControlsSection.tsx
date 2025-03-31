import { LuArrowDownUp } from "react-icons/lu";
import NewMemory from "./NewMemory";
import { useState } from "react";

interface ControlsSectionProps {
  sortOrder: 'asc' | 'desc';
  handleSort: (order: 'asc' | 'desc') => void;
  fetchMemories: () => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({ sortOrder, handleSort, fetchMemories }) => {
  const [isOpen, setIsOpen] = useState(false);

  
  return (
    <div className="flex justify-between items-center w-full mt-8">
      <button
        className="bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center gap-2"
        onClick={() => {
          const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
          handleSort(newOrder);
        }}>
        {sortOrder === 'desc' ? 'Primeiro para o último' : 'Último para o primeiro'}
        <LuArrowDownUp color="bg-purple-500" size={20} />
      </button>
      <button className="bg-purple-500 text-white py-2 px-4 rounded-lg" onClick={() => setIsOpen(true)}>
        + Nova Memória
      </button>
      <NewMemory 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        fetchMemories={fetchMemories} 
      />
  
    </div>
  );
};

export default ControlsSection;
