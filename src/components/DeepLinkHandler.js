import { useDeepLink } from '../hooks/useDeepLink';

export default function DeepLinkHandler() {
  // Initialize deep link handling within Router context
  useDeepLink();
  
  // This component doesn't render anything, it just initializes the deep link handling
  return null;
} 