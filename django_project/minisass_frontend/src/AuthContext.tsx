import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { globalVariables } from '../src/utils';

// Define user type
type User = {
  username: string;
};

// Define the context state and actions
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
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
};

// Create the context
const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined>(
  undefined
);

// Define the reducer function
const authReducer = async (state: AuthState, action: AuthAction): Promise<AuthState> => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      try {
          await axios.post(`${globalVariables.baseUrl}/en//authentication/api/logout/`);
          return {
            ...state,
            user: null,
            isAuthenticated: false,
          };
      } catch (error) {
        console.error('Logout error:', error);
      }
    case 'REGISTER':
      // Handle the registration action here.
      return state;
    case 'RESET_PASSWORD':
      // Handle the reset password action here.
      return state;
    case 'TOKEN_REFRESH':
      // Handle the token refresh action here.
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

    // Check the user's authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${globalVariables.baseUrl}/authentication/api/check-auth-status/`);
        const { is_authenticated, username, email } = response.data;
        
        if (is_authenticated) {
          dispatch({ type: 'LOGIN', payload: { username, email } });
        }
      } catch (error) {
        console.error('Check auth status error:', error);
      }
    };

    checkAuthStatus();
  }, []); // Only run this effect on mount

  return (
    <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
  );
};

// hooks and functions for using the context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// functions to dispatch actions
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
