// EditorCanvas.js
import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import BlockComponent from './BlockComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); // Set the root element for accessibility

function EditorCanvas() {
  const [components, setComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        addComponentToCanvas(item);
      }
    }
  }));

  const getDefaultProperties = useCallback((type) => {
    switch (type) {
      case 'button':
        return { text: 'Click Me', bgColor: 'blue', color: 'white', size: '20px' };
      case 'text':
        return { content: 'Sample Text', fontSize: 16, color: 'black' };
      case 'input':
        return { placeholder: 'Enter text here', width: '100%' };
      case 'block':
        return { rows: 1, columns: 2, components: [] };
      default:
        return {};
    }
  }, []);

  const getNextGridPosition = useCallback((parentComponent) => {
    const { rows, columns, components } = parentComponent.properties;
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        const positionTaken = components.some(
          component => component.gridPosition?.row === row && component.gridPosition?.column === column
        );
        if (!positionTaken) {
          return { row, column, rowSpan: 1, colSpan: 1 };
        }
      }
    }
    return null;
  }, []);

  const addComponentToCanvas = useCallback((item) => {
    const newComponent = {
      id: uuidv4(),
      type: item.type,
      properties: getDefaultProperties(item.type),
    };
    setComponents(prevComponents => [...prevComponents, newComponent]);
  }, [getDefaultProperties]);

  const handleDrop = useCallback((item, parentComponent) => {
    const newComponent = {
      id: uuidv4(),
      type: item.type,
      properties: getDefaultProperties(item.type),
      gridPosition: getNextGridPosition(parentComponent),
    };
    parentComponent.properties.components.push(newComponent);
    setComponents(prevComponents => [...prevComponents]); // Trigger a re-render
  }, [getDefaultProperties, getNextGridPosition]);

  const handleEdit = useCallback((component) => {
    setCurrentComponent(component);
    setRows(component.properties.rows);
    setColumns(component.properties.columns);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((component) => {
    const deleteComponent = (componentsList, id) => {
      return componentsList.reduce((result, current) => {
        if (current.id !== id) {
          const updatedComponent = current.type === 'block' ? {
            ...current,
            properties: {
              ...current.properties,
              components: deleteComponent(current.properties.components, id),
            },
          } : current;
          result.push(updatedComponent);
        }
        return result;
      }, []);
    };
    setComponents(prevComponents => deleteComponent(prevComponents, component.id));
  }, []);

  const handleSave = useCallback(() => {
    if (currentComponent) {
      currentComponent.properties.rows = parseInt(rows);
      currentComponent.properties.columns = parseInt(columns);
      setComponents([...components]); // Trigger a re-render
    }
    setIsModalOpen(false);
  }, [rows, columns, components, currentComponent]);

  const renderComponent = useCallback((component) => {
    if (component.type === 'block') {
      return (
        <BlockComponent
          key={component.id}
          component={component}
          handleDrop={handleDrop}
          renderComponent={renderComponent}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      );
    }

    return (
      <div key={component.id} className='block' style={{ padding: '8px' }}>
        {component.type === 'button' ? (
          <button style={{ backgroundColor: component.properties.bgColor, color: component.properties.color, fontSize: component.properties.size }}>
            {component.properties.text}
          </button>
        ) : component.type === 'text' ? (
          <span style={{ fontSize: component.properties.fontSize, color: component.properties.color }}>
            {component.properties.content}
          </span>
        ) : component.type === 'input' ? (
          <input placeholder={component.properties.placeholder} style={{ width: component.properties.width }} />
        ) : null}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'none',
            cursor: 'pointer',
            padding: '4px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
          }}
          className="delete-icon"
          onClick={() => handleDelete(component)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    );
  }, [handleDrop, handleEdit, handleDelete]);

  const generateJson = () => {
    const generateComponentJson = (component) => {
      const { id, type, properties, gridPosition } = component;
      const { rows, columns, components } = properties;
      return {
        id,
        type,
        ...(gridPosition && { gridPosition }),
        ...(type === 'block' && {
          gridConfig: { rows, columns },
          components: components.map(generateComponentJson),
        }),
        ...((type !== 'block') && { properties })
      };
    };

    const json = {
      components: components.map(generateComponentJson),
      gridConfig: { rows: 3, columns: 2 } // Adjust this based on your overall canvas grid
    };

    console.log(json);
    return JSON.stringify(json, null, 2);
  };

  return (
    <div style={{ position: 'relative', width: '80%', minHeight: '500px',  }}>
      <div ref={drop} style={{ width: '100%', border: '1px solid #ccc', height: '100%', }}>
        <h3>Editor Canvas</h3>
        {components.map(renderComponent)}
      </div>
      <button onClick={() => console.log(generateJson())}>Export JSON</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Grid"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Edit Grid</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <label>
            Rows:
            <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
          </label>
          <br />
          <label>
            Columns:
            <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
          </label>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default EditorCanvas;
