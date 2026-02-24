import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name || "");
    setCategory(initialProduct?.category || "");
    setDescription(initialProduct?.description || "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
    setQuantity(initialProduct?.quantity != null ? String(initialProduct.quantity) : "");
    setImage(initialProduct?.image || "");
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Введите название товара");
      return;
    }
    if (!price || Number(price) <= 0) {
      alert("Введите корректную цену");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: name.trim(),
      category: category.trim() || "Другое",
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity) || 0,
      image: image.trim(),
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Кастрюля 5л"
              autoFocus
            />
          </label>

          <label className="label">
            Категория
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Например, Кастрюли"
            />
          </label>

          <label className="label">
            Описание
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара"
              rows="3"
            />
          </label>

          <label className="label">
            Цена (₽) *
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5990"
              type="number"
            />
          </label>

          <label className="label">
            Количество на складе
            <input
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="10"
              type="number"
            />
          </label>

          <label className="label">
            URL изображения
            <input
              className="input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}