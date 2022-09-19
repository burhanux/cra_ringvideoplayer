import "./App.css";
import Player from "./components/Player";

const data = {
  timestamp: 1653362047134,
  url: "https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4",     // 370.304 sec video
  timeZoneName: "Pacific Daylight Time",
  timeZoneOffset: -25200000
};

export default function App() {
  return (
    <div className="App">
      <Player data={data} />
    </div>
  );
}
