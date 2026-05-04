import { useRef, useEffect, useState } from "react";
import socket from "../lib/socket";

const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState(null);

  // ✏️ tool state: "pen" | "eraser"
  const [tool, setTool] = useState("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ fix resolution
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 🎯 draw from others
    socket.on("draw", (data) => {
      const { x0, y0, x1, y1, tool } = data;

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);

      if (tool === "eraser") {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 20;
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
      }

      ctx.stroke();
      ctx.closePath();
    });

    // 🧹 clear from others
    socket.on("clear-board", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("draw");
      socket.off("clear-board");
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // 🎯 coordinate fix
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    setPrevPos(getCoords(e));
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setPrevPos(null);
  };

  const handleMouseMove = (e) => {
    if (!drawing || !prevPos) return;

    const { x, y } = getCoords(e);

    const data = {
      x0: prevPos.x,
      y0: prevPos.y,
      x1: x,
      y1: y,
      roomId,
      tool,
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);

    if (tool === "eraser") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
    }

    ctx.stroke();
    ctx.closePath();

    socket.emit("draw", data);

    setPrevPos({ x, y });
  };

  // 🧹 clear board
  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit("clear-board", roomId);
  };

  return (
    <div className="relative w-full h-full">
      
      {/* 🔧 TOOLBAR */}
      <div className="absolute top-2 left-2 z-50 flex gap-2 bg-white p-2 rounded shadow">
        
        {/* Pen */}
        <button
          onClick={() => setTool("pen")}
          className={`px-2 py-1 rounded ${
            tool === "pen" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          ✏️
        </button>

        {/* Eraser */}
        <button
          onClick={() => setTool("eraser")}
          className={`px-2 py-1 rounded ${
            tool === "eraser" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          🧹
        </button>

        {/* Clear */}
        <button
          onClick={clearBoard}
          className="px-2 py-1 rounded bg-black text-white"
        >
          Clear
        </button>
      </div>

      {/* 🖼️ CANVAS */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair bg-white"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

export default Whiteboard;