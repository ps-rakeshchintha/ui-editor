// ComponentLibrary.js
import React from 'react';
import { useDrag } from 'react-dnd';

const components = [
  { id: 'button1', type: 'button', text: 'Button', properties: { text: 'Click Me', bgColor: 'blue', color: 'white', size: '20px' } },
  { id: 'text1', type: 'text', text: 'Text', properties: { content: 'Sample Text', fontSize: 16, color: 'black' } },
  { id: 'input1', type: 'input', text: 'Input', properties: { placeholder: 'Enter text here', width: '100%' } },
  { id: 'block1', type: 'block', text: 'Block', properties: { rows: 1, columns: 1 } },
  // Add more components if needed
];

function ComponentLibrary() {
  return (
    <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc' }}>
      <h3>Component Library</h3>
      {components.map(component => (
        <ComponentItem key={component.id} component={component} />
      ))}
    </div>
  );
}

function ComponentItem({ component }) {
  const [, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { id: component.id, type: component.type }
  }));

  return (
    <div ref={drag} style={{ padding: '8px', margin: '4px', border: '1px solid #ccc', cursor: 'grab' }}>
      {component.text}
    </div>
  );
}

export default ComponentLibrary;
