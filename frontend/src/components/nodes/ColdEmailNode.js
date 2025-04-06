import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const ColdEmailNode = ({ id, data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(data.subject || 'New Email');
  const [body, setBody] = useState(data.body || 'Email content here...');

  const handleSave = useCallback(() => {
    data.onChange({ subject, body });
    setIsEditing(false);
  }, [data, subject, body]);

  return (
    <div className="cold-email-node rounded-md border-2 border-blue-500 bg-white p-3 shadow-md w-64">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="node-header bg-blue-100 p-2 rounded-t mb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Cold Email</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <div className="mb-2">
            <label className="block text-xs mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-1 text-sm border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-xs mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-1 text-sm border rounded h-24"
            />
          </div>
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
            <span className="text-xs font-semibold">Subject:</span>
            <div className="text-sm truncate">{subject}</div>
          </div>
          <div>
            <span className="text-xs font-semibold">Body:</span>
            <div className="text-xs h-12 overflow-hidden">{body}</div>
          </div>
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

export default ColdEmailNode;