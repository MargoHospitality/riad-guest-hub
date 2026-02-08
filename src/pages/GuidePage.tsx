import DynamicContentPage from "@/components/DynamicContentPage";

const GuidePage = () => {
  return (
    <DynamicContentPage
      pageSlug="help"
      fallbackTitle="Comment utiliser la Guest App"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "help"
        </p>
      }
    />
  );
};

export default GuidePage;
