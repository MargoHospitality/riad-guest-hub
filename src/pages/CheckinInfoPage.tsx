import DynamicContentPage from "@/components/DynamicContentPage";

const CheckinInfoPage = () => {
  return (
    <DynamicContentPage
      pageSlug="checkin-info"
      fallbackTitle="Check-In / Check-Out"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "checkin-info"
        </p>
      }
    />
  );
};

export default CheckinInfoPage;
