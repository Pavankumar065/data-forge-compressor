import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas as FabricCanvas, Circle, Rect, Path } from 'fabric';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import WhiteboardToolbar from '../components/WhiteboardToolbar';
import UsersList from '../components/UsersList';
import ExportOptions from '../components/ExportOptions';

interface User {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface DrawingData {
  type: string;
  data: any;
  userId: string;
  timestamp: number;
}

const Whiteboard = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTool, setActiveTool] = useState<'pen' | 'rectangle' | 'circle' | 'eraser' | 'text'>('pen');
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas and socket connection
  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Initialize Fabric.js canvas
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: window.innerWidth - 300, // Account for sidebar
        height: window.innerHeight - 100, // Account for toolbar
        backgroundColor: '#ffffff',
      });

      // Initialize the freeDrawingBrush properly
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = brushSize;
      
      setFabricCanvas(canvas);

      // Socket.io connection (will connect to backend when implemented)
      const newSocket = io('http://localhost:3001', {
        query: { roomId }
      });

      // Generate user info
      const user: User = {
        id: uuidv4(),
        name: `User${Math.floor(Math.random() * 1000)}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        isActive: true
      };
      setCurrentUser(user);

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join-room', { roomId, user });
        toast.success('Connected to whiteboard room');
      });

      newSocket.on('user-joined', (userData: User) => {
        setUsers(prev => [...prev.filter(u => u.id !== userData.id), userData]);
        toast.info(`${userData.name} joined the room`);
      });

      newSocket.on('user-left', (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
      });

      newSocket.on('users-list', (usersList: User[]) => {
        setUsers(usersList);
      });

      newSocket.on('drawing-data', (data: DrawingData) => {
        if (data.userId !== user.id) {
          // Apply drawing from other users
          applyDrawingData(canvas, data);
        }
      });

      newSocket.on('canvas-cleared', () => {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      });

      setSocket(newSocket);

      // Canvas event listeners
      canvas.on('path:created', (e) => {
        if (socket && currentUser) {
          const pathData = {
            type: 'path:created',
            data: e.path?.toObject(),
            userId: currentUser.id,
            timestamp: Date.now()
          };
          socket.emit('drawing-data', { roomId, data: pathData });
        }
      });

      canvas.on('object:added', (e) => {
        if (socket && currentUser && e.target && e.target.type !== 'path') {
          const objectData = {
            type: 'object:added',
            data: e.target.toObject(),
            userId: currentUser.id,
            timestamp: Date.now()
          };
          socket.emit('drawing-data', { roomId, data: objectData });
        }
      });

      return () => {
        canvas.dispose();
        newSocket.disconnect();
      };
    }
  }, [roomId, navigate]);

  // Update canvas tool settings
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pen';
    
    if (activeTool === 'pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  const applyDrawingData = (canvas: FabricCanvas, data: DrawingData) => {
    try {
      if (data.type === 'path:created') {
        const path = new Path(data.data.path, data.data);
        canvas.add(path);
      } else if (data.type === 'object:added') {
        let object;
        if (data.data.type === 'rect') {
          object = new Rect(data.data);
        } else if (data.data.type === 'circle') {
          object = new Circle(data.data);
        }
        if (object) {
          canvas.add(object);
        }
      }
      canvas.renderAll();
    } catch (error) {
      console.error('Error applying drawing data:', error);
    }
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas.add(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas.add(circle);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas || !socket) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    
    socket.emit('clear-canvas', { roomId });
    toast.success('Canvas cleared');
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    if (!fabricCanvas) return;

    if (format === 'png' || format === 'jpg') {
      // Convert 'jpg' to 'jpeg' for Fabric.js compatibility
      const fabricFormat = format === 'jpg' ? 'jpeg' : format;
      
      const dataURL = fabricCanvas.toDataURL({
        format: fabricFormat,
        quality: 1,
        multiplier: 2
      });
      
      const link = document.createElement('a');
      link.download = `whiteboard-${roomId}.${format}`;
      link.href = dataURL;
      link.click();
      
      toast.success(`Canvas exported as ${format.toUpperCase()}`);
    } else if (format === 'pdf') {
      // PDF export would require additional library like jsPDF
      toast.info('PDF export coming soon!');
    }
  };

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex h-screen pt-16">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <WhiteboardToolbar
            activeTool={activeTool}
            onToolClick={handleToolClick}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            onClear={handleClear}
            onUndo={handleUndo}
          />
          
          <div className="flex-1 overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="border border-gray-200 dark:border-gray-700 shadow-lg"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Room: {roomId}
            </h2>
          </div>
          
          <UsersList users={users} currentUser={currentUser} />
          
          <ExportOptions onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
