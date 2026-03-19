import Sidebar from '@/components/Sidebar';
import MiddlePanel from '@/components/MiddlePanel';
import ChatPanel from '@/components/ChatPanel';

const App: React.FC = () => {
  return (
    <div className="app">
      <Sidebar />
      <MiddlePanel />
      <ChatPanel />
    </div>
  );
};

export default App;
