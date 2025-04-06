import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node components
import ColdEmailNode from '../components/nodes/ColdEmailNode';
import DelayNode from '../components/nodes/DelayNode';
import LeadSourceNode from '../components/nodes/LeadSourceNode';
import Sidebar from '../components/FlowChart/SideBar';
import { saveSequence } from '../services/api';

// Node types registration
const nodeTypes = {
  coldEmail: ColdEmailNode,
  delay: DelayNode,
  leadSource: LeadSourceNode
};

const initialNodes = [];
const initialEdges = [];

const SequenceBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [sequenceName, setSequenceName] = useState('New Sequence');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle new node drag and drop from sidebar
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Create a new node based on type
      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: getDefaultDataForNodeType(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Set default data based on node type
  const getDefaultDataForNodeType = (type) => {
    switch (type) {
      case 'coldEmail':
        return { subject: 'New Email', body: 'Your email content here...' };
      case 'delay':
        return { duration: 1, unit: 'days' };
      case 'leadSource':
        return { source: 'Manual Input', email: '' };
      default:
        return {};
    }
  };

  // Update node data when edited
  const onNodeDataChange = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  };

  // Save sequence to backend
  const handleSaveSequence = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      await saveSequence({
        name: sequenceName,
        nodes,
        edges
      });
      
      alert('Sequence saved successfully!');
    } catch (err) {
      setError('Failed to save sequence: ' + (err.message || 'Unknown error'));
      console.error('Error saving sequence:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sequence-builder h-screen flex flex-col">
      <div className="toolbar flex justify-between items-center p-4 bg-gray-100 border-b">
        <div className="flex items-center">
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="mr-4 p-2 border rounded"
            placeholder="Sequence Name"
          />
          <button 
            onClick={handleSaveSequence}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Sequence'}
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="reactflow-wrapper flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default SequenceBuilder;