import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPageContent } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import HeroSection from "./HeroSection";

import { Loader2, ArrowLeft } from "lucide-react";

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
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { pageCode } = useParams<{ pageCode: string }>();
  const pageSlug = pageSlugProp || pageCode || "";
  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ["pageContent", pageSlug, i18n.language],
    queryFn: () => fetchPageContent(pageSlug, undefined, i18n.language),
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
              {/* Back button + Title */}
              <div className="flex items-center gap-2.5 mb-4">
                <button
                  onClick={() => navigate("/")}
                  className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
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

      
      
    </div>
  );
};

export default DynamicContentPage;
