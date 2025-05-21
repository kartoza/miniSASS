import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Action types
export const OPEN_PRIVACY_MODAL = 'OPEN_PRIVACY_MODAL';
export const CLOSE_PRIVACY_MODAL = 'CLOSE_PRIVACY_MODAL';

// State type
type PrivacyConsentState = {
  isPrivacyModalOpen: boolean;
};

// Action type
type PrivacyConsentAction =
  | { type: typeof OPEN_PRIVACY_MODAL }
  | { type: typeof CLOSE_PRIVACY_MODAL };

// Context type
type PrivacyConsentContextType = {
  state: PrivacyConsentState;
  dispatch: React.Dispatch<PrivacyConsentAction>;
};

// Initial state
const initialState: PrivacyConsentState = {
  isPrivacyModalOpen: false,
};

// Create context
const PrivacyConsentContext = createContext<PrivacyConsentContextType | undefined>(undefined);

// Reducer function
function privacyConsentReducer(state: PrivacyConsentState, action: PrivacyConsentAction): PrivacyConsentState {
  switch (action.type) {
    case OPEN_PRIVACY_MODAL:
      return {
        ...state,
        isPrivacyModalOpen: true,
      };
    case CLOSE_PRIVACY_MODAL:
      return {
        ...state,
        isPrivacyModalOpen: false,
      };
    default:
      return state;
  }
}

// Provider component
export const PrivacyConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(privacyConsentReducer, initialState);

  return (
    <PrivacyConsentContext.Provider value={{ state, dispatch }}>
      {children}
    </PrivacyConsentContext.Provider>
  );
};

// Custom hook to use the context
export const usePrivacyConsent = (): PrivacyConsentContextType => {
  const context = useContext(PrivacyConsentContext);
  if (context === undefined) {
    throw new Error('usePrivacyConsent must be used within a PrivacyConsentProvider');
  }
  return context;
};
