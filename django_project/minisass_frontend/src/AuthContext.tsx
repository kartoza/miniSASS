import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer
} from 'react';
import axios from 'axios';
import { globalVariables } from '../src/utils';

export type ActionTypes = 'OPEN_LOGIN_MODAL';
export const OPEN_LOGIN_MODAL: ActionTypes = 'OPEN_LOGIN_MODAL';

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
  openLoginModal: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER' }
  | { type: 'RESET_PASSWORD' }
  | { type: 'TOKEN_REFRESH'; payload: string }
  | { type: ActionTypes; payload: boolean };


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  refreshToken: null,
  openLoginModal: false
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
      try {
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
      const newAuthState = {
        ...state,
        access_token: action.payload,
      };
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return newAuthState;
    case OPEN_LOGIN_MODAL:
      return {
        ...state,
        openLoginModal: action.payload,
      };
    default:
      return state;
  }
};


const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load the state from local storage (if available)
  useEffect(() => {

    const checkAuthStatus = async () => {
      try {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          const accessToken = parsedState.userData.access_token;

          const response = await axios.get(`${globalVariables.baseUrl}/authentication/api/check-auth-status/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.status == 200) {
            dispatch({ type: 'LOGIN', payload: parsedState.userData });
          }

        }
      } catch (error) {
        console.error('Check auth status error:', error);
      }
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
    <AuthContext.Provider
      value={{ state, dispatch }}>{children}</AuthContext.Provider>
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
  localStorage.removeItem('authState');
  dispatch({ type: 'LOGOUT' });
  axios.post(`${globalVariables.baseUrl}/authentication/api/logout/`);
};

const register = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'REGISTER' });
};

const resetPassword = (dispatch: React.Dispatch<AuthAction>) => {
  dispatch({ type: 'RESET_PASSWORD' });
};

const tokenRefresh = async (dispatch: React.Dispatch<AuthAction>, refreshToken: string) => {
  try {
    const response = await axios.post(`${globalVariables.baseUrl}/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    dispatch({ type: 'TOKEN_REFRESH', payload: newAccessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
  }
};

export {
  AuthProvider,
  useAuth,
  login,
  logout,
  register,
  resetPassword,
  tokenRefresh
};
