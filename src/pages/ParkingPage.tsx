import DynamicContentPage from "@/components/DynamicContentPage";

const ParkingPage = () => {
  return (
    <DynamicContentPage
      pageSlug="parking"
      fallbackTitle="Parking"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "parking"
        </p>
      }
    />
  );
};

export default ParkingPage;
