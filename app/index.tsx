import React, { useEffect, useState } from 'react';
import './../styles/globals.css';
import Menu from '../components/Menu';
import HeaderSection from '../components/HeaderSection';
import ControlsSection from '../components/ControlsSection';
import MemoriesSection from '../components/MemoriesSection';

interface Memory {
  id: number;
  title: string;
  image: string;
  date_memory: string;
  description: string;
}

const HomePage: React.FC = () => {
  console.log('456')
  const [memories, setMemories] = useState<Memory[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchMemories = async () => {
    setLoading(true);
    const response = await fetch(`/api/memories/get-all?limit=${limit}&order=${sortOrder}`);

    const data: Memory[] = await response.json();

    if(data) {
      setMemories((prevMemories) => [...prevMemories, ...data]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMemories();
  }, [limit, sortOrder]);

  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setMemories([]);
    setLimit(10);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && !loading) {
      setLimit((prevLimit) => prevLimit + 10);
    }
  };

  return (
    <div className="flex h-screen">
        <Menu />
      <div className="flex-1 ml-16 p-8" onScroll={handleScroll}>
        <HeaderSection />
        <ControlsSection sortOrder={sortOrder} handleSort={handleSort} />
        <MemoriesSection memories={memories} loading={loading} />
      </div>
    </div>
  );
};

export default HomePage;
