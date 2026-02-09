import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchFeaturedItems } from "@/lib/api";

const QuickActions = () => {
  const { t } = useTranslation();
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ["featuredItems"],
    queryFn: () => fetchFeaturedItems(),
    staleTime: 1000 * 60 * 5,
  });

  if (!featuredItems || featuredItems.length === 0) return null;

  return (
    <section className="px-4 pt-4 pb-6">
      <h2 className="text-lg font-bold text-foreground mb-3 font-serif">{t('sections.featured')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {featuredItems.map((item) => (
          <a
            key={item.id}
            href={item.link_url || "#"}
            className="group"
          >
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Image</span>
                  </div>
                )}
              </div>
              <p className="px-3 py-2.5 text-sm font-medium text-foreground">{item.title}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
