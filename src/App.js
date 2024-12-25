import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function App() {
  const numToks = 50257;
  const [firstTok, setFirstTok] = useState("");
  const [firstID, setFirstID] = useState(-1);
  const [secondTok, setSecondTok] = useState("");
  const [secondID, setSecondID] = useState(-1);
  const [simScore, setSimScore] = useState(-1);
  const supabaseClient = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
  );

  async function getTwoNew() {
    let first = Math.floor(Math.random() * numToks);
    let second = Math.floor(Math.random() * numToks);
    while (second === first) {
      second = Math.floor(Math.random() * numToks);
    }
    setFirstID(first);
    setSecondID(second);
    setFirstTok(await getTok(first));
    setSecondTok(await getTok(second));
    setSimScore(-1);
  }
  async function getTok(token_id) {
    let { data, error } = await supabaseClient
      .from("tokens")
      .select("token_string")
      .eq("token_id", token_id);
    if (error) {
      console.error(error);
      return "";
    }
    console.log(data);
    return data[0].token_string;
  }
  async function submitScore(score) {
    const { data, error } = await supabaseClient
      .from("scores")
      .insert([{ firstid: firstID, secondid: secondID, score: simScore }]);
    if (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getTwoNew();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>How similar are these two tokens on a scale of 1 to 10?</p>
        <p>Token 1: {firstTok}</p>
        <p>Token 2: {secondTok}</p>
        <div className="score_buttons">
          {[...Array(10).keys()].map((i) => (
            <button
              key={i + 1}
              onClick={() => setSimScore(i + 1)}
              style={{ fontSize: "20px", padding: "10px 20px" }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {simScore !== -1 && simScore !== undefined && (
          <p>You've selected {simScore}</p>
        )}
        <button
          onClick={async () => {
            await submitScore(simScore);
            await getTwoNew();
          }}
          style={{ fontSize: "20px", padding: "10px 20px" }}
        >
          Next
        </button>
      </header>
    </div>
  );
}

export default App;
