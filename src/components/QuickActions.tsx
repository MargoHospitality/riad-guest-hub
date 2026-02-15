import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { fetchFeaturedItems } from "@/lib/api";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const QuickActions = () => {
  const { t, i18n } = useTranslation();
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ["featuredItems", i18n.language],
    queryFn: () => fetchFeaturedItems(undefined, i18n.language),
    staleTime: 1000 * 60 * 5,
  });

  if (!featuredItems || featuredItems.length === 0) return null;

  const useCarousel = featuredItems.length >= 3;

  return (
    <section className="px-4 pt-5 pb-3">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-0.5 h-4 rounded-full bg-accent" />
        <h2 className="text-base font-bold text-foreground font-serif tracking-tight">
          {t('sections.featured')}
        </h2>
      </div>

      {useCarousel ? (
        <FeaturedCarousel items={featuredItems} />
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {featuredItems.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

interface FeaturedItem {
  id: string;
  title: string;
  image_url?: string;
  link_url?: string;
}

const FeaturedCard = ({ item }: { item: FeaturedItem }) => {
  const isExternal = item.link_url?.startsWith('http');
  const content = (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>
      <p className="px-3 py-2.5 text-[13px] font-medium text-foreground">{item.title}</p>
    </div>
  );

  if (isExternal) {
    return (
      <a href={item.link_url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={item.link_url || "#"}>
      {content}
    </Link>
  );
};

const FeaturedCarousel = ({ items }: { items: FeaturedItem[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2.5">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_70%] min-w-0">
              <FeaturedCard item={item} />
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              i === activeIndex ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
