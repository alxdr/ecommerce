import createHistory from "history/createBrowserHistory";

const isBrowser = typeof window !== "undefined";
const history = isBrowser ? createHistory() : {};

export default history;
