import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";

import { register, login, logout, getUserData } from "../api/Api";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    dispatch({
      type: HANDLERS.INITIALIZE,
    });
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    try {
      let response = await login(email, password);
      if (response.Token) {
        let information = await getUserInformation(response.Token);
        if (!information) {
          window.sessionStorage.setItem("informationStatus", false);
        }
        return response;
      }
      console.log("signIn Function | Unknown Response Received: " + JSON.stringify(response));
      return response;
    } catch (err) {
      console.log("signIn Function | Error: " + JSON.stringify(response));
      throw new Error(err.message);
    }
  };

  const signUp = async (
    phonenumber,
    password,
    repassword,
    firstname,
    lastname,
    email,
    birth,
    username,
    address,
    role
  ) => {
    try {
      let response = await register(
        phonenumber,
        password,
        repassword,
        firstname,
        lastname,
        email,
        birth,
        username,
        address,
        role
      );
      if (response.Success) {
        window.sessionStorage.setItem("informationStatus", true);
        window.sessionStorage.setItem("id", "");
        window.sessionStorage.setItem("firstName", firstname);
        window.sessionStorage.setItem("lastName", lastname);
        window.sessionStorage.setItem("phoneNumber", phonenumber);
        window.sessionStorage.setItem("birthDate", birth);
        window.sessionStorage.setItem("username", username);
        window.sessionStorage.setItem("address", address);
        window.sessionStorage.setItem("role", role);
        window.sessionStorage.setItem("email", email);
        window.sessionStorage.setItem("assessmentStatus", false);
        window.sessionStorage.setItem("role", role);
        window.sessionStorage.setItem("authenticated", "true");
        window.sessionStorage.setItem("token", response.Token);
        window.sessionStorage.setItem("accept", response.accept);
      }
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const signOut = () => {
    window.sessionStorage.clear();
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const getUserInformation = async (token) => {
    try {
      let userData = await getUserData(token);
      window.sessionStorage.setItem("informationStatus", true);
      window.sessionStorage.setItem("id", userData[0].id);
      window.sessionStorage.setItem("firstName", userData[0].first_name);
      window.sessionStorage.setItem("lastName", userData[0].last_name);
      window.sessionStorage.setItem("phoneNumber", userData[0].phonenumber);
      window.sessionStorage.setItem("birthDate", userData[0].birth);
      window.sessionStorage.setItem("username", userData[0].username);
      window.sessionStorage.setItem("address", userData[0].address);
      window.sessionStorage.setItem("role", userData[0].role);
      window.sessionStorage.setItem("email", userData[0].email);
      window.sessionStorage.setItem("assessmentStatus", userData[0].assessment);
      window.sessionStorage.setItem("role", userData[0].role);
      window.sessionStorage.setItem("authenticated", "true");
      window.sessionStorage.setItem("token", token);
      window.sessionStorage.setItem("accept", userData[0].accept);
      const user = {
        id: userData.id,
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: userData.first_name + " " + userData.last_name,
        email: userData.email,
      };
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
      return true;
    } catch (err) {
      throw new Error(
        "Something went wrong while fetching your information from the system. Please contact the administrator"
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        getUserInformation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
