// App.js
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentLibrary from './ComponentLibrary';
import EditorCanvas from './EditorCanvas';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ display: 'flex' }}>
        <ComponentLibrary />
        <EditorCanvas />
      </div>
    </DndProvider>
  );
}

export default App;
