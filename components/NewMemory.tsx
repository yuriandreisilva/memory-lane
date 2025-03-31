import React, { useState } from "react";
import Button from "./Button";
import Dialog from "./Dialog";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

interface NewMemoryProps {
  isOpen: boolean;
  onClose: () => void;
  fetchMemories: () => void;
}

const NewMemory: React.FC<NewMemoryProps> = ({ isOpen, onClose, fetchMemories }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dateMemory, setDateMemory] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dateMemory || !description) {
      setMessage("Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);
    formData.append("date_memory", dateMemory?.toISOString() || "");
    formData.append("description", description);

    try {
      await axios.post("/api/memories", formData);
      setMessage("Memória salva com sucesso!");
      setTimeout(() => {
        setMessage("");
        fetchMemories();
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar a memória.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Nova Memória</h2>
      {message && <p className="text-sm text-center mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {imagePreview && (
          <div className="mb-4 flex justify-center">
            <img src={imagePreview} alt="Pré-visualização" className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}

        <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center gap-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600">
          <span>Escolher Foto</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <DatePicker
          selected={dateMemory}
          onChange={(date: Date) => setDateMemory(date)}
          dateFormat="dd/MM/yyyy"
          className="w-full border p-2 rounded"
          placeholderText="Selecione a data"
        />

        <textarea
          placeholder="Descrição"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button type="submit" className="w-full bg-purple-500" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Dialog>
  );
};

export default NewMemory;
