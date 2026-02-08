import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchPageContent } from "@/lib/api";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";
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
      <Breadcrumb currentPage={pageData?.title || fallbackTitle} />

      {/* Hero Image */}
      {pageData?.hero_image_url && (
        <div className="w-full h-56">
          <img
            src={pageData.hero_image_url}
            alt={pageData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Cette page n'est pas encore configurée.
            </p>
            {fallbackContent && (
              <div className="mt-6">{fallbackContent}</div>
            )}
          </div>
        ) : pageData ? (
          <>
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-foreground font-serif mb-6">
              {pageData.title}
            </h1>

            {/* Dynamic HTML Content */}
            <article
              className="prose prose-sm max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.content_html }}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Cette page n'est pas encore configurée.
            </p>
            {fallbackContent && (
              <div className="mt-6">{fallbackContent}</div>
            )}
          </div>
        )}
      </main>

      <div className="pb-10" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default DynamicContentPage;
