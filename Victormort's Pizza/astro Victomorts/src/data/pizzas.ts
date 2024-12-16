//moved pizzas out to make updates easier
//uses static generation at build time to improve initial load time

export const pizzas = [
    { value: "cheese", title: "Cheese", price: 4.99 },
    { value: "pepperoni", title: "Pepperoni", price: 5.99 },
    { value: "vegetarian", title: "Vegetarian", price: 5.99 },
    { value: "meat-lovers", title: "Meat Lovers", price: 6.99 },
    { value: "supreme", title: "Supreme", price: 6.99 }
  ];
  
  export const crusts = [
    { value: "thin", title: "Thin", price: 1.00 },
    { value: "original", title: "Original", price: 0 },
    { value: "thick", title: "Thick", price: 2.00 }
  ];
  
  export const sizes = [
    { value: "small", title: "Small", price: -1.00 },
    { value: "medium", title: "Medium", price: 0 },
    { value: "large", title: "Large", price: 1.00 }
  ];
  