import React, { useState } from "react";
import { medicines } from "../data/medicines";

const MedicineStore = () => {
  const [medicineSearch, setMedicineSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const medicineValue = medicineSearch.trim().toLowerCase();
  const filteredMedicines = medicines.filter((medicine) => {
    const haystack =
      `${medicine.name} ${medicine.category} ${medicine.use} ${medicine.company}`.toLowerCase();
    return !medicineValue || haystack.includes(medicineValue);
  });

  const addToCart = (medicine) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === medicine.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="page-shell container">
      <section className="page-hero scenic-surface">
        <span className="eyebrow">Medicine Store</span>
        <h1>Search medicines, check their information, and browse store items from a dedicated page.</h1>
        <p>
          This store page is separate from Home so the system stays cleaner.
          Search by medicine name, category, use, or company and browse all 50
          items in one place.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn primary-btn">
            Purchase Medicine
          </button>
          <button type="button" className="btn ghost-btn">
            Cart Items: {totalItems}
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="medicine-store-shell scenic-surface">
          <div className="store-topbar">
            <input
              type="text"
              value={medicineSearch}
              onChange={(e) => setMedicineSearch(e.target.value)}
              placeholder="Search medicine, fever, skin, diabetes, cough, supplement"
              className="doctor-search-input"
            />
            <div className="store-badge">
              {filteredMedicines.length} medicines found
            </div>
          </div>

          <div className="medicine-grid">
            {filteredMedicines.map((medicine) => (
              <article className="medicine-card" key={medicine.id}>
                <span className="eyebrow">{medicine.category}</span>
                <h3>{medicine.name}</h3>
                <p>{medicine.use}</p>
                <div className="medicine-meta">
                  <span>Company: {medicine.company}</span>
                  <span>Price: {medicine.price}</span>
                  <span>Status: {medicine.stock}</span>
                </div>
                <div className="medicine-actions">
                  <button type="button" className="btn primary-btn">
                    Purchase Medicine
                  </button>
                  <button
                    type="button"
                    className="btn ghost-btn"
                    onClick={() => addToCart(medicine)}
                  >
                    Add Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Cart</span>
          <h2>Medicines added to cart</h2>
        </div>

        <div className="cart-shell soft-surface">
          {cartItems.length ? (
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.company}</p>
                  </div>
                  <div className="cart-item-meta">
                    <span>{item.price}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="search-empty">
              No medicine added yet. Use Add Cart from the store list.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MedicineStore;
