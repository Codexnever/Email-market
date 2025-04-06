import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-gray-50 p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Node Types</h2>
      
      <div className="mb-4">
        <div
          className="node-item p-3 mb-2 bg-blue-100 border border-blue-500 rounded cursor-move"
          onDragStart={(event) => onDragStart(event, 'coldEmail')}
          draggable
        >
          Cold Email
        </div>
        
        <div
          className="node-item p-3 mb-2 bg-yellow-100 border border-yellow-500 rounded cursor-move"
          onDragStart={(event) => onDragStart(event, 'delay')}
          draggable
        >
          Wait / Delay
        </div>
        
        <div
          className="node-item p-3 bg-green-100 border border-green-500 rounded cursor-move"
          onDragStart={(event) => onDragStart(event, 'leadSource')}
          draggable
        >
          Lead Source
        </div>
      </div>
      
      <div className="help-section mt-8 text-sm">
        <h3 className="font-bold mb-2">How to use:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Drag nodes onto the canvas</li>
          <li>Connect nodes by dragging from handles</li>
          <li>Click Edit to configure each node</li>
          <li>Save your sequence when done</li>
        </ol>
      </div>
    </aside>
  );
};

export default Sidebar;