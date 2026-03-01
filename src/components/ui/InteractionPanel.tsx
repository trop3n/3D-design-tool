import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { 
  EventType, 
  ActionType, 
  EventConfig,
  ActionConfig,
} from '../../types/store';
import { Plus, Trash2, ChevronDown, ChevronRight, Mouse, Keyboard, Play, Zap } from 'lucide-react';

const EVENT_TYPES: { value: EventType; label: string; icon: React.ReactNode }[] = [
  { value: 'mouseEnter', label: 'Mouse Enter', icon: <Mouse size={14} /> },
  { value: 'mouseLeave', label: 'Mouse Leave', icon: <Mouse size={14} /> },
  { value: 'click', label: 'Click', icon: <Mouse size={14} /> },
  { value: 'keyDown', label: 'Key Down', icon: <Keyboard size={14} /> },
  { value: 'keyUp', label: 'Key Up', icon: <Keyboard size={14} /> },
  { value: 'start', label: 'On Start', icon: <Play size={14} /> },
];

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: 'setState', label: 'Set State' },
  { value: 'toggleState', label: 'Toggle State' },
  { value: 'playAnimation', label: 'Play Animation' },
  { value: 'stopAnimation', label: 'Stop Animation' },
  { value: 'resetScene', label: 'Reset Scene' },
];

