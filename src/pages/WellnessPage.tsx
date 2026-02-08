import DynamicContentPage from "@/components/DynamicContentPage";

const WellnessPage = () => {
  return (
    <DynamicContentPage
      pageSlug="wellness"
      fallbackTitle="Bien-être & confort"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "wellness"
        </p>
      }
    />
  );
};

export default WellnessPage;
