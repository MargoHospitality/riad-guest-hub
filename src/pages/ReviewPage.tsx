import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Textarea } from '@/components/ui/textarea';
import { Star, Mail, ExternalLink, Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FooterBar from '@/components/FooterBar';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_GEA_API_URL || 'https://gea.margo-hospitality.com/api/v1';

const SERVICES = ['breakfast', 'rooms', 'location', 'other'] as const;

interface ReviewFormData {
  ratingGlobal: number;
  ratingStaff: number;
  ratingCleanliness: number;
  servicesAppreciated: string[];
  otherService: string;
  suggestions: string;
}

const ReviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { validation } = useApp();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    ratingGlobal: 0,
    ratingStaff: 0,
    ratingCleanliness: 0,
    servicesAppreciated: [],
    otherService: '',
    suggestions: '',
  });

  const handleRatingChange = (field: keyof ReviewFormData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const services = prev.servicesAppreciated.includes(service)
        ? prev.servicesAppreciated.filter((s) => s !== service)
        : [...prev.servicesAppreciated, service];
      return { ...prev, servicesAppreciated: services };
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.ratingGlobal === 0) {
      toast({ title: t('review.error.ratingRequired'), variant: 'destructive' });
      return;
    }
    if (currentStep === 2 && formData.ratingStaff === 0) {
      toast({ title: t('review.error.ratingRequired'), variant: 'destructive' });
      return;
    }
    if (currentStep === 3 && formData.ratingCleanliness === 0) {
      toast({ title: t('review.error.ratingRequired'), variant: 'destructive' });
      return;
    }
    if (currentStep === 4 && formData.servicesAppreciated.length === 0) {
      toast({ title: t('review.error.serviceRequired'), variant: 'destructive' });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({ title: t('review.error.tokenMissing'), variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const services = formData.servicesAppreciated.map((s) =>
        s === 'other' && formData.otherService ? `other:${formData.otherService}` : s
      );

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ratingGlobal: formData.ratingGlobal,
          ratingStaff: formData.ratingStaff,
          ratingCleanliness: formData.ratingCleanliness,
          servicesAppreciated: services,
          suggestions: formData.suggestions || null,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setCurrentStep(6);
    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: t('review.error.submissionFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void) => (
    <div className="flex gap-3 justify-center my-5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-10 h-10 ${
              rating <= value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const googleReviewUrl = validation?.branding?.google_review_url;
  const contactEmail = validation?.branding?.contact_email;
  const shouldRedirectToGoogle = formData.ratingGlobal >= 4;

  // CTA button component matching app style
  const CTAButton = ({ onClick, label, disabled = false }: { onClick: () => void; label: string; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
    >
      <span className="text-sm font-semibold text-primary">{label}</span>
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
        <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
    </button>
  );

  if (!token || !validation) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <Header />
        <HeroSection />
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-card rounded-2xl shadow-md p-6 text-center">
            <p className="text-sm text-muted-foreground">{t('review.error.invalidToken')}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = 5;

  // Progress bar component (matches CheckinProgressBar style)
  const ReviewProgressBar = () => (
    <div className="flex items-center gap-2 px-4 py-3">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <button
          key={step}
          type="button"
          onClick={() => {
            if (step < currentStep) setCurrentStep(step);
          }}
          className={`rounded-full transition-all ${
            step < currentStep ? 'bg-primary w-2 h-2 hover:opacity-70 cursor-pointer' :
            step === currentStep ? 'bg-primary w-6 h-2' :
            'bg-border w-2 h-2 cursor-default'
          }`}
          aria-label={`Step ${step}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />

      {currentStep <= totalSteps && <ReviewProgressBar />}

      <main className="flex-1 px-4 relative z-10 pb-4">
        {/* Step 1: Global Rating */}
        {currentStep === 1 && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.q1.title')}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 pl-[18px]">{t('review.q1.subtitle')}</p>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3">
              {renderStarRating(formData.ratingGlobal, (rating) =>
                handleRatingChange('ratingGlobal', rating)
              )}
              <CTAButton onClick={handleNext} label={t('review.next')} />
            </div>
          </div>
        )}

        {/* Step 2: Staff Rating */}
        {currentStep === 2 && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.q2.title')}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 pl-[18px]">{t('review.q2.subtitle')}</p>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3">
              {renderStarRating(formData.ratingStaff, (rating) =>
                handleRatingChange('ratingStaff', rating)
              )}
              <CTAButton onClick={handleNext} label={t('review.next')} />
            </div>
          </div>
        )}

        {/* Step 3: Cleanliness Rating */}
        {currentStep === 3 && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.q3.title')}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 pl-[18px]">{t('review.q3.subtitle')}</p>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3">
              {renderStarRating(formData.ratingCleanliness, (rating) =>
                handleRatingChange('ratingCleanliness', rating)
              )}
              <CTAButton onClick={handleNext} label={t('review.next')} />
            </div>
          </div>
        )}

        {/* Step 4: Services Appreciated */}
        {currentStep === 4 && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.q4.title')}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 pl-[18px]">{t('review.q4.subtitle')}</p>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3 space-y-2">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`w-full p-3.5 rounded-xl border transition-all flex items-center justify-between text-left ${
                    formData.servicesAppreciated.includes(service)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{t(`review.q4.services.${service}`)}</span>
                  {formData.servicesAppreciated.includes(service) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
              {formData.servicesAppreciated.includes('other') && (
                <Textarea
                  value={formData.otherService}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otherService: e.target.value }))}
                  placeholder={t('review.q4.otherPlaceholder')}
                  className="mt-2 bg-card border-border text-sm min-h-[60px]"
                  rows={2}
                />
              )}
              <CTAButton onClick={handleNext} label={t('review.next')} />
            </div>
          </div>
        )}

        {/* Step 5: Suggestions */}
        {currentStep === 5 && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.q5.title')}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 pl-[18px]">{t('review.q5.subtitle')}</p>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3">
              <Textarea
                value={formData.suggestions}
                onChange={(e) => setFormData((prev) => ({ ...prev, suggestions: e.target.value }))}
                placeholder={t('review.q5.placeholder')}
                className="bg-card border-border text-sm min-h-[100px]"
                rows={4}
              />
              <CTAButton
                onClick={handleSubmit}
                label={isSubmitting ? t('review.submitting') : t('review.submit')}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Final Screen: Positive (4-5 stars) */}
        {currentStep === 6 && shouldRedirectToGoogle && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-primary" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.success.positiveTitle')}
                </h1>
              </div>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </div>
                <p className="text-sm text-muted-foreground flex-1">{t('review.success.positiveMessage')}</p>
              </div>
              {googleReviewUrl && (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors mb-2"
                >
                  <span className="text-sm font-semibold text-primary flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {t('review.success.googleButton')}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </a>
              )}
              <button
                onClick={() => navigate(`/?token=${token}`)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border group hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">{t('review.success.backHome')}</span>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Final Screen: Negative (1-3 stars) */}
        {currentStep === 6 && !shouldRedirectToGoogle && (
          <div className="bg-card rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-4 rounded-full bg-accent" />
                <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                  {t('review.success.negativeTitle')}
                </h1>
              </div>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground flex-1">{t('review.success.negativeMessage')}</p>
              </div>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-accent/5 rounded-xl group hover:bg-accent/10 transition-colors mb-2"
                >
                  <span className="text-sm font-semibold text-accent flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('review.success.emailButton')}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                </a>
              )}
              <button
                onClick={() => navigate(`/?token=${token}`)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border group hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">{t('review.success.backHome')}</span>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      <FooterBar />
    </div>
  );
};

export default ReviewPage;
