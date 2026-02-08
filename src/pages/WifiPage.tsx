import DynamicContentPage from "@/components/DynamicContentPage";

const WifiPage = () => {
  return (
    <DynamicContentPage
      pageSlug="wifi"
      fallbackTitle="Se connecter au Wi-Fi"
      fallbackContent={
        <p className="text-sm text-muted-foreground">
          Configurez le contenu de cette page dans GEA → Pages Guest App → "wifi"
        </p>
      }
    />
  );
};

export default WifiPage;
