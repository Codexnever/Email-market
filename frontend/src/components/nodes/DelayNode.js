import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const DelayNode = ({ id, data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(data.duration || 1);
  const [unit, setUnit] = useState(data.unit || 'days');

  const handleSave = useCallback(() => {
    data.onChange({ duration: Number(duration), unit });
    setIsEditing(false);
  }, [data, duration, unit]);

  return (
    <div className="delay-node rounded-md border-2 border-yellow-500 bg-white p-3 shadow-md w-48">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="node-header bg-yellow-100 p-2 rounded-t mb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Wait / Delay</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form flex items-center">
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-16 p-1 text-sm border rounded mr-2"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="p-1 text-sm border rounded"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
          <button 
            onClick={handleSave}
            className="ml-2 bg-green-500 text-white px-2 py-1 text-xs rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="node-content">
          <div className="text-center font-medium">
            Wait for {duration} {unit}
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

export default DelayNode;