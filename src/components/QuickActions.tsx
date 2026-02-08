import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchFeaturedItems } from "@/lib/api";

const QuickActions = () => {
  const { t } = useTranslation();
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ["featuredItems"],
    queryFn: () => fetchFeaturedItems(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Don't render section if no items configured
  if (!featuredItems || featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 font-serif">{t('sections.featured')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {featuredItems.map((item) => (
          <a
            key={item.id}
            href={item.link_url || "#"}
            className="group text-left"
          >
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground text-sm">Image</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
