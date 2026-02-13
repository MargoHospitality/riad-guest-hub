import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { checkTransportStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Car, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ContactSection from '@/components/ContactSection';

const CheckinGate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { validation } = useApp();
  
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
    navigate(`/checkin/transport?token=${token}`);
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
        <ContactSection />
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
                Online Check-in
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
                  <p className="text-sm font-semibold text-foreground">Your Transfer is Confirmed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    We'll pick you up as scheduled.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleViewDetails}
                className="w-full text-center text-xs font-medium text-primary underline-offset-2 hover:underline py-2"
              >
                View Details
              </button>
              
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors"
              >
                <span className="text-sm font-semibold text-primary">Continue to Check-in</span>
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
                  <p className="text-sm font-semibold text-foreground">Transfer Pending Confirmation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your transfer request has been received and will be confirmed shortly.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors"
              >
                <span className="text-sm font-semibold text-primary">Continue to Check-in</span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          )}
          
          {/* État 3: None - Simple Continue button */}
          {status === 'none' && (
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors border-t border-border"
              >
                <span className="text-sm font-semibold text-primary">Continue to Check-in</span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          )}
        </div>
      </main>
      
      <ContactSection />
    </div>
  );
};

export default CheckinGate;
