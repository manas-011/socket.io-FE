// import React, { useEffect, useState } from 'react';

// function App() {
//   const [messages, setMessages] = useState([]) ;

//   useEffect(() => {
//     const eventSource = new EventSource("http://localhost:4000/events") ;

//     eventSource.onmessage = ( event ) => {
//       setMessages((prev) => [...prev, event.data]) ;
//     }

//     eventSource.onerror = (err) => {
//       //console.error('EventSource failed:', err);
//       eventSource.close();
//     }

//     // This is the cleanup function.
//     // React calls this when the component unmounts, to close the SSE connection and prevent memory leaks.
//     return () => {
//       eventSource.close();
//     };

//   }, [])

//   return (
//     <div>
//       <h1>Server-Sent Events</h1>
//       <ul>
//         {messages.map((msg, i) => (
//           <li key={i}>{msg}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default App

import { Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log("Message", message) ;
    socket.emit("message", message);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected..", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log("Receive-Message:", data);
    })
    socket.on("welcome", (welcomeData) => {
      console.log(welcomeData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Container>
        <Typography component="div" gutterBottom>
          Let's Talk...
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ paddingRight: "0.5rem" }}
          />

          <Button type="submit" variant="contained" color="primary" sx={{}}>
            Send
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default App;
