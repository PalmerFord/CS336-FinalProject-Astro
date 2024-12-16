// astro generates initial HTML with empty cart (pre renders)
//hydrates the cart component on the client side (client: load)
//island: cart component runs independently of other page components
import React from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = React.useState([]);
  
  //typical react does server side rendering, astro does not
  //only executes after the component is hydrated on the client (Cart client: load)
  React.useEffect(() => {
    function handleNewItem(event) {
        //adds the stuff from orderform to the cart
      setCartItems(currentItems => [...currentItems, event.detail]);
    }
    
    //works in tandem with the custom event in OrderForm.jsx
    window.addEventListener('addToCart', handleNewItem);
    
    //astro ensures these event listeners are properly cleaned up
    return () => window.removeEventListener('addToCart', handleNewItem);
  }, []);

  function removeFromCart(indexToRemove) {
    setCartItems(currentItems => 
      currentItems.filter((item, index) => index !== indexToRemove)
    );
  }

  //initially 0 and calc with hydration
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div id="cart-section">
      <h2>Your Cart</h2>
      
      {/* list initially empty */}
      {/* after hydration, it becomes reactive to cart changes */}
      <ul id="cart-items">
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.quantity}x {item.size} {item.pizza} pizza 
            with {item.crust} crust - ${item.price.toFixed(2)}
            
            {/* not SSR, created in hydration */}
            <button onClick={() => removeFromCart(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* 
          0$ during SSR
          "hydrated" on the client with real total
          updated aften on this island
    */}
      <p id="cart-total">
        Total: ${totalPrice.toFixed(2)}
      </p>
    </div>
  );
}