import { useContext } from "react";

import SocketContext from "../context/Socket/socketContext";

function useSocketContext() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocketContext must be within SocketProvider");
  }

  return context;
}

export default useSocketContext;
