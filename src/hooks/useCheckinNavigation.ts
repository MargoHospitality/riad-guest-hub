/**
 * Hook for check-in navigation that respects configuration
 * Created: 2026-02-16
 * 
 * Provides navigation helpers that skip disabled steps
 */

import { useNavigate } from 'react-router-dom';
import { useCheckinConfig } from './useCheckinConfig';
import { useApp } from '@/contexts/AppContext';

type CheckinStep = 
  | 'transport'
  | 'guest-details'
  | 'restaurant'
  | 'bedding'
  | 'other'
  | 'success';

const STEP_PATHS: Record<CheckinStep, string> = {
  'transport': '/checkin/transport',
  'guest-details': '/checkin/guest-details',
  'restaurant': '/checkin/restaurant',
  'bedding': '/checkin/bedding',
  'other': '/checkin/other',
  'success': '/checkin/success',
};

export function useCheckinNavigation() {
  const navigate = useNavigate();
  const { data: config } = useCheckinConfig();
  const { validation } = useApp();
  
  const token = validation?.token;
  const hasTransportFromMargoFlow = false; // TODO: implement transport detection
  
  /**
   * Get ordered list of enabled steps
   */
  const getEnabledSteps = (): CheckinStep[] => {
    if (!config) {
      // Default: all steps enabled
      return ['transport', 'guest-details', 'restaurant', 'bedding', 'other', 'success'];
    }
    
    const steps: CheckinStep[] = [];
    
    // Transport (skip if already handled by Margo Flow)
    if (config.step_transport_enabled && !hasTransportFromMargoFlow) {
      steps.push('transport');
    }
    
    // Guest details
    if (config.step_guest_details_enabled) {
      steps.push('guest-details');
    }
    
    // Restaurant
    if (config.step_restauration_enabled) {
      steps.push('restaurant');
    }
    
    // Bedding
    if (config.step_bedding_enabled) {
      steps.push('bedding');
    }
    
    // Other requests
    if (config.step_other_requests_enabled) {
      steps.push('other');
    }
    
    // Success is always last
    steps.push('success');
    
    return steps;
  };
  
  /**
   * Navigate to next enabled step
   */
  const goToNextStep = (currentStep: CheckinStep) => {
    const enabledSteps = getEnabledSteps();
    const currentIndex = enabledSteps.indexOf(currentStep);
    
    if (currentIndex === -1) {
      // Current step not found, go to first enabled step
      const firstStep = enabledSteps[0];
      const path = STEP_PATHS[firstStep];
      navigate(`${path}?token=${token}`);
      return;
    }
    
    // Get next step
    const nextStep = enabledSteps[currentIndex + 1];
    
    if (!nextStep) {
      // No next step, go to success
      navigate(`/checkin/success?token=${token}`);
      return;
    }
    
    const path = STEP_PATHS[nextStep];
    navigate(`${path}?token=${token}`);
  };
  
  /**
   * Navigate to previous enabled step
   */
  const goToPreviousStep = (currentStep: CheckinStep) => {
    const enabledSteps = getEnabledSteps();
    const currentIndex = enabledSteps.indexOf(currentStep);
    
    if (currentIndex <= 0) {
      // No previous step, go to gate
      navigate(`/checkin/gate?token=${token}`);
      return;
    }
    
    const prevStep = enabledSteps[currentIndex - 1];
    const path = STEP_PATHS[prevStep];
    navigate(`${path}?token=${token}`);
  };
  
  /**
   * Get current step progress (for breadcrumb/progress bar)
   */
  const getStepProgress = (currentStep: CheckinStep): { current: number; total: number } => {
    const enabledSteps = getEnabledSteps();
    const currentIndex = enabledSteps.indexOf(currentStep);
    
    return {
      current: currentIndex + 1,
      total: enabledSteps.length,
    };
  };
  
  return {
    goToNextStep,
    goToPreviousStep,
    getEnabledSteps,
    getStepProgress,
  };
}
