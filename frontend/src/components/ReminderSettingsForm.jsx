import React from "react";

export default function ReminderSettingsForm({ settings, onChange, disabled, title, description }) {
    // Safe access for deep props
    const safeSettings = settings || { enabled: true, slots: [] };
    const slots = safeSettings.slots || [];

    const updateSettings = (updates) => {
        onChange({ ...safeSettings, ...updates });
    };

    const updateSlot = (index, field, value) => {
        const newSlots = [...slots];
        // If slots are empty/undefined, we might need to initialize them based on defaults
        // But assuming parent provides a valid structure
        if (!newSlots[index]) return;

        newSlots[index] = { ...newSlots[index], [field]: value };
        updateSettings({ slots: newSlots });
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            {/* Master Switch */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
                <div>
                    <h3 className="text-white font-bold text-lg">{title || "Match Alerts"}</h3>
                    {description && <p className="text-sm text-slate-400">{description}</p>}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        disabled={disabled}
                        className="sr-only peer"
                        checked={safeSettings.enabled ?? true}
                        onChange={(e) => updateSettings({ enabled: e.target.checked })}
                    />
                    <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>

            {/* Slots Configuration */}
            <div className={`space-y-4 ${!(safeSettings.enabled ?? true) ? 'opacity-50 pointer-events-none' : ''}`}>
                {slots.map((slot, index) => (
                    <div key={slot.id || index} className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400 font-mono text-sm w-8">#{slot.id}</span>

                        {/* Time Selector */}
                        <select
                            disabled={disabled}
                            value={slot.minutesBefore}
                            onChange={(e) => updateSlot(index, 'minutesBefore', parseInt(e.target.value))}
                            className="bg-slate-800 border border-slate-700 rounded text-sm p-1"
                        >
                            <option value={15}>15 Mins Before</option>
                            <option value={30}>30 Mins Before</option>
                            <option value={60}>1 Hour Before</option>
                            <option value={1440}>24 Hours Before</option>
                        </select>

                        {/* Method Toggle */}
                        <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                            <button
                                disabled={disabled}
                                onClick={() => updateSlot(index, 'deliveryMethod', 'email')}
                                className={`px-3 py-1 text-xs rounded transition ${slot.deliveryMethod === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Email
                            </button>
                            <button
                                disabled={disabled}
                                onClick={() => updateSlot(index, 'deliveryMethod', 'push')}
                                className={`px-3 py-1 text-xs rounded transition ${slot.deliveryMethod === 'push' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Push
                            </button>
                        </div>

                        {/* Enable/Disable Slot */}
                        <div className="ml-auto">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-slate-500">{slot.enabled ? 'ON' : 'OFF'}</span>
                                <input
                                    type="checkbox"
                                    checked={slot.enabled}
                                    disabled={disabled}
                                    onChange={(e) => updateSlot(index, 'enabled', e.target.checked)}
                                    className="accent-green-500"
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
