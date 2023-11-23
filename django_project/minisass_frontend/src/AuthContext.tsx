import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { globalVariables } from '../src/utils';

// user type
type User = {
  username: string;
  email: string;
};

// context state and actions
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  refreshToken: null;
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER' }
  | { type: 'RESET_PASSWORD' }
  | { type: 'TOKEN_REFRESH' };


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  refreshToken: null,
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
          await axios.post(`${globalVariables.baseUrl}/authentication/api/logout/`);
          return {
            ...state,
            user: null,
            isAuthenticated: false,
          };
      } catch (error) {
        console.error('Logout error:', error);
      }
    case 'REGISTER':
      // Handle the registration action here. TODO
      return state;
    case 'RESET_PASSWORD':
      // Handle the reset password action here. TODO
      return state;
    case 'TOKEN_REFRESH':
      try {
        const response = await axios.post(`${globalVariables.baseUrl}/token/refresh/`, {
          refresh: state.refreshToken,
        });

        const newAccessToken = response.data.access;
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        const newAuthState = {
          ...state,
          access_token: newAccessToken,
        };
    
        localStorage.setItem('authState', JSON.stringify(newAuthState));
    
        return newAuthState;
      } catch (error) {
        console.error('Token refresh error:', error);
        return state;
      }
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
        const storedState = localStorage.getItem('authState');
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          const accessToken = parsedState.access_token;

          const response = await axios.get(`${globalVariables.baseUrl}/authentication/api/check-auth-status/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        
        const { is_authenticated, username, email } = response.data;
    
        if (is_authenticated === 'true') {
          dispatch({ type: 'LOGIN', payload: { username, email } });
          return true
        }
        }
      } catch (error) {
        console.error('Check auth status error:', error);
        return false
      }
      return false
    };

    checkAuthStatus();


    // Set up an interval to periodically refresh the token (10 mins)
    const intervalInMilliseconds = 10 * 60 * 1000;
    const tokenRefreshInterval = setInterval(async () => {
      const storedState = localStorage.getItem('authState');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const refreshToken = parsedState.userData.refresh_token;
        
        // Check if the user is authenticated before attempting to refresh the token
        if (parsedState.is_authenticated && refreshToken) {
          try {
            await tokenRefresh(dispatch, refreshToken);
          } catch (error) {
            console.error('Token refresh error:', error);
          }
        }
      }
    }, intervalInMilliseconds);

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

const tokenRefresh = async (dispatch: React.Dispatch<AuthAction>, refreshToken: string) => {
  try {
    dispatch({ type: 'TOKEN_REFRESH' });
  } catch (error) {
    console.error('Token refresh error:', error);
  }
};

export { AuthProvider, useAuth, login, logout, register, resetPassword, tokenRefresh };
