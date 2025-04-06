import React from 'react';

const FlowControls = ({ onSave, isSaving }) => {
  return (
    <div className="flow-controls">
      <button 
        className="save-button" 
        onClick={onSave} 
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Sequence'}
      </button>
    </div>
  );
};

export default FlowControls;