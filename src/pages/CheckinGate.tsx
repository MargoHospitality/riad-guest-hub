import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { checkTransportStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Car, CheckCircle2, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CheckinGate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { validation } = useApp();
  
  // Fetch transport status
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
    
    // If transport via Margo Flow (confirmed or pending):
    // Skip manual transport step → go direct to guest-details
    if (status === 'confirmed' || status === 'pending') {
      navigate(`/checkin/guest-details?token=${token}`);
      return;
    }
    
    // Should not happen (handled by "I don't need" button)
    navigate(`/checkin/transport?token=${token}`);
  };
  
  const handleNoTransport = () => {
    // User doesn't want transport
    // → Navigate to manual transport step
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
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-accent/10 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-32 bg-accent/10 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const status = transportStatus?.status || 'none';
  const request = transportStatus?.request;
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-6">Online Check-in</h1>
        
        {/* État 1: Confirmed */}
        {status === 'confirmed' && request && (
          <div className="border-2 border-green-400 bg-green-50/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2.5 rounded-full bg-green-400/10 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-foreground">Your Transfer is Confirmed</h2>
                <p className="text-sm text-green-700 mt-1">
                  We'll pick you up as scheduled.
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="w-full mb-3 border-green-400 text-green-700 hover:bg-green-50"
            >
              View Details
            </Button>
            
            <Button
              onClick={handleContinue}
              className="w-full h-12 text-base font-semibold"
            >
              Continue to Check-in →
            </Button>
          </div>
        )}
        
        {/* État 2: Pending */}
        {status === 'pending' && (
          <div className="border-2 border-orange-400 bg-orange-50/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2.5 rounded-full bg-orange-400/10 shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-foreground">Transfer Pending Confirmation</h2>
                <p className="text-sm text-orange-700 mt-1">
                  Your transfer request has been received and will be confirmed by the property shortly.
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleContinue}
              className="w-full h-12 text-base font-semibold"
            >
              Continue to Check-in →
            </Button>
          </div>
        )}
        
        {/* État 3: None */}
        {status === 'none' && (
          <div className="border-2 border-accent bg-transparent rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2.5 rounded-full bg-accent/10 shrink-0">
                <Car className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-foreground">Need a Transfer?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We can arrange airport pickup or train station transfer for you.
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleRequestTransport}
              className="w-full h-12 text-base font-semibold mb-3"
            >
              Request Transfer via Margo Flow
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button
              onClick={handleNoTransport}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              I don't need a transfer →
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckinGate;
