import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { medicines } from "../data/medicines";
import { API_URL } from "../api";

const localShops = [
  {
    name: "ZeeCare Central Pharmacy",
    location: "Hospital Chowk, Main Road",
    timing: "Open today till 11:30 PM",
    contact: "+91 98765 22001",
    support: "Fast medicine pickup, prescription support, same-day delivery",
  },
  {
    name: "CareNest Medical Store",
    location: "Model Town, Near City Mall",
    timing: "Open today till 10:45 PM",
    contact: "+91 98765 22002",
    support: "Family medicines, wellness products, refill support",
  },
  {
    name: "Night Aid Pharmacy",
    location: "Civil Lines, Emergency Lane",
    timing: "24x7 open",
    contact: "+91 98765 22003",
    support: "Emergency medicine, first aid, inhalers, diabetic supplies",
  },
];

const initialAddresses = [
  {
    id: 1,
    label: "Home",
    person: "Sumit Patient",
    address: "221, Green Avenue, Near City Hospital, Civil Lines",
    phone: "+91 98765 33001",
    note: "Ring bell and call before delivery",
  },
  {
    id: 2,
    label: "Office",
    person: "Sumit Patient",
    address: "2nd Floor, Market Plaza, Model Town",
    phone: "+91 98765 33002",
    note: "Deliver before 6 PM on weekdays",
  },
];

const STORAGE_KEYS = {
  cart: "zeecare-store-cart",
  orders: "zeecare-store-orders",
  addresses: "zeecare-store-addresses",
  selectedAddressId: "zeecare-store-selected-address",
  selectedStore: "zeecare-store-selected-store",
};

const readStoredValue = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
};

