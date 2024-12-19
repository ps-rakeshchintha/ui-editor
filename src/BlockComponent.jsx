// BlockComponent.js
import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function BlockComponent({ component, handleDrop, renderComponent, onEdit, onDelete }) {
  const [, blockDrop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        handleDrop(item, component);
      }
    }
  }));

  return (
    <div
      ref={blockDrop}
      style={{
        padding: '8px',
        margin: '8px',
        position: 'relative',
        display: 'grid',
        gridTemplateRows: `repeat(${component.properties.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${component.properties.columns}, 1fr)`,
        gap: '5px',
        border: '1px solid #ccc',
        minHeight: '100px'
      }}
      className='block'
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          cursor: 'pointer',
          padding: '4px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="icon-wrapper"
      >
        <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => onEdit(component)} style={{ marginRight: '8px' }} />
        <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => onDelete(component)} />
      </div>
      {component.properties.components.map(child => renderComponent(child))}
    </div>
  );
}

export default BlockComponent;
