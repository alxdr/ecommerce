import React, { useState, useEffect, useCallback, Suspense } from "react";
import axios from "axios";
import url from "url";
import history from "../helpers/history";
import NavBar from "./navbar";
import ErrorBoundary from "./errbound";

const SEARCH = "/search";
const ERROR = "/error";
const ROOT = "/";
const LOGIN = "/login";
const REGISTER = "/register";
const CART = "/cart";
const CONNECT = "/connect";
const SELL = "/sell";
const PROFILE = "/profile";
const CHECKOUT = "/cart/checkout";
const TRANSACTION = "/profile/transaction";
const PRODUCT = "/product";
const EDIT = "/profile/edit/selling";
const REVIEWING = "/profile/transaction/reviewing";
const REVIEW = "/profile/transaction/review";
const ANSWER = "/answer";

const pages = {
  [ROOT]: React.lazy(() => import("./carousel")),
  [SEARCH]: React.lazy(() => import("./search")),
  [ERROR]: React.lazy(() => import("./error")),
  [LOGIN]: React.lazy(() => import("./login")),
  [REGISTER]: React.lazy(() => import("./register")),
  [CART]: React.lazy(() => import("./shoppingcart")),
  [CONNECT]: React.lazy(() => import("./connect")),
  [SELL]: React.lazy(() => import("./sell")),
  [PROFILE]: React.lazy(() => import("./profile")),
  [CHECKOUT]: React.lazy(() => import("./shoppingcart")),
  [TRANSACTION]: React.lazy(() => import("./transaction")),
  [PRODUCT]: React.lazy(() => import("./product")),
  [EDIT]: React.lazy(() => import("./edit")),
  [REVIEWING]: React.lazy(() => import("./reviewing")),
  [REVIEW]: React.lazy(() => import("./review")),
  [ANSWER]: React.lazy(() => import("./answer"))
};

const Home = React.memo(() => {
  const [cart, setCart] = useState([]);
  const [showRoute, setShowRoute] = useState(ROOT);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState({
    search: null,
    transaction: null,
    product: null,
    edit: null,
    review: null,
    reviewing: null,
    answer: null
  });
  const {
    search: searchData,
    transaction: transactionData,
    product: productData,
    edit: editData,
    review: reviewData,
    reviewing: reviewingData,
    answer: answerData
  } = data;

  const renderURL = useCallback(location => {
    const { pathname } = url.parse(location.pathname);
    setData(prevData => ({ ...prevData, ...location.state }));
    setShowRoute(pathname);
  });

  useEffect(() => {
    const unlisten = history.listen(renderURL);
    history.replace(ROOT);
    return unlisten;
  }, []);

  useEffect(() => {
    axios.get("/check").then(res => {
      const { loggedIn, connected } = res.data;
      if (loggedIn) {
        setIsLoggedIn(loggedIn);
        setIsConnected(connected);
      }
    });
  }, []);

  const login = useCallback(connected => {
    setIsLoggedIn(true);
    setIsConnected(connected);
    history.push(ROOT);
  }, []);

  const logout = useCallback(() => {
    axios
      .get("/logout")
      .then(() => setIsLoggedIn(false))
      .catch(nextError => setError(nextError));
  }, []);

  const showSearch = useCallback(
    ({ result, query }) => {
      setData(prevData => ({ ...prevData, search: result }));
      history.push(`${SEARCH}?query=${query}`);
    },
    [data]
  );

  const showError = useCallback(nextError => {
    setError(nextError);
    history.push(ERROR);
  }, []);

  const showCheckOut = useCallback(
    () => {
      if (isLoggedIn) {
        history.push(CHECKOUT);
      } else {
        showError(Error("Sorry, you have to log in first."));
      }
    },
    [isLoggedIn]
  );

  const addToCart = useCallback(id => setCart(prevCart => [...prevCart, id]), [
    cart
  ]);

  const removeFromCart = useCallback(
    index => {
      if (cart[index]) {
        setCart(prevCart => {
          const nextCart = prevCart.slice();
          nextCart.splice(index, 1);
          return nextCart;
        });
      }
    },
    [cart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const pageProps = {
    [ROOT]: {},
    [SEARCH]: { data: searchData, addToCart },
    [ERROR]: { error },
    [LOGIN]: { auth: login },
    [REGISTER]: { auth: login },
    [CART]: {
      cart,
      removeFromCart,
      showError,
      showCheckOut,
      clearCart,
      checkOut: false
    },
    [CONNECT]: {},
    [SELL]: { showError },
    [PROFILE]: { showError },
    [CHECKOUT]: {
      cart,
      removeFromCart,
      showError,
      showCheckOut,
      clearCart,
      checkOut: true
    },
    [TRANSACTION]: { showError, transaction: transactionData },
    [PRODUCT]: {
      product: productData,
      showError,
      addToCart
    },
    [EDIT]: { showError, edit: editData },
    [REVIEWING]: { showError, reviewing: reviewingData },
    [REVIEW]: { review: reviewData },
    [ANSWER]: { answer: answerData, showError }
  };
  const Component = pages[showRoute];
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar
          showSearch={showSearch}
          showError={showError}
          logout={logout}
          loggedIn={isLoggedIn}
          connected={isConnected}
          counter={cart.length}
        />
        <main className="container-fluid mt-5 pt-3" id="container">
          <Component {...pageProps[showRoute]} />
        </main>
      </Suspense>
    </ErrorBoundary>
  );
});

export default Home;
