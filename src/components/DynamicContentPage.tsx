import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchPageContent } from "@/lib/api";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { Loader2 } from "lucide-react";

interface DynamicContentPageProps {
  pageSlug?: string;
  fallbackTitle?: string;
  fallbackContent?: React.ReactNode;
}

const DynamicContentPage = ({ 
  pageSlug: pageSlugProp, 
  fallbackTitle = "Page",
  fallbackContent 
}: DynamicContentPageProps) => {
  // Get pageCode from URL params if not provided as prop
  const { pageCode } = useParams<{ pageCode: string }>();
  const pageSlug = pageSlugProp || pageCode || "";
  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ["pageContent", pageSlug],
    queryFn: () => fetchPageContent(pageSlug),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground">
                Cette page n'est pas encore configurée.
              </p>
              {fallbackContent && (
                <div className="mt-6">{fallbackContent}</div>
              )}
            </div>
          ) : pageData ? (
            <div className="p-4">
              {/* Page Title */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {pageData.title}
                </h1>
              </div>

              {/* Dynamic HTML Content */}
              <article
                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pageData.content_html }}
              />
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground">
                Cette page n'est pas encore configurée.
              </p>
              {fallbackContent && (
                <div className="mt-6">{fallbackContent}</div>
              )}
            </div>
          )}
        </div>
      </main>

      <div className="pb-6" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default DynamicContentPage;
