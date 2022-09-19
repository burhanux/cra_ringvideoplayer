import { useEffect, useRef, useState } from "react";

const Player = (props: any) => {
    const { data: obj } = props;
    const [state, setState] = useState<any>();
    const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
    const [playStatus, setPlayStatus] = useState(true);
    const videoRef = useRef<any>();
    const onTimeUpdate = () => {
        if (videoRef && videoRef.current) {
            if (videoRef.current.currentTime === videoRef.current.duration) setPlayStatus(false);
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
                    .map((s: any) => s.match(/^\w/))
                    .join("")}`;

            setState(formatted_time);
        }
    };

    useEffect(() => {
        // Reference: https://codepen.io/thenutz/pen/VwYeYEE
        // Reference: https://stackoverflow.com/questions/28576636/mouse-click-and-drag-instead-of-horizontal-scroll-bar-to-view-full-content-of-c
        const scroller: any = document.querySelector("#scroller");
        // const output: any = document.querySelector("#output");
        scroller.addEventListener("scroll", (event: any) => {
            // output.textContent = `scrollLeft: ${scroller.scrollLeft}`;
            if (scroller.scrollLeft === parseInt(videoRef.current.currentTime)) return;
            console.log("scroller.scrollLeft === videoRef.current.currentTime", scroller.scrollLeft, parseInt(videoRef.current.currentTime));
            setTimeInSeconds(scroller.scrollLeft / 10)
            videoRef.current.currentTime = scroller.scrollLeft;
            // videoRef.current.play();
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
        blocks.push(<div key="start" className="block-start">
            {/* <h6>Drag Left</h6> */}
            <div id="arrowAnim">
                <div className="arrowSliding">
                    <div className="arrow"></div>
                </div>
                <div className="arrowSliding delay1">
                    <div className="arrow"></div>
                </div>
                <div className="arrowSliding delay2">
                    <div className="arrow"></div>
                </div>
                <div className="arrowSliding delay3">
                    <div className="arrow"></div>
                </div>
            </div>
        </div>)
        for (let i = 0; i < Math.ceil(num / 10) - 1; i++) {
            blocks.push(<div key={i} className="block"></div>)
        }
        blocks.push(<div key="end" className="block-end"></div>)
        return blocks
    }

    const handlePlayStatus = () => {
        if (playStatus) videoRef.current.pause()
        else videoRef.current.play()
        setPlayStatus(!playStatus)
    }


    return (<div className="Player">
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
        {videoRef && videoRef.current && <div className="text-bubble"><p>{state}</p></div>}
        {/* Timeline */}
        {/* <div id="output">scrollLeft: 0</div> */}
        <div id="container">
            <div id="anchor"></div>
            <div id="scroller">
                <div id="blocks" className="blocks">
                    {videoRef && videoRef.current && videoRef.current.duration && displayBlocks(videoRef.current.duration)}
                </div>
            </div>
        </div>

        <div>
            <div><button className="playStatus" onClick={handlePlayStatus}>
                {/* {playStatus ? "Pause" : "Play"} */}
                {playStatus ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16"> <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" /> </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16"> <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" /> </svg>

                }

            </button></div>
        </div>
    </div>)
}

export default Player