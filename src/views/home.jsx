import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import url from "url";
import NavBar from "./navbar";
import Carousel from "./carousel";
import Search from "./search";
import Login from "./login";
import Register from "./register";
import ShoppingCart from "./shoppingcart";
import Connect from "./connect";
import Err from "./error";
import history from "../helpers/history";
import Sell from "./sell";
import Profile from "./profile";
import ErrorBoundary from "./errbound";
import Product from "./product";
import Transaction from "./transaction";
import Edit from "./edit";
import Review from "./review";
import Reviewing from "./reviewing";
import Answer from "./answer";

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
  [ROOT]: Carousel,
  [SEARCH]: Search,
  [ERROR]: Err,
  [LOGIN]: Login,
  [REGISTER]: Register,
  [CART]: ShoppingCart,
  [CONNECT]: Connect,
  [SELL]: Sell,
  [PROFILE]: Profile,
  [CHECKOUT]: ShoppingCart,
  [TRANSACTION]: Transaction,
  [PRODUCT]: Product,
  [EDIT]: Edit,
  [REVIEWING]: Reviewing,
  [REVIEW]: Review,
  [ANSWER]: Answer
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
    </ErrorBoundary>
  );
});

export default Home;
