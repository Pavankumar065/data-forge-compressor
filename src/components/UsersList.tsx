
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface User {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface UsersListProps {
  users: User[];
  currentUser: User | null;
}

const UsersList = ({ users, currentUser }: UsersListProps) => {
  return (
    <Card className="m-4 flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4" />
          Active Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No other users online
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                user.id === currentUser?.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                  {user.id === currentUser?.id && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.isActive ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
