// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import DeviceRedirect from './components/DeviceRedirect';
import CompleteProfileModal from './components/CompleteProfileModal';
import LegalDisclaimerModal from './components/LegalDisclaimerModal';
import useCompleteProfile from './hooks/useCompleteProfile';
import { RentalCartProvider } from './contexts/RentalCartContext';

// ----------------------------------------------------------------------

function AppContent() {
  const { showCompleteProfile, handleCompleteProfile, handleSkipCompleteProfile } = useCompleteProfile();

  return (
    <>
      <ProgressBarStyle />
      <ChartStyle />
      {/* <Settings /> */}
      <ScrollToTop />
  <LegalDisclaimerModal />
      <Router />
      
      <CompleteProfileModal
        open={showCompleteProfile}
        onClose={handleSkipCompleteProfile}
        onComplete={handleCompleteProfile}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <RentalCartProvider>
                <MotionLazyContainer>
                  <AppContent />
                </MotionLazyContainer>
              </RentalCartProvider>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
