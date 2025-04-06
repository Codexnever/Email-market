import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const LeadSourceNode = ({ id, data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [source, setSource] = useState(data.source || 'Manual Input');
  const [email, setEmail] = useState(data.email || '');

  const handleSave = useCallback(() => {
    data.onChange({ source, email });
    setIsEditing(false);
  }, [data, source, email]);

  return (
    <div className="lead-source-node rounded-md border-2 border-green-500 bg-white p-3 shadow-md w-48">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="node-header bg-green-100 p-2 rounded-t mb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Lead Source</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <div className="mb-2">
            <label className="block text-xs mb-1">Source Type</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-1 text-sm border rounded"
            >
              <option value="Manual Input">Manual Input</option>
              <option value="CSV Upload">CSV Upload</option>
              <option value="API">API</option>
            </select>
          </div>
          
          {source === 'Manual Input' && (
            <div className="mb-2">
              <label className="block text-xs mb-1">Test Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-1 text-sm border rounded"
              />
            </div>
          )}
          
          <button 
            onClick={handleSave}
            className="bg-green-500 text-white px-2 py-1 text-sm rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="node-content">
          <div className="mb-1">
            <span className="text-xs font-semibold">Source:</span>
            <div className="text-sm">{source}</div>
          </div>
          {source === 'Manual Input' && email && (
            <div>
              <span className="text-xs font-semibold">Email:</span>
              <div className="text-xs truncate">{email}</div>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default LeadSourceNode;