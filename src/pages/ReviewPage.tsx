import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Mail, ExternalLink, Check } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
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

      // Show final screen based on rating
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
    <div className="flex gap-2 justify-center my-6">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-12 h-12 ${
              rating <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const googleReviewUrl = validation?.branding?.google_review_url;
  const contactEmail = validation?.branding?.contact_email;
  const shouldRedirectToGoogle = formData.ratingGlobal >= 4;

  if (!token || !validation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-slate-600">{t('review.error.invalidToken')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <Header />
      <HeroSection />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step 1: Global Rating */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {t('review.q1.title')}
            </h2>
            <p className="text-center text-slate-600 mb-4">{t('review.q1.subtitle')}</p>
            {renderStarRating(formData.ratingGlobal, (rating) =>
              handleRatingChange('ratingGlobal', rating)
            )}
            <Button onClick={handleNext} className="w-full mt-6" size="lg">
              {t('review.next')}
            </Button>
          </div>
        )}

        {/* Step 2: Staff Rating */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {t('review.q2.title')}
            </h2>
            <p className="text-center text-slate-600 mb-4">{t('review.q2.subtitle')}</p>
            {renderStarRating(formData.ratingStaff, (rating) =>
              handleRatingChange('ratingStaff', rating)
            )}
            <Button onClick={handleNext} className="w-full mt-6" size="lg">
              {t('review.next')}
            </Button>
          </div>
        )}

        {/* Step 3: Cleanliness Rating */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {t('review.q3.title')}
            </h2>
            <p className="text-center text-slate-600 mb-4">{t('review.q3.subtitle')}</p>
            {renderStarRating(formData.ratingCleanliness, (rating) =>
              handleRatingChange('ratingCleanliness', rating)
            )}
            <Button onClick={handleNext} className="w-full mt-6" size="lg">
              {t('review.next')}
            </Button>
          </div>
        )}

        {/* Step 4: Services Appreciated */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {t('review.q4.title')}
            </h2>
            <p className="text-center text-slate-600 mb-6">{t('review.q4.subtitle')}</p>
            <div className="space-y-3">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                    formData.servicesAppreciated.includes(service)
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-left font-medium">{t(`review.q4.services.${service}`)}</span>
                  {formData.servicesAppreciated.includes(service) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            {formData.servicesAppreciated.includes('other') && (
              <Textarea
                value={formData.otherService}
                onChange={(e) => setFormData((prev) => ({ ...prev, otherService: e.target.value }))}
                placeholder={t('review.q4.otherPlaceholder')}
                className="mt-4"
                rows={2}
              />
            )}
            <Button onClick={handleNext} className="w-full mt-6" size="lg">
              {t('review.next')}
            </Button>
          </div>
        )}

        {/* Step 5: Suggestions */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {t('review.q5.title')}
            </h2>
            <p className="text-center text-slate-600 mb-6">{t('review.q5.subtitle')}</p>
            <Textarea
              value={formData.suggestions}
              onChange={(e) => setFormData((prev) => ({ ...prev, suggestions: e.target.value }))}
              placeholder={t('review.q5.placeholder')}
              className="min-h-32"
              rows={5}
            />
            <Button
              onClick={handleSubmit}
              className="w-full mt-6"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('review.submitting') : t('review.submit')}
            </Button>
          </div>
        )}

        {/* Final Screen: Positive (4-5 stars) */}
        {currentStep === 6 && shouldRedirectToGoogle && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600 fill-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {t('review.success.positiveTitle')}
            </h2>
            <p className="text-slate-600 mb-6">{t('review.success.positiveMessage')}</p>
            {googleReviewUrl && (
              <Button
                asChild
                className="w-full mb-4"
                size="lg"
              >
                <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {t('review.success.googleButton')}
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate(`/?token=${token}`)} className="w-full">
              {t('review.success.backHome')}
            </Button>
          </div>
        )}

        {/* Final Screen: Negative (1-3 stars) */}
        {currentStep === 6 && !shouldRedirectToGoogle && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {t('review.success.negativeTitle')}
            </h2>
            <p className="text-slate-600 mb-6">{t('review.success.negativeMessage')}</p>
            {contactEmail && (
              <Button
                asChild
                className="w-full mb-4"
                size="lg"
              >
                <a href={`mailto:${contactEmail}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  {t('review.success.emailButton')}
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate(`/?token=${token}`)} className="w-full">
              {t('review.success.backHome')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
