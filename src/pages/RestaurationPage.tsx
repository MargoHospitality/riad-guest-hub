import DynamicContentPage from "@/components/DynamicContentPage";

const RestaurationPage = () => {
  return (
    <DynamicContentPage
      pageSlug="restauration"
      fallbackTitle="Restauration"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "restauration"
        </p>
      }
    />
  );
};

export default RestaurationPage;
