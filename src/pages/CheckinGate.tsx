import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { checkTransportStatus } from '@/lib/api';
import { useSaveCheckinResponse, useCheckinResponse } from '@/hooks/useCheckinResponse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, CheckCircle2, Clock, ArrowRight, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';


interface ManualTransportForm {
  arrivalMethod: string;
  arrivalTime: string;
  details?: string;
}

const CheckinGate = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { validation } = useApp();
  const [showManualForm, setShowManualForm] = useState(false);
  const saveResponse = useSaveCheckinResponse();
  const { data: checkinData } = useCheckinResponse(token);
  
  // Redirect to home if check-in already completed
  useEffect(() => {
    if (checkinData?.out_completed_at || checkinData?.completed_at) {
      navigate(`/?token=${token}`);
    }
  }, [checkinData, navigate, token]);
  
  const form = useForm<ManualTransportForm>({
    defaultValues: {
      arrivalMethod: '',
      arrivalTime: '',
      details: '',
    },
    mode: 'onChange',
  });
  
  const arrivalMethod = form.watch('arrivalMethod');
  const arrivalTime = form.watch('arrivalTime');
  
  const { data: transportStatus, isLoading } = useQuery({
    queryKey: ['transportStatus', validation?.reservation?.reservation_id],
    queryFn: () => checkTransportStatus(validation!.reservation!.reservation_id),
    enabled: !!validation?.reservation?.reservation_id,
    refetchOnMount: true,
  });
  
  const handleRequestTransport = () => {
    if (!validation?.reservation) return;
    const { cloudbeds_property_id, reservation_id, check_in_date } = validation.reservation;
    if (!cloudbeds_property_id) {
      console.error('No Cloudbeds property ID available');
      return;
    }
    const params = new URLSearchParams({
      riad: cloudbeds_property_id,
      reservation: reservation_id,
      checkin: check_in_date,
      returnTo: 'checkin',
      token: token!,
      lang: i18n.language,
    });
    window.location.href = `https://margo-flow.vercel.app/?${params.toString()}`;
  };
  
  const handleContinue = () => {
    const status = transportStatus?.status || 'none';
    if (status === 'confirmed' || status === 'pending') {
      navigate(`/checkin/guest-details?token=${token}`);
      return;
    }
    navigate(`/checkin/transport?token=${token}`);
  };
  
  const handleNoTransport = () => {
    setShowManualForm(true);
  };
  
  const handleManualSubmit = async (data: ManualTransportForm) => {
    if (!token) return;
    
    try {
      await saveResponse.mutateAsync({
        token,
        transport_status: 'manual',
        transport_method: data.arrivalMethod,
        transport_details: data.details || null,
        arrival_time: data.arrivalTime,
      });
      
      navigate(`/checkin/guest-details?token=${token}`);
    } catch (error) {
      console.error('Failed to save transport details:', error);
    }
  };
  
  const handleViewDetails = () => {
    if (transportStatus?.request?.public_token) {
      window.open(
        `https://flow.margo-hospitality.com/confirmation/${transportStatus.request.public_token}`,
        '_blank'
      );
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <Header />
        <HeroSection />
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-card rounded-2xl shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const status = transportStatus?.status || 'none';
  const request = transportStatus?.request;
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />
      
      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        {/* Main card — mirrors ReservationSummary style */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          {/* Title bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-0.5 h-4 rounded-full bg-accent" />
              <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                {t('checkin.gate.title')}
              </h1>
            </div>
          </div>

          {/* État 1: Confirmed */}
          {status === 'confirmed' && request && (
            <div className="px-4 pb-4">
              <div className="flex items-start gap-3 py-3 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t('checkin.gate.transportConfirmed')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('checkin.gate.transportConfirmedDescription')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleViewDetails}
                className="w-full text-center text-xs font-medium text-primary underline-offset-2 hover:underline py-2"
              >
                {t('checkin.gate.viewDetails')}
              </button>
              
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors"
              >
                <span className="text-sm font-semibold text-primary">{t('checkin.gate.continue')}</span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          )}
          
          {/* État 2: Pending */}
          {status === 'pending' && (
            <div className="px-4 pb-4">
              <div className="flex items-start gap-3 py-3 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t('checkin.gate.transportPending')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('checkin.gate.transportPendingDescription')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors"
              >
                <span className="text-sm font-semibold text-primary">{t('checkin.gate.continue')}</span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          )}
          
          {/* État 3: None - Transport options */}
          {status === 'none' && !showManualForm && (
            <div className="border-t border-border">
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t('checkin.gate.needTransport')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('checkin.gate.transportDescription')}
                  </p>
                </div>
              </div>
              
              <div className="px-4 pb-4 space-y-2">
                <button
                  onClick={handleRequestTransport}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-accent/5 rounded-xl group hover:bg-accent/10 transition-colors"
                >
                  <span className="text-sm font-semibold text-accent">{t('checkin.gate.requestWithMargoFlow')}</span>
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center group-hover:bg-accent/90 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                </button>
                
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">{t('checkin.gate.or')}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNoTransport}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border group hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{t('checkin.gate.noTransport')}</span>
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* État 4: Manual transport form */}
          {status === 'none' && showManualForm && (
            <div className="border-t border-border px-4 pb-4">
              <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-3 pt-3">
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5">
                  <Car className="w-4 h-4 text-primary shrink-0" />
                  <Select
                    value={arrivalMethod}
                    onValueChange={(value) => form.setValue('arrivalMethod', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="bg-card border-border h-9 text-sm">
                      <SelectValue placeholder={t('checkin.gate.transportMode')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal_car">{t('checkin.gate.personalCar')}</SelectItem>
                      <SelectItem value="other_taxi">{t('checkin.gate.otherTaxi')}</SelectItem>
                      <SelectItem value="tour_operator">{t('checkin.gate.tourOperator')}</SelectItem>
                      <SelectItem value="other">{t('checkin.gate.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <Input
                    type="time"
                    {...form.register('arrivalTime', { required: true })}
                    placeholder={t('checkin.gate.arrivalTime')}
                    className="bg-card border-border h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground pl-3">{t('checkin.gate.comments')}</label>
                  <Textarea
                    {...form.register('details')}
                    placeholder={t('checkin.gate.commentsPlaceholder')}
                    className="bg-card border-border text-sm min-h-[80px]"
                    rows={3}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!arrivalMethod || !arrivalTime || saveResponse.isPending}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <span className="text-sm font-semibold text-primary">
                    {saveResponse.isPending ? t('checkin.gate.saving') : t('checkin.gate.continueButton')}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      
      
    </div>
  );
};

export default CheckinGate;
