//receives data from index.astro and communicates with Cart.jsx
//astro handles this component with client:visible directive (in index.astro)
//only hydrates when the component becomes visible
import React from 'react';

//props are passed FROM index.astro which gets them from pizzas.ts
//server-side: generates static HTML
//client-side: hydration for interactivity
export default function OrderForm({ pizzas, crusts, sizes }) {
  //price calc only when fully hydrated
  //makes sure we don't miss any selections by waiting ^
  function getPrice() {
    const selectedPizza = document.querySelector('input[name="pizza"]:checked')?.value;
    const selectedCrust = document.querySelector('input[name="crust"]:checked')?.value;
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    const quantity = document.getElementById("quantity")?.value || 1;

    //uses props passed in from index.astro 
    let totalPrice = 0;
    const pizza = pizzas.find(p => p.value === selectedPizza);
    if (pizza) totalPrice += pizza.price;

    const crust = crusts.find(c => c.value === selectedCrust);
    if (crust) totalPrice += crust.price;

    const size = sizes.find(s => s.value === selectedSize);
    if (size) totalPrice += size.price;

    return totalPrice * quantity;
  }

  //updates interactively (with you guessed it- hydration)
  function updatePrice() {
    const price = getPrice();
    document.getElementById("total").textContent = `$${price.toFixed(2)}`;
  }

  function handleAddToCart() {
    //from JS to select
    const selectedPizza = document.querySelector('input[name="pizza"]:checked')?.value;
    const selectedCrust = document.querySelector('input[name="crust"]:checked')?.value;
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    const quantity = document.getElementById("quantity")?.value;

    if (!selectedPizza || !selectedCrust || !selectedSize) {
      alert("Please choose all pizza options before adding to cart");
      return;
    }

    //dispatches custom event that Cart.jsx listens for
    //if all selected, passed it on to Cart.jsx
    window.dispatchEvent(new CustomEvent('addToCart', {
      detail: {
        pizza: selectedPizza,
        crust: selectedCrust,
        size: selectedSize,
        quantity: quantity,
        price: getPrice()
      }
    }));
  }

  //runs after hydration
  React.useEffect(() => {
    const radioButtons = document.querySelectorAll(
      'input[name="pizza"], input[name="crust"], input[name="size"]'
    );
    radioButtons.forEach(button => {
      button.addEventListener("change", updatePrice);
    });

    const quantityInput = document.getElementById("quantity");
    quantityInput.addEventListener("input", updatePrice);

    const addButton = document.getElementById("add-to-cart");
    addButton.addEventListener("click", handleAddToCart);

    updatePrice();

    return () => {
      radioButtons.forEach(button => {
        button.removeEventListener("change", updatePrice);
      });
      quantityInput?.removeEventListener("input", updatePrice);
      addButton?.removeEventListener("click", handleAddToCart);
    };
  }, []);

  return (
    <div id="order-section">
      {/* pizza options rendered statically by astro using props from pizzas.ts */}
      <h2>Choose Your Pizza</h2>
      <p className="pizza options">
        {pizzas.map(pizza => (
          <label key={pizza.value}>
            <input type="radio" name="pizza" value={pizza.value} />
            <span className="button-title">{pizza.title}</span>
            <span className="price">${pizza.price.toFixed(2)}</span>
          </label>
        ))}
      </p>

      {/* same ol same ol with hydration and some asto templating with .map  */}
      <h3>Choose Your Crust:</h3>
      <p className="crust options">
        {crusts.map(crust => (
          <label key={crust.value}>
            <input 
              type="radio" 
              name="crust" 
              value={crust.value}
              defaultChecked={crust.value === "original"}
            />
            <span className="button-title">{crust.title}</span>
            {crust.price > 0 && (
              <span className="price">+${crust.price.toFixed(2)}</span>
            )}
          </label>
        ))}
      </p>

      {/* follows the same pattern as crusts */}
      <h3>Choose Your Size:</h3>
      <p className="size options">
        {sizes.map(size => (
          <label key={size.value}>
            <input 
              type="radio" 
              name="size" 
              value={size.value}
              defaultChecked={size.value === "medium"}
            />
            <span className="button-title">{size.title}</span>
            {size.price !== 0 && (
              <span className="price">
                {size.price > 0 ? "+" : ""}${Math.abs(size.price).toFixed(2)}
              </span>
            )}
          </label>
        ))}
      </p>

      <h3>How Many?</h3>
      <input
        type="number"
        id="quantity"
        min="1"
        max="99"
        defaultValue="1"
      />

      <h3>Total Price:</h3>
      <p id="total"></p>

      {/* this button triggers communication with Cart.jsx via above stuff */}
      <button id="add-to-cart">Add to Cart</button>
    </div>
  );
}