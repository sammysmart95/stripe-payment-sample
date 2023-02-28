import "./App.css";
import StripeContainer from "./components/StripeContainer";
// some styles
function App() {
  return (
    <div className="App">
      <h1>Payment with stripe</h1>
      <StripeContainer />
    </div>
  );
}

export default App;
