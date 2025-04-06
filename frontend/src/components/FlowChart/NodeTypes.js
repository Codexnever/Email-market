import React from 'react';
import { Handle } from 'reactflow';

// Cold Email Node Component
const ColdEmailNode = ({ data, isConnectable, id, onDataChange }) => {
  const handleSubjectChange = (e) => {
    onDataChange(id, { subject: e.target.value });
  };

  const handleBodyChange = (e) => {
    onDataChange(id, { body: e.target.value });
  };

  return (
    <div className="node cold-email-node">
      <Handle
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div className="node-header">Cold Email</div>
      <div className="node-content">
        <label>
          Subject:
          <input 
            type="text" 
            value={data.subject || ''} 
            onChange={handleSubjectChange} 
          />
        </label>
        <label>
          Body:
          <textarea 
            value={data.body || ''} 
            onChange={handleBodyChange} 
            rows={4}
          />
        </label>
      </div>
      <Handle
        type="source"
        position="bottom"
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Delay Node Component
const DelayNode = ({ data, isConnectable, id, onDataChange }) => {
  const handleDurationChange = (e) => {
    onDataChange(id, { duration: parseInt(e.target.value) || 0 });
  };

  const handleUnitChange = (e) => {
    onDataChange(id, { unit: e.target.value });
  };

  return (
    <div className="node delay-node">
      <Handle
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div className="node-header">Wait/Delay</div>
      <div className="node-content">
        <div className="delay-inputs">
          <input 
            type="number" 
            value={data.duration || 0} 
            onChange={handleDurationChange} 
            min={1}
          />
          <select value={data.unit || 'minutes'} onChange={handleUnitChange}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>
      <Handle
        type="source"
        position="bottom"
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Lead Source Node Component
const LeadSourceNode = ({ data, isConnectable, id, onDataChange }) => {
  const handleSourceChange = (e) => {
    const newSources = e.target.value.split(',').map(s => s.trim());
    onDataChange(id, { sources: newSources });
  };

  return (
    <div className="node lead-source-node">
      <Handle
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div className="node-header">Lead Source</div>
      <div className="node-content">
        <label>
          Sources (comma separated):
          <input 
            type="text" 
            value={(data.sources || []).join(', ')} 
            onChange={handleSourceChange} 
          />
        </label>
      </div>
      <Handle
        type="source"
        position="bottom"
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Export node types with the onDataChange handler
const NodeTypes = (onDataChange) => ({
  coldEmail: (props) => <ColdEmailNode {...props} onDataChange={onDataChange} />,
  delay: (props) => <DelayNode {...props} onDataChange={onDataChange} />,
  leadSource: (props) => <LeadSourceNode {...props} onDataChange={onDataChange} />,
});

export default NodeTypes;