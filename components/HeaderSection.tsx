import { FaShareAlt } from 'react-icons/fa';

const HeaderSection = () => {
  return (
    <div>
      <div className='flex justify-between items-center w-full'>
        <h1 className="text-3xl font-bold">Yuri's Memory Lane</h1>
        <div className='flex justify-end'>
          <button className="bg-purple-500 text-white py-2 px-4 rounded-lg" onClick={() => alert('Compartilhar!')}>
            <FaShareAlt size={20} />
          </button>
        </div>
      </div>
        <div className="w-full text-center bg-purple-100 p-4 rounded-lg mt-4">
          <p className="text-lg">Uma coleção das memórias de Yuri...</p>
        </div>  
    </div>
  );
};

export default HeaderSection;
