import { GiFamilyTree } from "react-icons/gi";

const Menu = () => {
  return (
    <div className="w-16 bg-purple-950 text-white flex flex-col items-center fixed h-full">
      <button className="mt-4" onClick={() => window.location.reload()}>
        <GiFamilyTree size={50} />
      </button>
    </div>
  )
};

export default Menu;
