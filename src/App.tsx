//! V2
import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [state, setState] = useState<any>();
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const videoRef = useRef<any>();
  // 370.304 sec
  const obj = {
    timestamp: 1653362047134,
    url:
      "https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4",
    timeZoneName: "Pacific Daylight Time",
    timeZoneOffset: -25200000
  };
  const onTimeUpdate = () => {
    if (videoRef && videoRef.current) {
      // console.log("videoRef.current.currentTime", videoRef.current.currentTime)
      setTimeInSeconds(videoRef.current.currentTime)
      const scroller: any = document.querySelector("#scroller");
      scroller.scrollLeft = parseInt(videoRef.current.currentTime)

      // console.log("DEBUG - videoRef.current.duration", videoRef.current.duration)
      // console.log("DEBUG - videoRef.current.currentTime", videoRef.current.currentTime)
      const timestamp = obj.timestamp || new Date().getTime();
      let startTimeZoneTimeStamp =
        timestamp + obj.timeZoneOffset + new Date().getTimezoneOffset() * 60000;

      const videoTimestamp =
        startTimeZoneTimeStamp + parseInt(videoRef.current.currentTime) * 1000;

      const formatted_time =
        new Date(videoTimestamp).toLocaleString() +
        ` ${obj.timeZoneName
          .split(" ")
          .map((s) => s.match(/^\w/))
          .join("")}`;

      setState(formatted_time);
    }
  };

  useEffect(() => {

    const scroller: any = document.querySelector("#scroller");
    const output: any = document.querySelector("#output");
    //   const blocks: any = document.querySelector("#blocks");
    //   const controledVideo: any = document.querySelector("#controledVideo");
    //   console.log(controledVideo.duration);
    //   blocks.innerHTML += `<div class="block-start"></div>`
    //   for (let i = 0; i < controledVideo.duration; i++) {
    //     blocks.innerHTML += `<div class="block"></div>`
    //   }
    //   blocks.innerHTML += `<div class="block-end"></div>`
    //   // blocks.innerHTML = `hi`
    scroller.addEventListener("scroll", (event: any) => {
      output.textContent = `scrollLeft: ${scroller.scrollLeft}`;
      if (scroller.scrollLeft === parseInt(videoRef.current.currentTime)) return;
      console.log("scroller.scrollLeft === videoRef.current.currentTime", scroller.scrollLeft, parseInt(videoRef.current.currentTime));
      setTimeInSeconds(scroller.scrollLeft / 10)
      videoRef.current.currentTime = scroller.scrollLeft;
      videoRef.current.play();
    });
    let mouseDown = false;
    let startX: any, scrollLeft: any;

    let startDragging = function (e: any) {
      mouseDown = true;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };
    let stopDragging = function (event: any) {
      mouseDown = false;
    };

    scroller.addEventListener('mousemove', (e: any) => {
      e.preventDefault();
      if (!mouseDown) { return; }
      const x = e.pageX - scroller.offsetLeft;
      const scroll = x - startX;
      scroller.scrollLeft = scrollLeft - scroll;
    });

    // Add the event listeners
    scroller.addEventListener('mousedown', startDragging, false);
    scroller.addEventListener('mouseup', stopDragging, false);
    scroller.addEventListener('mouseleave', stopDragging, false);
  }, [])



  const displayBlocks = (num: number) => {
    const blocks = [];
    blocks.push(<div key="start" className="block-start"></div>)
    for (let i = 0; i < Math.ceil(num / 10) - 1; i++) {
      blocks.push(<div key={i} className="block"></div>)
    }
    blocks.push(<div key="end" className="block-end"></div>)
    return blocks
  }

  return (
    <div className="App">
      <video
        onTimeUpdate={onTimeUpdate}
        ref={videoRef}
        width="320"
        height="240"
        controls
        muted
        autoPlay
      >
        <source src={obj.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Time Label */}
      {videoRef && videoRef.current && <h1>{state}</h1>}
      {/* Timeline */}
      <div id="output">scrollLeft: 0</div>
      <div id="container">
        <div id="anchor"></div>
        <div id="scroller">
          <div id="blocks" className="blocks">
            {videoRef && videoRef.current && videoRef.current.duration && displayBlocks(videoRef.current.duration)}
          </div>
        </div>
      </div>

    </div>
  );
}



//! V1
// import { useRef, useState } from "react";
// import "./App.css";

// export default function App() {
//   const [state, setState] = useState<any>();
//   const videoRef = useRef<any>();
//   const obj = {
//     timestamp: 1653362047134,
//     url:
//       "https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4",
//     timeZoneName: "Pacific Daylight Time",
//     timeZoneOffset: -25200000
//   };
//   const onTimeUpdate = () => {
//     if (videoRef && videoRef.current) {
//       // console.log("DEBUG - videoRef.current.duration", videoRef.current.duration)
//       // console.log("DEBUG - videoRef.current.currentTime", videoRef.current.currentTime)
//       const timestamp = obj.timestamp || new Date().getTime();
//       let startTimeZoneTimeStamp =
//         timestamp + obj.timeZoneOffset + new Date().getTimezoneOffset() * 60000;

//       const videoTimestamp =
//         startTimeZoneTimeStamp + parseInt(videoRef.current.currentTime) * 1000;

//       const formatted_time =
//         new Date(videoTimestamp).toLocaleString() +
//         ` ${obj.timeZoneName
//           .split(" ")
//           .map((s) => s.match(/^\w/))
//           .join("")}`;

//       setState(formatted_time);
//     }
//   };
//   return (
//     <div className="App">
//       <video
//         onTimeUpdate={onTimeUpdate}
//         ref={videoRef}
//         width="320"
//         height="240"
//         controls
//         muted
//         autoPlay
//       >
//         <source src={obj.url} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       {/* Time Label */}
//       {videoRef && videoRef.current && <h1>{state}</h1>}


//       {videoRef && videoRef.current && (
//         <div>
//           {/* Start Time Label */}
//           <span>
//             {new Date(
//               obj.timestamp +
//               obj.timeZoneOffset +
//               new Date().getTimezoneOffset() * 60000
//             ).toLocaleString() +
//               ` ${obj.timeZoneName
//                 .split(" ")
//                 .map((s) => s.match(/^\w/))
//                 .join("")}`}
//           </span>

//           {/* Time Range */}
//           <input
//             type="range"
//             id="cowbell"
//             name="cowbell"
//             min="0"
//             max={videoRef.current.duration}
//             value={videoRef.current.currentTime}
//             onChange={(e) => {
//               console.log(e.target.value);
//               videoRef.current.currentTime = e.target.value;
//             }}
//           // step="10"
//           />
//           <label htmlFor="cowbell">time</label>

//           {/* End Time Label */}
//           <span>
//             {new Date(
//               obj.timestamp +
//               videoRef.current.duration * 1000 +
//               obj.timeZoneOffset +
//               new Date().getTimezoneOffset() * 60000
//             ).toLocaleString() +
//               ` ${obj.timeZoneName
//                 .split(" ")
//                 .map((s) => s.match(/^\w/))
//                 .join("")}`}
//           </span>
//         </div>
//       )}


//     </div>
//   );
// }
