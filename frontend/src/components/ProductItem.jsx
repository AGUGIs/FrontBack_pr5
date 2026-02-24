import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">🍳</div>
        )}
      </div>

      <div className="product-card__content">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__info">
          <div className="product-card__price">{product.price} ₽</div>
          <div className="product-card__quantity">
            На складе: {product.quantity} шт.
          </div>
        </div>

        <div className="product-card__actions">
          <button className="btn" onClick={() => onEdit(product)}>
            Редактировать
          </button>
          <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}