export const InteractionPanel: React.FC = () => {
  const selectedIds = useStore((state) => state.selectedIds);
  const objects = useStore((state) => state.objects);
  const objectInteractions = useStore((state) => state.objectInteractions);
  const addObjectState = useStore((state) => state.addObjectState);
  const deleteObjectState = useStore((state) => state.deleteObjectState);
  const addInteractionRule = useStore((state) => state.addInteractionRule);
  const updateInteractionRule = useStore((state) => state.updateInteractionRule);
  const deleteInteractionRule = useStore((state) => state.deleteInteractionRule);

  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
  const selectedObject = objects.find((obj) => obj.id === selectedId);
  const interaction = objectInteractions.find((oi) => oi.objectId === selectedId);

  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [showNewState, setShowNewState] = useState(false);
  const [newStateName, setNewStateName] = useState('');

  if (!selectedObject) {
    return (
      <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
        <p className="text-gray-400 text-sm">Select an object to configure interactions.</p>
      </div>
    );
  }

  const handleAddState = () => {
    if (!newStateName.trim() || !selectedId) return;
    addObjectState(selectedId, {
      name: newStateName.trim(),
      properties: {},
      isDefault: false,
    });
    setNewStateName('');
    setShowNewState(false);
  };

  const handleAddRule = () => {
    if (!selectedId) return;
    addInteractionRule(selectedId, {
      name: 'New Interaction',
      enabled: true,
      event: { id: '', type: 'click', enabled: true },
      actions: [],
    });
  };

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Zap size={20} />
        Interactions
      </h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-400">States</h3>
          <button
            onClick={() => setShowNewState(!showNewState)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={14} />
            Add State
          </button>
        </div>

        {showNewState && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newStateName}
              onChange={(e) => setNewStateName(e.target.value)}
              placeholder="State name..."
              className="flex-1 bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddState()}
            />
            <button
              onClick={handleAddState}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-1">
          {(interaction?.states || [{ id: 'default', name: 'Default', properties: {}, isDefault: true }]).map((state) => (
            <div
              key={state.id}
              className="flex items-center justify-between p-2 bg-gray-800 rounded text-sm"
            >
              <span>{state.name}</span>
              {!state.isDefault && (
                <button
                  onClick={() => selectedId && deleteObjectState(selectedId, state.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-400">Interaction Rules</h3>
          <button
            onClick={handleAddRule}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={14} />
            Add Rule
          </button>
        </div>

        <div className="space-y-2">
          {(interaction?.interactions || []).map((rule) => (
            <div key={rule.id} className="bg-gray-800 rounded overflow-hidden">
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-700"
                onClick={() => toggleRuleExpanded(rule.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedRules.has(rule.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="text-sm">{rule.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (selectedId) updateInteractionRule(selectedId, rule.id, { enabled: e.target.checked });
                      }}
                      className="mr-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-gray-400">On</span>
                  </label>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedId) deleteInteractionRule(selectedId, rule.id);
                    }}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {expandedRules.has(rule.id) && (
                <div className="p-2 border-t border-gray-700 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Rule Name</label>
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => { if (selectedId) updateInteractionRule(selectedId, rule.id, { name: e.target.value }); }}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event</label>
                    <select
                      value={rule.event.type}
                      onChange={(e) => {
                        const newEvent: EventConfig = { ...rule.event, type: e.target.value as EventType };
                        if (selectedId) updateInteractionRule(selectedId, rule.id, { event: newEvent });
                      }}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      {EVENT_TYPES.map((et) => (
                        <option key={et.value} value={et.value}>{et.label}</option>
                      ))}
                    </select>
                  </div>

                  {['keyDown', 'keyUp'].includes(rule.event.type) && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Key</label>
                      <input
                        type="text"
                        value={rule.event.key || ''}
                        onChange={(e) => {
                          const newEvent: EventConfig = { ...rule.event, key: e.target.value };
                          if (selectedId) updateInteractionRule(selectedId, rule.id, { event: newEvent });
                        }}
                        placeholder="e.g., Enter, Space, a"
                        className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-400">Actions</label>
                      <button
                        onClick={() => {
                          const newAction: ActionConfig = {
                            id: '',
                            type: 'setState',
                            delay: 0,
                            duration: 300,
                            easing: 'easeInOut',
                          };
                          if (selectedId) updateInteractionRule(selectedId, rule.id, {
                            actions: [...rule.actions, newAction],
                          });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        + Add Action
                      </button>
                    </div>

                    <div className="space-y-2">
                      {rule.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="bg-gray-700 p-2 rounded space-y-2">
                          <div className="flex items-center justify-between">
                            <select
                              value={action.type}
                              onChange={(e) => {
                                const newActions = [...rule.actions];
                                newActions[actionIndex] = { ...action, type: e.target.value as ActionType };
                                if (selectedId) updateInteractionRule(selectedId, rule.id, { actions: newActions });
                              }}
                              className="flex-1 bg-gray-600 text-white rounded px-2 py-1 text-xs border border-gray-500"
                            >
                              {ACTION_TYPES.map((at) => (
                                <option key={at.value} value={at.value}>{at.label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const newActions = rule.actions.filter((_, i) => i !== actionIndex);
                                if (selectedId) updateInteractionRule(selectedId, rule.id, { actions: newActions });
                              }}
                              className="ml-2 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {action.type === 'setState' && interaction && (
                            <select
                              value={action.targetStateId || ''}
                              onChange={(e) => {
                                const newActions = [...rule.actions];
                                newActions[actionIndex] = { ...action, targetStateId: e.target.value };
                                if (selectedId) updateInteractionRule(selectedId, rule.id, { actions: newActions });
                              }}
                              className="w-full bg-gray-600 text-white rounded px-2 py-1 text-xs border border-gray-500"
                            >
                              <option value="">Select state...</option>
                              {interaction.states.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Delay (ms)</label>
                              <input
                                type="number"
                                value={action.delay}
                                onChange={(e) => {
                                  const newActions = [...rule.actions];
                                  newActions[actionIndex] = { ...action, delay: parseInt(e.target.value) || 0 };
                                  if (selectedId) updateInteractionRule(selectedId, rule.id, { actions: newActions });
                                }}
                                className="w-full bg-gray-600 text-white rounded px-2 py-1 text-xs border border-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Duration (ms)</label>
                              <input
                                type="number"
                                value={action.duration}
                                onChange={(e) => {
                                  const newActions = [...rule.actions];
                                  newActions[actionIndex] = { ...action, duration: parseInt(e.target.value) || 0 };
                                  if (selectedId) updateInteractionRule(selectedId, rule.id, { actions: newActions });
                                }}
                                className="w-full bg-gray-600 text-white rounded px-2 py-1 text-xs border border-gray-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!interaction?.interactions || interaction.interactions.length === 0) && (
            <p className="text-gray-500 text-xs italic text-center py-4">
              No interaction rules yet. Click "Add Rule" to create one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