const MedicineStore = () => {
  const [medicineSearch, setMedicineSearch] = useState("");
  const [cartItems, setCartItems] = useState(() =>
    readStoredValue(STORAGE_KEYS.cart, [])
  );
  const [selectedStore, setSelectedStore] = useState(() =>
    readStoredValue(STORAGE_KEYS.selectedStore, localShops[0])
  );
  const [purchaseNote, setPurchaseNote] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState("cart");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState("browse");
  const [savedAddresses, setSavedAddresses] = useState(() =>
    readStoredValue(STORAGE_KEYS.addresses, initialAddresses)
  );
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const storedId = readStoredValue(
      STORAGE_KEYS.selectedAddressId,
      initialAddresses[0].id
    );
    return Number(storedId) || initialAddresses[0].id;
  });
  const [orders, setOrders] = useState(() =>
    readStoredValue(STORAGE_KEYS.orders, [])
  );
  const [addressForm, setAddressForm] = useState({
    id: null,
    label: "",
    person: "",
    address: "",
    phone: "",
    note: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const medicineValue = medicineSearch.trim().toLowerCase();
  const filteredMedicines = medicines.filter((medicine) => {
    const haystack =
      `${medicine.name} ${medicine.category} ${medicine.use} ${medicine.company} ${medicine.storeZone}`.toLowerCase();
    return !medicineValue || haystack.includes(medicineValue);
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.addresses,
      JSON.stringify(savedAddresses)
    );
  }, [savedAddresses]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.selectedAddressId,
      String(selectedAddressId)
    );
  }, [selectedAddressId]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.selectedStore,
      JSON.stringify(selectedStore)
    );
  }, [selectedStore]);

  const getIntegerPrice = (price) => {
    const numericValue = parseInt(String(price).replace(/[^\d]/g, ""), 10);
    return Number.isNaN(numericValue) ? 0 : numericValue;
  };

  const addToCart = (medicine) => {
    setPaymentSuccess(null);
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === medicine.id);
      if (existingItem) {
        setPurchaseNote(
          `${medicine.name} is already in cart. Price stays ${medicine.price}.`
        );
        return prev;
      }
      setPurchaseNote(
        `${medicine.name} added to cart with fixed price ${medicine.price}.`
      );
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const cartTotalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const priceValue = getIntegerPrice(item.price);
      return sum + priceValue * item.quantity;
    }, 0);
  }, [cartItems]);

  const selectedAddress =
    savedAddresses.find((address) => address.id === selectedAddressId) ||
    savedAddresses[0];

  const resetAddressForm = () => {
    setAddressForm({
      id: null,
      label: "",
      person: "",
      address: "",
      phone: "",
      note: "",
    });
    setShowAddressForm(false);
  };

  const startEditAddress = (address) => {
    setAddressForm(address);
    setShowAddressForm(true);
  };

  const handleAddressSave = () => {
    if (
      !addressForm.label.trim() ||
      !addressForm.person.trim() ||
      !addressForm.address.trim() ||
      !addressForm.phone.trim()
    ) {
      setPurchaseNote("Please fill label, person, address, and phone before saving address.");
      return;
    }

    if (addressForm.id) {
      setSavedAddresses((prev) =>
        prev.map((item) => (item.id === addressForm.id ? addressForm : item))
      );
      setSelectedAddressId(addressForm.id);
      setPurchaseNote(`${addressForm.label} address updated successfully.`);
    } else {
      const newAddress = { ...addressForm, id: Date.now() };
      setSavedAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setPurchaseNote(`${newAddress.label} address added successfully.`);
    }

    resetAddressForm();
  };

  const placeFrontendOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      status: "Order Confirmed",
      canCancel: true,
      createdAt: new Date().toLocaleString("en-IN"),
      paymentMethod: selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
      storeName: selectedStore.name,
      addressLabel: selectedAddress.label,
      addressText: selectedAddress.address,
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    if (checkoutMode === "single") {
      setSelectedMedicine(null);
    } else {
      setCartItems([]);
    }
    setActiveSection("orders");
    return newOrder;
  };

  const loadRazorpayScript = async () => {
    if (window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openPaymentForAmount = async ({ amount, itemName, successMessage }) => {
    setPaymentLoading(true);
    setPaymentSuccess(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPurchaseNote("Unable to load Razorpay checkout right now. Please try again.");
        return;
      }

      const orderResponse = await axios.post(
        `${API_URL}/api/v1/payment/create-order`,
        {
          amount: amount * 100,
          itemName,
        },
        { withCredentials: true }
      );

      const { order, key } = orderResponse.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "ZeeCare+",
        description: itemName,
        order_id: order.id,
        theme: {
          color: "#1f6f5f",
        },
        handler: async function (response) {
          await axios.post(
            `${API_URL}/api/v1/payment/verify`,
            response,
            { withCredentials: true }
          );
          const createdOrder = placeFrontendOrder({
            title: itemName,
            total: `Rs. ${amount}`,
            itemsCount: checkoutMode === "single" ? 1 : cartItems.length,
          });
          setPaymentSuccess({
            title: "Payment Successful",
            text: `${successMessage} Order ID: ${createdOrder.id}`,
          });
          setPurchaseNote(`${successMessage} Order ID: ${createdOrder.id}`);
        },
        modal: {
          ondismiss: function () {
            setPurchaseNote("Payment window closed. You can try again anytime.");
          },
        },
        prefill: {
          contact: selectedStore.contact.replace(/[^\d]/g, "").slice(-10),
        },
        notes: {
          store: selectedStore.name,
          location: selectedStore.location,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setPurchaseNote(
        error.response?.data?.message ||
          "Payment could not be started. Please check Razorpay keys and try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const purchaseMedicine = async (medicine) => {
    setActiveSection("checkout");
    setSelectedMedicine(medicine);
    setCheckoutMode("single");
    setPaymentSuccess(null);
    setPurchaseNote(
      `${medicine.name} selected. Choose Cash on Delivery or UPI/Card below to complete your order.`
    );
  };

  const paySingleMedicine = async () => {
    if (!selectedMedicine) {
      setPurchaseNote("Choose a medicine first to continue.");
      return;
    }

    if (selectedPaymentMethod === "cod") {
      const createdOrder = placeFrontendOrder({
        title: selectedMedicine.name,
        total: selectedMedicine.price,
        itemsCount: 1,
      });
      const message = `${selectedMedicine.name} order confirmed with Cash on Delivery. ${selectedStore.name} will deliver near ${selectedStore.location} in about ${selectedMedicine.deliveryTime}. Order ID: ${createdOrder.id}`;
      setPaymentSuccess({
        title: "Order Placed Successfully",
        text: message,
      });
      setPurchaseNote(message);
      return;
    }

    await openPaymentForAmount({
      amount: getIntegerPrice(selectedMedicine.price),
      itemName: selectedMedicine.name,
      successMessage: `${selectedMedicine.name} payment completed. ${selectedStore.name} will arrange delivery in about ${selectedMedicine.deliveryTime}.`,
    });
  };

  const checkoutCart = async () => {
    if (!cartItems.length) {
      setPurchaseNote("Add at least one medicine to cart before checkout.");
      return;
    }

    if (selectedPaymentMethod === "cod") {
      const createdOrder = placeFrontendOrder({
        title: `Medicine Cart (${cartItems.length} items)`,
        total: `Rs. ${cartTotalAmount}`,
        itemsCount: cartItems.length,
      });
      const message = `Cart order placed with Cash on Delivery. ${selectedStore.name} has accepted ${cartItems.length} items for ${selectedStore.location}. Order ID: ${createdOrder.id}`;
      setPaymentSuccess({
        title: "Order Placed Successfully",
        text: message,
      });
      setPurchaseNote(message);
      return;
    }

    await openPaymentForAmount({
      amount: cartTotalAmount,
      itemName: `Medicine Cart (${cartItems.length} items)`,
      successMessage: `Cart payment completed. ${selectedStore.name} has started processing ${cartItems.length} medicines for ${selectedStore.location}.`,
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Cancelled", canCancel: false }
          : order
      )
    );
    setPurchaseNote("Order cancelled successfully.");
    setPaymentSuccess(null);
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== medicineId));
    setPurchaseNote("Medicine removed from cart.");
  };

  const clearAllOrders = () => {
    setOrders([]);
    setPurchaseNote("All saved orders cleared.");
    setPaymentSuccess(null);
  };

  return (
    <main className="page-shell container">
      <section className="page-hero scenic-surface">
        <span className="eyebrow">Medicine Store</span>
        <h1>Search medicines, find nearby store locations, and order with more complete product information.</h1>
        <p>
          This upgraded store page feels like a real medicine service section.
          Search products, compare nearby pharmacy support, review medicine
          details, and place an easier local order from one page.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn primary-btn"
            onClick={() => {
              setActiveSection("checkout");
              setCheckoutMode("cart");
              setSelectedMedicine(null);
              setPaymentSuccess(null);
              setPurchaseNote("Cart checkout is ready. Choose payment method below.");
            }}
          >
            Open Checkout
          </button>
          <button type="button" className="btn ghost-btn" onClick={() => setPurchaseNote(`Ordering support is active for ${selectedStore.name}. Select a medicine below to continue.`)}>
            Start Local Order
          </button>
          <button type="button" className="btn ghost-btn">
            Cart Items: {totalItems} | Total: Rs. {cartTotalAmount}
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="soft-surface commerce-tabs">
          <button
            type="button"
            className={activeSection === "browse" ? "voice-chip voice-chip-active" : "voice-chip"}
            onClick={() => setActiveSection("browse")}
          >
            Browse Store
          </button>
          <button
            type="button"
            className={activeSection === "checkout" ? "voice-chip voice-chip-active" : "voice-chip"}
            onClick={() => setActiveSection("checkout")}
          >
            Checkout
          </button>
          <button
            type="button"
            className={activeSection === "orders" ? "voice-chip voice-chip-active" : "voice-chip"}
            onClick={() => setActiveSection("orders")}
          >
            My Orders
          </button>
        </div>
      </section>

      {activeSection === "checkout" ? (
      <section className="section-block">
        <div className="soft-surface checkout-shell">
          <div className="section-heading">
            <span className="eyebrow">Checkout</span>
            <h2>Select payment method and place your order</h2>
            <p>
              Choose between Cash on Delivery and online payment. This section
              is designed to feel clearer and closer to modern shopping apps.
            </p>
          </div>

          <div className="checkout-layout">
            <div className="checkout-summary">
              <strong>{checkoutMode === "single" ? "Selected Medicine" : "Cart Summary"}</strong>
              {checkoutMode === "single" && selectedMedicine ? (
                <div className="checkout-summary-card">
                  <h3>{selectedMedicine.name}</h3>
                  <p>{selectedMedicine.use}</p>
                  <span>{selectedMedicine.price}</span>
                  <span>Delivery ETA: {selectedMedicine.deliveryTime}</span>
                </div>
              ) : (
                <div className="checkout-summary-card">
                  <h3>{totalItems} item(s) in cart</h3>
                  <p>{selectedStore.name}</p>
                  <span>Total: Rs. {cartTotalAmount}</span>
                  <span>Delivery area: {selectedStore.location}</span>
                </div>
              )}
            </div>

            <div className="checkout-methods">
              <div className="checkout-subsection">
                <strong>Delivery Address</strong>
                <div className="address-toolbar">
                  <button
                    type="button"
                    className="btn ghost-btn"
                    onClick={() => {
                      setAddressForm({
                        id: null,
                        label: "",
                        person: "",
                        address: "",
                        phone: "",
                        note: "",
                      });
                      setShowAddressForm(true);
                    }}
                  >
                    Add New Address
                  </button>
                </div>
                <div className="address-grid">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={selectedAddressId === address.id ? "address-card address-card-active" : "address-card"}
                    >
                      <button
                        type="button"
                        className="address-select-btn"
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <strong>{address.label}</strong>
                        <span>{address.person}</span>
                        <span>{address.address}</span>
                        <span>{address.phone}</span>
                        <span>{address.note}</span>
                      </button>
                      <button
                        type="button"
                        className="btn ghost-btn"
                        onClick={() => startEditAddress(address)}
                      >
                        Edit Address
                      </button>
                    </div>
                  ))}
                </div>
                {showAddressForm ? (
                  <div className="address-form-card">
                    <strong>{addressForm.id ? "Edit Address" : "Add Address"}</strong>
                    <div className="address-form-grid">
                      <input
                        type="text"
                        placeholder="Label"
                        value={addressForm.label}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, label: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Person Name"
                        value={addressForm.person}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, person: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Full Address"
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, address: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Note"
                        value={addressForm.note}
                        onChange={(e) =>
                          setAddressForm((prev) => ({ ...prev, note: e.target.value }))
                        }
                      />
                    </div>
                    <div className="address-form-actions">
                      <button type="button" className="btn primary-btn" onClick={handleAddressSave}>
                        Save Address
                      </button>
                      <button type="button" className="btn ghost-btn" onClick={resetAddressForm}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="checkout-subsection">
                <strong>Payment Options</strong>
              <button
                type="button"
                className={selectedPaymentMethod === "cod" ? "store-location-card store-location-card-active" : "store-location-card"}
                onClick={() => setSelectedPaymentMethod("cod")}
              >
                <strong>Cash on Delivery</strong>
                <span>Pay when medicine reaches your home</span>
              </button>
              <button
                type="button"
                className={selectedPaymentMethod === "online" ? "store-location-card store-location-card-active" : "store-location-card"}
                onClick={() => setSelectedPaymentMethod("online")}
              >
                <strong>UPI / Card / Netbanking</strong>
                <span>Pay now using Razorpay test checkout</span>
              </button>
              </div>
            </div>
          </div>

          <div className="checkout-action-bar">
            <button
              type="button"
              className="btn primary-btn"
              onClick={checkoutMode === "single" ? paySingleMedicine : checkoutCart}
              disabled={paymentLoading || (checkoutMode === "single" && !selectedMedicine)}
            >
              {paymentLoading
                ? "Processing..."
                : selectedPaymentMethod === "cod"
                  ? "Place Order"
                  : "Proceed To Payment"}
            </button>
            <span className="store-badge">
              {selectedPaymentMethod === "cod"
                ? "COD available"
                : "Online payment via Razorpay"}
            </span>
          </div>

          {paymentSuccess ? (
            <div className="payment-success-card">
              <strong>{paymentSuccess.title}</strong>
              <p>{paymentSuccess.text}</p>
            </div>
          ) : null}
        </div>
      </section>
      ) : null}

      {activeSection === "browse" ? (
      <>
      <section className="section-block split-layout reverse-layout">
        <div className="soft-surface store-location-panel">
          <div className="section-heading">
            <span className="eyebrow">Store Locations</span>
            <h2>Choose a nearby pharmacy in your area</h2>
            <p>
              Pick the store that feels closest and easiest for pickup or fast
              home delivery.
            </p>
          </div>
          <div className="store-location-list">
            {localShops.map((shop) => (
              <button
                key={shop.name}
                type="button"
                className={selectedStore.name === shop.name ? "store-location-card store-location-card-active" : "store-location-card"}
                onClick={() => setSelectedStore(shop)}
              >
                <strong>{shop.name}</strong>
                <span>{shop.location}</span>
                <span>{shop.timing}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="scenic-panel store-info-panel">
          <span className="eyebrow">Selected Pharmacy</span>
          <h2>{selectedStore.name}</h2>
          <p>{selectedStore.support}</p>
          <div className="mini-points">
            <div>Location: {selectedStore.location}</div>
            <div>Timing: {selectedStore.timing}</div>
            <div>Call to order: {selectedStore.contact}</div>
          </div>
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
                  <span>Pack: {medicine.pack}</span>
                  <span>Quantity: {medicine.quantityLabel}</span>
                  <span>Manufactured: {medicine.manufacturedOn}</span>
                  <span>Expires: {medicine.expiresOn}</span>
                  <span>Nearby zone: {medicine.storeZone}</span>
                  <span>Delivery ETA: {medicine.deliveryTime}</span>
                </div>
                <div className="medicine-detail-box">
                  <strong>Usage guidance</strong>
                  <p>{medicine.dosage}</p>
                  <strong>Storage</strong>
                  <p>{medicine.storage}</p>
                  <strong>Store note</strong>
                  <p>{medicine.availabilityNote}</p>
                </div>
                <div className="medicine-actions">
                  <button
                    type="button"
                    className="btn primary-btn"
                    onClick={() => purchaseMedicine(medicine)}
                  >
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
      </>
      ) : null}

      {activeSection === "orders" ? (
      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">My Orders</span>
          <h2>Track and manage your placed orders</h2>
        </div>

        <div className="address-toolbar">
          <button
            type="button"
            className="btn ghost-btn"
            onClick={clearAllOrders}
            disabled={!orders.length}
          >
            Clear All Orders
          </button>
        </div>

        <div className="cart-shell soft-surface">
          {orders.length ? (
            <div className="cart-list">
              {orders.map((order) => (
                <article className="cart-item order-card" key={order.id}>
                  <div>
                    <h3>{order.title}</h3>
                    <p>{order.storeName}</p>
                    <p>{order.addressLabel}: {order.addressText}</p>
                    <p>Payment: {order.paymentMethod}</p>
                    <p>Status: {order.status}</p>
                  </div>
                  <div className="cart-item-meta">
                    <span>{order.total}</span>
                    <span>Items: {order.itemsCount}</span>
                    <span>{order.createdAt}</span>
                    {order.canCancel ? (
                      <button
                        type="button"
                        className="btn ghost-btn"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel Order
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="search-empty">
              No orders yet. Use Browse Store and Checkout to place one.
            </div>
          )}
        </div>
      </section>
      ) : null}

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
                    <button
                      type="button"
                      className="btn ghost-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
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

      <section className="section-block">
        <div className="soft-surface purchase-note-panel">
          <div className="section-heading">
            <span className="eyebrow">Easy Ordering</span>
            <h2>Instant order support and local medicine assistance</h2>
          </div>
          <div className="request-status-card">
            <strong>Order update:</strong>
            <p>
              {purchaseNote ||
                "Select any medicine and use Purchase Medicine to show a ready local-order response."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MedicineStore;
