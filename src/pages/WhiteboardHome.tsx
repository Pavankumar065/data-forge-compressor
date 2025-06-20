
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Users, Lock, Unlock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const WhiteboardHome = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const createNewRoom = () => {
    const newRoomId = uuidv4().slice(0, 8);
    navigate(`/whiteboard/${newRoomId}`);
    toast.success('New whiteboard room created!');
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    navigate(`/whiteboard/${roomId.trim()}`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Collaborative Whiteboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Draw, collaborate, and create together in real-time
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Create New Room */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Start a new collaborative whiteboard session
                </p>
                <Button onClick={createNewRoom} className="w-full" size="lg">
                  Create Room
                </Button>
              </CardContent>
            </Card>

            {/* Join Existing Room */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Join Existing Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Enter a room ID to join an existing session
                </p>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                  />
                  <Button onClick={joinRoom} variant="outline" className="w-full" size="lg">
                    Join Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Multiple users can draw and interact simultaneously
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Drawing Tools</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Pen, shapes, text, eraser with customizable colors and sizes
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Options</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Export your work as PNG, JPG, or PDF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardHome;
