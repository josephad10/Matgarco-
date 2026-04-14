import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, Trash2, GripVertical, Settings2, LayoutPanelLeft } from 'lucide-react';
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SectionRegistry,
  resolveSectionBlocks,
  normalizeThemeData,
  denormalizeThemeData,
  addSection,
  updateSection,
  removeSection,
  addBlock,
} from '../../../packages/theme-engine/src';
import type { SchemaInput, ThemeState } from '../../../packages/theme-engine/src';

interface Props {
  sections: any[];
  onChange: (newSections: any[]) => void;
}

interface SortableBlockCardProps {
  blockId: string;
  children: (dragHandleProps: { attributes: any; listeners: any }) => React.ReactNode;
}

function SortableBlockCard({ blockId, children }: SortableBlockCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: blockId });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-70' : ''}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

export default function SectionsPanel({ sections, onChange }: Props) {
  const [state, setState] = useState<ThemeState>(() => normalizeThemeData(sections));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sync if external data changes initially
  useEffect(() => {
    setState(normalizeThemeData(sections));
  }, [sections]);

  const commitState = (newState: ThemeState) => {
    setState(newState);
    onChange(denormalizeThemeData(newState));
  };

  const handleAddSection = (type: string) => {
    const newState = addSection(state, type);
    commitState(newState);
    setShowAddMenu(false);
    // Expand the last added section
    const newId = newState.sectionIds[newState.sectionIds.length - 1];
    setExpandedId(newId);
  };

  const handleUpdateSection = (id: string, updates: any) => {
    const newState = updateSection(state, id, updates);
    commitState(newState);
  };

  const handleRemoveSection = (id: string) => {
    const newState = removeSection(state, id);
    commitState(newState);
  };

  const handleAddBlock = (sectionId: string, blockType: string) => {
    const newState = addBlock(state, sectionId, blockType);
    commitState(newState);
  };

  const handleRemoveBlock = (sectionId: string, blockId: string) => {
    commitState(updateSection(state, sectionId, (prev: any) => ({
      ...prev,
      blocks: prev.blocks.filter((b: any) => b.id !== blockId)
    })));
  };

  const handleBlockDragEnd = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const section = state.sectionsById[sectionId];
    const blocks = Array.isArray(section?.blocks) ? section.blocks : [];
    const oldIndex = blocks.findIndex((block: any) => block.id === active.id);
    const newIndex = blocks.findIndex((block: any) => block.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    commitState(
      updateSection(state, sectionId, (prev: any) => ({
        ...prev,
        blocks: arrayMove(prev.blocks || [], oldIndex, newIndex),
      }))
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIds = [...state.sectionIds];
    const swap = direction === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= newIds.length) return;
    [newIds[index], newIds[swap]] = [newIds[swap], newIds[index]];
    commitState({ ...state, sectionIds: newIds, isDirty: true });
  };

  // Render Dynamic Input
  const renderInput = (input: SchemaInput, value: any, onChangeFn: (val: any) => void) => {
    const v = value !== undefined ? value : input.default;
    
    if (input.type === 'select') {
      return (
        <select value={v} onChange={e => onChangeFn(e.target.value)} className="w-full text-xs p-2 border rounded-md">
          {input.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      );
    }
    if (input.type === 'range') {
      return (
        <div className="flex items-center gap-2">
          <input type="range" min={input.min || 0} max={input.max || 100} step={input.step || 1} value={v} onChange={e => onChangeFn(Number(e.target.value))} className="w-full" />
          <span className="text-xs bg-slate-100 px-2 py-1 rounded">{v}</span>
        </div>
      );
    }
    if (input.type === 'textarea') {
      return (
        <textarea
          value={v ?? ''}
          onChange={(e) => onChangeFn(e.target.value)}
          rows={3}
          className="w-full text-xs p-2 border rounded-md resize-y"
        />
      );
    }
    if (input.type === 'toggle' || input.type === 'boolean') {
      return (
        <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
          <input
            type="checkbox"
            checked={!!v}
            onChange={(e) => onChangeFn(e.target.checked)}
            className="w-4 h-4 accent-matgarco-600"
          />
          {v ? 'مفعل' : 'غير مفعل'}
        </label>
      );
    }
    if (input.type === 'number') {
      return (
        <input
          type="number"
          min={input.min}
          max={input.max}
          step={input.step || 1}
          value={v ?? ''}
          onChange={(e) => onChangeFn(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full text-xs p-2 border rounded-md"
        />
      );
    }

    const htmlInputType = input.type === 'image' ? 'url' : input.type;
    return (
      <input type={htmlInputType} value={v ?? ''} onChange={e => onChangeFn(e.target.value)} className="w-full text-xs p-2 border rounded-md" />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 font-cairo">
        {state.sectionIds.map((id, index) => {
          const section = state.sectionsById[id];
          const schema = SectionRegistry[section.type];
          if (!schema) return null; // Fallback missing
          const sectionBlockSchemas = resolveSectionBlocks(schema);

          const isExpanded = expandedId === id;

          return (
            <div key={id} className={`border rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200 ${isExpanded ? 'border-matgarco-500 ring-1 ring-matgarco-500' : 'border-slate-200'}`}>
              
              {/* Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : id)} 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-slate-300 cursor-grab" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                    <LayoutPanelLeft size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{schema.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">النوع: {schema.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex flex-col mr-2">
                    <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} disabled={index === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} disabled={index === state.sectionIds.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Body (Settings + Blocks) */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-6">
                  
                  {/* Variant Selection */}
                  {schema.variants && schema.variants.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">شكل التصميم (Layout Variant)</label>
                      <select 
                        value={section.variant || schema.defaultVariant} 
                        onChange={(e) => handleUpdateSection(id, { variant: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-matgarco-500 focus:ring-1 focus:ring-matgarco-500"
                      >
                        {schema.variants.map(v => (
                          <option key={v.id} value={v.id}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Settings */}
                  {schema.settings && schema.settings.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-1"><Settings2 size={12}/> الإعدادات الأساسية</h5>
                      <div className="space-y-3">
                        {schema.settings.map(input => (
                          <div key={input.id}>
                            <label className="block text-xs font-bold text-slate-700 mb-1">{input.label}</label>
                            {renderInput(input, section.settings?.[input.id], (val) => {
                              handleUpdateSection(id, (prev: any) => ({
                                ...prev,
                                settings: { ...prev.settings, [input.id]: val }
                              }));
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blocks */}
                  {sectionBlockSchemas.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <h5 className="text-[11px] font-black uppercase text-slate-400">مكونات القسم (Blocks)</h5>
                      
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleBlockDragEnd(id, event)}>
                        <SortableContext items={(section.blocks || []).map((block: any) => block.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {section.blocks?.map((block: any, bIdx: number) => {
                              const blockSchema = sectionBlockSchemas.find(b => b.type === block.type);
                              if (!blockSchema) return null;

                              return (
                                <SortableBlockCard key={block.id} blockId={block.id}>
                                  {({ attributes, listeners }) => (
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                      <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                          <button
                                            {...attributes}
                                            {...listeners}
                                            className="text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing"
                                            title="اسحب لإعادة الترتيب"
                                          >
                                            <GripVertical size={14} />
                                          </button>
                                          <span className="text-xs font-bold text-slate-800">{blockSchema.name}</span>
                                        </div>
                                        <button onClick={() => handleRemoveBlock(id, block.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                      </div>
                                      <div className="space-y-2">
                                        {blockSchema.settings.map(input => (
                                          <div key={input.id}>
                                            <label className="block text-[10px] font-bold text-slate-600 mb-1">{input.label}</label>
                                            {renderInput(input, block.settings?.[input.id], (val) => {
                                              handleUpdateSection(id, (prev: any) => {
                                                const newBlocks = [...prev.blocks];
                                                newBlocks[bIdx] = { ...newBlocks[bIdx] };
                                                newBlocks[bIdx].settings = { ...newBlocks[bIdx].settings, [input.id]: val };
                                                return { ...prev, blocks: newBlocks };
                                              });
                                            })}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </SortableBlockCard>
                              );
                            })}
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Add Block Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {sectionBlockSchemas.map(allowedBlock => {
                          const currentCount = section.blocks?.filter((b:any) => b.type === allowedBlock.type).length || 0;
                          const limit = schema.blockLimits?.[allowedBlock.type] ?? (schema.maxBlocks || Infinity);
                          const canAdd = currentCount < limit;

                          return (
                            <button 
                              key={allowedBlock.type}
                              onClick={() => handleAddBlock(id, allowedBlock.type)}
                              disabled={!canAdd}
                              className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <Plus size={12}/> إضافة {allowedBlock.name}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-red-100 flex justify-end">
                     <button onClick={() => handleRemoveSection(id)} className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                       <Trash2 size={14} /> حذف القسم تماماً
                     </button>
                  </div>
                  
                </div>
              )}
            </div>
          );
        })}

        {/* --- Add New Section Button --- */}
        <div className="pt-4 relative">
           <button 
             onClick={() => setShowAddMenu(!showAddMenu)} 
             className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-matgarco-400 hover:text-matgarco-600 hover:bg-matgarco-50 transition-all flex items-center justify-center gap-2"
           >
             <Plus size={18} /> إضافة قسم جديد
           </button>

           {showAddMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-xs font-black text-slate-400 uppercase mb-2 px-2">الأقسام المتاحة</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(SectionRegistry).map(schema => (
                    <button 
                      key={schema.type} 
                      onClick={() => handleAddSection(schema.type)}
                      className="text-right p-3 hover:bg-indigo-50 rounded-lg group transition-colors flex flex-col items-start border border-transparent hover:border-indigo-100"
                    >
                       <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{schema.name}</span>
                       <span className="text-[10px] text-slate-400">{schema.type}</span>
                    </button>
                  ))}
                </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
