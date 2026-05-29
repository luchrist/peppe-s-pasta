export interface DishCarouselItem {
  name: string;
  description: string;
  price?: string;
  image: string;
  alt: string;
}

export const dishCarouselItems: DishCarouselItem[] = [
  {
    name: "Pizza Parma",
    description: "Tomatensoße, Käse, Parmaschinken, Rucola und Parmesan. Der Favorit unserer Stammgäste.",
    price: "9,00 €",
    image: "/assets/acquisition/dishes/pizza-mit-ei-und-schinken-01.jpg",
    alt: "Frisch gebackene Pizza mit Schinken auf Holzbrett"
  },
  {
    name: "Rigatoni al Forno",
    description: "Rinderhackfleisch, Tomatensoße und Käse überbacken, serviert in der Aluschale.",
    price: "9,00 €",
    image: "/assets/acquisition/dishes/uberbackene-rigatoni-01.jpg",
    alt: "Überbackene Rigatoni mit Fleischsauce und geschmolzenem Käse"
  },
  {
    name: "Pizza Margherita",
    description: "Tomatensoße und Käse, das einfache Klassiker-Stück.",
    price: "5,00 €",
    image: "/assets/acquisition/dishes/pizza-margherita-01.jpg",
    alt: "Pizza Margherita frisch aus dem Ofen im Karton"
  },
  {
    name: "Rigatoni al Pomodoro",
    description: "Frische Tomatensoße auf al dente gekochten Rigatoni.",
    price: "6,00 €",
    image: "/assets/acquisition/dishes/rigatoni-mit-tomatensauce-und-kase-01.jpg",
    alt: "Rigatoni in Tomatensauce mit geriebenem Käse in der Aluschale"
  },
  {
    name: "Pizza 4 Stagioni",
    description: "Tomatensoße, Käse, Artischocken, Champignons, Salami und Hinterschinken.",
    price: "8,50 €",
    image: "/assets/acquisition/dishes/pizza-quattro-stagioni-01.jpg",
    alt: "Pizza Quattro Stagioni in der Pizzaschachtel"
  },
  {
    name: "Insalata Pollo",
    description: "Eisbergsalat, Tomaten, Gurken, Mozzarella, Hähnchenbrustfilet und Zwiebeln.",
    price: "10,00 €",
    image: "/assets/acquisition/dishes/hahnchensalat-in-aluschale-01.jpg",
    alt: "Hähnchensalat mit Tomaten und Zwiebeln in der Aluschale"
  }
];
