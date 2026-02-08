import airportImg from "@/assets/airport.jpg";
import dinnerImg from "@/assets/dinner.jpg";

const cards = [
  { img: airportImg, label: "Votre transport" },
  { img: dinnerImg, label: "Dinner d'accueil" },
];

const QuickActions = () => (
  <section className="px-4 pb-6">
    <h2 className="text-xl font-bold text-foreground mb-4 font-serif">A la une</h2>
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <button key={i} className="group text-left">
          <div className="rounded-xl overflow-hidden aspect-[4/3]">
            <img
              src={card.img}
              alt={card.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{card.label}</p>
        </button>
      ))}
    </div>
  </section>
);

export default QuickActions;
