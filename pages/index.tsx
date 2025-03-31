import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import HeaderSection from '../components/HeaderSection';
import ControlsSection from '../components/ControlsSection';
import MemoriesSection from '../components/MemoriesSection';
import './../styles/globals.css';

interface Memory {
  id: number;
  title: string;
  image: string;
  date_memory: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/memories/get-all?limit=${limit}&order=${sortOrder}`);
      if (response.ok && response.status == 200) {        
        let data: Memory[] = await response.json();
        if (Array.isArray(data)) {
          console.log('entrando fetchMemories')
          data = data.sort((a, b) =>
            sortOrder === 'asc'
              ? new Date(a.date_memory).getTime() - new Date(b.date_memory).getTime()
              : new Date(b.date_memory).getTime() - new Date(a.date_memory).getTime()
          );
          setMemories([...data]); 
        }
      }
    } catch (error) {
      console.error("Erro ao buscar memórias:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMemories();
  }, [sortOrder]);
 
  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order)
    fetchMemories()
  };
  

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && !loading) {
      setLimit((prevLimit) => prevLimit + 10);
    }
  };

  
  const handleMemorySuccess = () => {
    fetchMemories(); 
  };

  const handleDeleteMemory = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta memória?')) return;
  
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMemories((prev) => prev.filter((memory) => memory.id !== id));
      } else {
        console.error('Erro ao excluir a memória');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API', error);
    }
  };
  
  const handleEditMemory = (memory: Memory) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memory.id ? memory : m))
    );
    fetchMemories(); 
  };
  
  

  return (
    <div className="flex h-screen">
      <Menu />
      <div className="flex-1 ml-16 p-8" onScroll={handleScroll}>
        <HeaderSection />
        <ControlsSection 
          sortOrder={sortOrder} 
          handleSort={handleSort} 
          fetchMemories={fetchMemories} 
        />
        <MemoriesSection
          onEdit={handleEditMemory}
          onDelete={handleDeleteMemory}
        />
      </div>
    </div>
  );
};

export default HomePage;
