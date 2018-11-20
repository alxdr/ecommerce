import React from "react";
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

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      show: ROOT,
      searchData: null,
      error: null,
      connected: false,
      loggedIn: false,
      transaction: null,
      product: null,
      edit: null,
      review: null,
      reviewing: null,
      answer: null
    };
    this.renderURL = this.renderURL.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.showSearch = this.showSearch.bind(this);
    this.showError = this.showError.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.showCheckOut = this.showCheckOut.bind(this);
  }

  componentWillMount() {
    const {
      cart,
      searchData,
      error,
      transaction,
      product,
      edit,
      review,
      reviewing,
      answer
    } = this.state;
    this.pages = {
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
    this.pageProps = {
      [ROOT]: {},
      [SEARCH]: { data: searchData, addToCart: this.addToCart },
      [ERROR]: { error },
      [LOGIN]: { auth: this.login },
      [REGISTER]: { auth: this.login },
      [CART]: {
        cart,
        removeFromCart: this.removeFromCart,
        showError: this.showError,
        showCheckOut: this.showCheckOut,
        clearCart: this.clearCart,
        checkOut: false
      },
      [CONNECT]: {},
      [SELL]: { showError: this.showError },
      [PROFILE]: { showError: this.showError },
      [CHECKOUT]: {
        cart,
        removeFromCart: this.removeFromCart,
        showError: this.showError,
        showCheckOut: this.showCheckOut,
        clearCart: this.clearCart,
        checkOut: true
      },
      [TRANSACTION]: { showError: this.showError, transaction },
      [PRODUCT]: { product, showError: this.showError },
      [EDIT]: { showError: this.showError, edit },
      [REVIEWING]: { showError: this.showError, reviewing },
      [REVIEW]: { review },
      [ANSWER]: { answer, showError: this.showError }
    };
  }

  componentDidMount() {
    this.unlisten = history.listen(this.renderURL);
    this.history = history;
    this.history.replace(ROOT);
    axios.get("/check").then(res => {
      const { loggedIn, connected } = res.data;
      if (loggedIn) this.setState({ loggedIn, connected });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  login(connected) {
    this.setState({
      loggedIn: true,
      connected
    });
    this.history.push(ROOT);
  }

  logout() {
    axios.get("/logout");
    this.setState({
      loggedIn: false
    });
  }

  showSearch({ result: data, query }) {
    this.setState({ searchData: data });
    this.history.push(`${SEARCH}?query=${query}`);
  }

  showError(error) {
    this.setState({ error });
    this.history.push(ERROR);
  }

  showCheckOut() {
    const { loggedIn } = this.state;
    if (loggedIn) {
      this.history.push(CHECKOUT);
    } else {
      this.showError(Error("Sorry, you have to log in first."));
    }
  }

  addToCart(id) {
    this.setState(state => ({
      cart: [...state.cart, id]
    }));
  }

  removeFromCart(id) {
    this.setState(state => {
      const cart = state.cart.slice();
      cart.splice(cart.indexOf(id), 1);
      return { cart };
    });
  }

  clearCart() {
    this.setState({ cart: [] });
  }

  renderURL(location) {
    const { pathname } = url.parse(location.pathname);
    const state = Object.assign({ show: pathname }, location.state);
    this.setState(state);
  }

  render() {
    const {
      loggedIn,
      cart,
      show,
      searchData,
      error,
      connected,
      transaction,
      product,
      edit,
      review,
      reviewing,
      answer
    } = this.state;

    this.pageProps[SEARCH].data = searchData;
    this.pageProps[ERROR].error = error;
    this.pageProps[CART].cart = cart;
    this.pageProps[CHECKOUT].cart = cart;
    this.pageProps[TRANSACTION].transaction = transaction;
    this.pageProps[PRODUCT].product = product;
    this.pageProps[EDIT].edit = edit;
    this.pageProps[REVIEW].review = review;
    this.pageProps[REVIEWING].reviewing = reviewing;
    this.pageProps[ANSWER].answer = answer;

    const Component = this.pages[show];
    return (
      <ErrorBoundary>
        <NavBar
          showSearch={this.showSearch}
          showError={this.showError}
          logout={this.logout}
          loggedIn={loggedIn}
          connected={connected}
          counter={cart.length}
        />
        <main className="container-fluid mt-5 pt-3" id="container">
          <Component {...this.pageProps[show]} />
        </main>
      </ErrorBoundary>
    );
  }
}

export default Home;
