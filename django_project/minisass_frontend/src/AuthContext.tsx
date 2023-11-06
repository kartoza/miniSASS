import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Define your user type
type User = {
  username: string;
  // Add other user-related fields
};

// Define the context state and actions
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  // You can add other relevant fields here, such as tokens, user data, etc.
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER' }
  | { type: 'RESET_PASSWORD' }
  | { type: 'TOKEN_REFRESH' };

// Define your initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  // You can initialize other state fields here.
};

// Create the context
const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined>(
  undefined
);

// Define the reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'REGISTER':
      // Handle the registration action here.
      // You can update the state based on the registration logic.
      return state;
    case 'RESET_PASSWORD':
      // Handle the reset password action here.
      // You can update the state based on the reset password logic.
      return state;
    case 'TOKEN_REFRESH':
      // Handle the token refresh action here.
      // You can update the state based on the token refresh logic.
      return state;
    default:
      return state;
  }
};


const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load the state from local storage (if available)
  useEffect(() => {
    const storedState = localStorage.getItem('authState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      dispatch({ type: 'LOGIN', payload: parsedState.user });
    }
  }, []); // Only run this effect on mount

  return (
    <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
  );
};

// Create hooks and functions for using the context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Implement functions to dispatch actions
const login = (dispatch: React.Dispatch<AuthAction>, user: User) => {
  dispatch({ type: 'LOGIN', payload: user });
};

const logout = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'LOGOUT' });
};

const register = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'REGISTER' });
};

const resetPassword = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'RESET_PASSWORD' });
};

const tokenRefresh = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'TOKEN_REFRESH' });
};

export { AuthProvider, useAuth, login, logout, register, resetPassword, tokenRefresh };
