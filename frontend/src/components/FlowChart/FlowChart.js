import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeTypes from './NodeTypes';
import SideBar from './SideBar';
import FlowControls from './FlowControls';
import api from '../../services/api';

const FlowChart = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // When new connection is created
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // On element drop from sidebar
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
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: `${type} Node`,
          // Default data based on node type
          ...(type === 'coldEmail' ? { 
            subject: 'New Email Subject', 
            body: 'Email body content...',
            recipients: []
          } : {}),
          ...(type === 'delay' ? { 
            duration: 60, // Default 60 minutes delay
            unit: 'minutes'
          } : {}),
          ...(type === 'leadSource' ? { 
            sources: ['Website', 'LinkedIn']
          } : {})
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  // Allow dropping
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Save the flow
  const onSave = useCallback(async () => {
    try {
      setIsSaving(true);
      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        await api.post('/api/sequences', flow);
        alert('Sequence saved successfully!');
      }
    } catch (error) {
      console.error('Error saving sequence:', error);
      alert('Failed to save sequence');
    } finally {
      setIsSaving(false);
    }
  }, [reactFlowInstance]);

  // Update node data when edited
  const onNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  return (
    <div className="flow-builder">
      <SideBar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '80vh', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={NodeTypes(onNodeDataChange)}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <FlowControls onSave={onSave} isSaving={isSaving} />
    </div>
  );
};

export default FlowChart;