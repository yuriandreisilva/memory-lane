import React, { useState, useEffect, useRef } from "react";
import EditMemory from "./EditMemory";
import axios from "axios";

interface Memory {
  id: number;
  title: string;
  image: string;
  date_memory: string;
  description: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

interface MemoriesSectionProps {
  onEdit: (memory: Memory) => void;
  onDelete: (id: number) => Promise<void>;
}

const MemoriesSection: React.FC<MemoriesSectionProps> = ({ onEdit, onDelete }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState<Memory | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const fetchMemories = async () => { 
    setLoading(true);
    try {
      const response = await axios.get("/api/memories/get-all?limit=10");
      setMemories(response.data); 
    } catch (error) {
      console.error("Erro ao buscar memórias", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleEdit = (memory: Memory) => {
    setShowOptions(null);
    setMemoryToEdit(memory);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setShowOptions(null);
    try {
      await axios.delete(`/api/memories/${id}`);
      fetchMemories(); 
    } catch (error) {
      console.error("Erro ao excluir memória", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {loading ? (
        <div className="text-center mt-4">Carregando...</div>
      ) : memories.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
          <p className="text-gray-600">Você ainda não tem memórias registradas</p>
        </div>
      ) : (
        memories.map((memory, index) => (
          <div key={memory.id} className={"flex flex-col items-center" + (index === memories.length - 1 ? ' mb-10' : '')}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto">
                <img src={memory.image} alt={memory.title} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold">{memory.title}</h2>
                <p className="text-gray-600">{formatDate(memory.date_memory)}</p>
                <p className="text-gray-800 mt-2">{memory.description}</p>
              </div>

              <div className="text-end relative">
                <button
                  onClick={() => setShowOptions(showOptions === memory.id ? null : memory.id)}
                  className="text-2xl"
                >
                  &#x22EF;
                </button>
                {showOptions === memory.id && (
                  <div
                    ref={optionsRef}
                    className="absolute top-full right-0 bg-white shadow-md rounded-md border border-gray-600 z-10"
                  >
                    <button
                      onClick={() => handleEdit(memory)}
                      className="py-1 hover:bg-gray-200 w-full text-center"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="py-1 hover:bg-gray-200 w-full text-center"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            {index < memories.length - 1 && (
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">•</span>
              </div>
            )}
          </div>
        ))
      )}

      <EditMemory
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMemoryToEdit(null);
        }}
        onSuccess={fetchMemories} 
        fetchMemories={fetchMemories} 
        memoryToEdit={memoryToEdit}
      />
    </div>
  );
};


export default MemoriesSection;
