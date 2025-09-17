'use client';

import React, { useCallback, useState } from 'react';
import { EnhancedSwingPhase } from '@/lib/enhanced-swing-phases';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SwingPhaseNavigator Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">Error displaying phase navigation. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2 text-xs text-red-600">
              <summary>Error Details</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

interface SwingPhaseNavigatorProps {
  phases: EnhancedSwingPhase[];
  currentTime: number;
  onPhaseSelect: (startTime: number) => void;
  onSlowMotionToggle: (phase: string) => void;
  className?: string;
}

export default function SwingPhaseNavigator({
  phases,
  currentTime,
  onPhaseSelect,
  onSlowMotionToggle,
  className = ''
}: SwingPhaseNavigatorProps) {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [slowMotionPhases, setSlowMotionPhases] = useState<Set<string>>(new Set());

  const getPhaseColor = (phaseName: string): string => {
    const colors: { [key: string]: string } = {
      address: 'bg-green-500',
      backswing: 'bg-blue-500',
      top: 'bg-orange-500',
      downswing: 'bg-red-500',
      impact: 'bg-purple-500',
      'follow-through': 'bg-yellow-500'
    };
    return colors[phaseName] || 'bg-gray-500';
  };

  const getPhaseIcon = (phaseName: string): string => {
    const icons: { [key: string]: string } = {
      address: '🏌️',
      backswing: '⬆️',
      top: '🔝',
      downswing: '⬇️',
      impact: '💥',
      'follow-through': '🏁'
    };
    return icons[phaseName] || '⚡';
  };

  const getCurrentPhase = useCallback(() => {
    return phases.find(phase => 
      currentTime >= phase.startTime && currentTime <= phase.endTime
    );
  }, [phases, currentTime]);

  const handlePhaseClick = useCallback((phase: EnhancedSwingPhase) => {
    console.log('=== PHASE CLICK DEBUG ===');
    console.log('Phase clicked:', phase.name);
    console.log('Phase start time (ms):', phase.startTime);
    console.log('Phase end time (ms):', phase.endTime);
    console.log('Phase duration (ms):', phase.duration);
    console.log('Total duration (ms):', totalDuration);
    console.log('Phase start percentage:', ((phase.startTime / totalDuration) * 100).toFixed(1) + '%');
    console.log('========================');
    
    // Add visual feedback
    const phaseElement = document.querySelector(`[data-phase="${phase.name}"]`);
    if (phaseElement) {
      phaseElement.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-75');
      setTimeout(() => {
        phaseElement.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-75');
      }, 1000);
    }
    
    onPhaseSelect(phase.startTime);
  }, [onPhaseSelect]);

  const handleSlowMotionToggle = useCallback((phase: EnhancedSwingPhase) => {
    const newSlowMotionPhases = new Set(slowMotionPhases);
    if (slowMotionPhases.has(phase.name)) {
      newSlowMotionPhases.delete(phase.name);
    } else {
      newSlowMotionPhases.add(phase.name);
    }
    setSlowMotionPhases(newSlowMotionPhases);
    onSlowMotionToggle(phase.name);
  }, [slowMotionPhases, onSlowMotionToggle]);

  const currentPhase = getCurrentPhase();
  const totalDuration = phases.length > 0 ? phases[phases.length - 1].endTime : 0;

  // Safety checks and data validation
  if (!phases || !Array.isArray(phases)) {
    console.error('SwingPhaseNavigator: Invalid phases data:', phases);
    return (
      <div className={`mt-6 bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800 text-sm">Error: Invalid phase data provided to navigator.</p>
      </div>
    );
  }

  if (phases.length === 0) {
    return (
      <div className={`mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <p className="text-gray-600 text-sm">No swing phases available for navigation.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`space-y-6 ${className}`}>
      {/* Phase Timeline */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Swing Phase Timeline
        </h3>
        
        {/* Timeline Bar */}
        <div className="relative mb-4">
          <div className="flex h-8 bg-gray-200 rounded-lg overflow-hidden">
            {phases.map((phase, index) => {
              const phaseWidth = totalDuration > 0 ? (phase.duration / totalDuration) * 100 : 0;
              const isActive = currentPhase?.name === phase.name;
              const isHovered = hoveredPhase === phase.name;
              
              return (
                <div
                  key={phase.name}
                  data-phase={phase.name}
                  className={`${getPhaseColor(phase.name)} relative cursor-pointer transition-all duration-200 ${
                    isActive ? 'ring-2 ring-white ring-opacity-50' : ''
                  } ${isHovered ? 'opacity-80' : 'opacity-90'}`}
                  style={{ width: `${phaseWidth}%` }}
                  onClick={() => handlePhaseClick(phase)}
                  onMouseEnter={() => setHoveredPhase(phase.name)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  title={`${phase.name} (${(phase.startTime / 1000).toFixed(1)}s - ${(phase.endTime / 1000).toFixed(1)}s)`}
                >
                  <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                    <span className="mr-1">{getPhaseIcon(phase.name)}</span>
                    <span className="hidden sm:inline">{phase.name.toUpperCase()}</span>
                  </div>
                  
                  {/* Grade Badge */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    phase.grade === 'A' ? 'bg-green-600' :
                    phase.grade === 'B' ? 'bg-blue-600' :
                    phase.grade === 'C' ? 'bg-yellow-600' :
                    phase.grade === 'D' ? 'bg-orange-600' :
                    'bg-red-600'
                  }`}>
                    {phase.grade}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Current Time Indicator */}
          {totalDuration > 0 && (
            <div 
              className="absolute top-0 w-1 h-8 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
              style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            />
          )}
        </div>

        {/* Phase Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => {
            // Safety checks for phase data
            if (!phase || typeof phase !== 'object') {
              console.warn('SwingPhaseNavigator: Invalid phase object:', phase);
              return null;
            }
            
            // Safe property access with fallbacks
            const phaseName = phase.name || 'Unknown';
            const phaseGrade = phase.grade || 'N/A';
            const phaseDuration = typeof phase.duration === 'number' ? phase.duration : 0;
            const phaseConfidence = typeof phase.confidence === 'number' ? phase.confidence : 0;
            const phaseDescription = typeof phase.description === 'string' ? phase.description : '';
            const phaseMetrics = phase.metrics && typeof phase.metrics === 'object' ? phase.metrics : {};
            
            const isActive = currentPhase?.name === phaseName;
            const isSlowMotion = slowMotionPhases.has(phaseName);
            
            return (
              <div
                key={phaseName}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handlePhaseClick(phase)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getPhaseIcon(phaseName)}</span>
                    <h4 className="font-semibold text-gray-900 capitalize">{phaseName}</h4>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    phaseGrade === 'A' ? 'bg-green-100 text-green-800' :
                    phaseGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                    phaseGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    phaseGrade === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {phaseGrade}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <div>Duration: {(phaseDuration / 1000).toFixed(1)}s</div>
                  <div>Confidence: {(phaseConfidence * 100).toFixed(0)}%</div>
                </div>
                
                {phaseDescription && (
                  <div className="text-xs text-gray-500 mb-3">
                    {phaseDescription}
                  </div>
                )}
                
                {/* Key Metrics */}
                <div className="space-y-1 mb-3">
                  {phaseName === 'address' && phaseMetrics.spineAngle && typeof phaseMetrics.spineAngle === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">Spine Angle:</span> {phaseMetrics.spineAngle.toFixed(1)}°
                    </div>
                  )}
                  {phaseName === 'backswing' && phaseMetrics.shoulderRotation && typeof phaseMetrics.shoulderRotation === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">Shoulder Turn:</span> {phaseMetrics.shoulderRotation.toFixed(1)}°
                    </div>
                  )}
                  {phaseName === 'top' && phaseMetrics.xFactor && typeof phaseMetrics.xFactor === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">X-Factor:</span> {phaseMetrics.xFactor.toFixed(1)}°
                    </div>
                  )}
                  {phaseName === 'downswing' && phaseMetrics.tempoRatio && typeof phaseMetrics.tempoRatio === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">Tempo:</span> {phaseMetrics.tempoRatio.toFixed(1)}:1
                    </div>
                  )}
                  {phaseName === 'impact' && phaseMetrics.weightTransfer && typeof phaseMetrics.weightTransfer === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">Weight Transfer:</span> {phaseMetrics.weightTransfer.toFixed(0)}%
                    </div>
                  )}
                  {phaseName === 'follow-through' && phaseMetrics.finishBalance && typeof phaseMetrics.finishBalance === 'number' && (
                    <div className="text-xs">
                      <span className="font-medium">Balance:</span> {phaseMetrics.finishBalance.toFixed(0)}%
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlowMotionToggle(phase);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isSlowMotion
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isSlowMotion ? '🐌 Slow Motion' : '⚡ Normal Speed'}
                  </button>
                  
                  <div className="text-xs text-gray-400">
                    {(phase.startTime / 1000).toFixed(1)}s - {(phase.endTime / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phase Details */}
      {currentPhase && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="text-3xl mr-3">{getPhaseIcon(currentPhase.name)}</span>
              Current Phase: {currentPhase.name.toUpperCase()}
            </h3>
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${
              currentPhase.grade === 'A' ? 'bg-green-100 text-green-800' :
              currentPhase.grade === 'B' ? 'bg-blue-100 text-blue-800' :
              currentPhase.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
              currentPhase.grade === 'D' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              Grade: {currentPhase.grade}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase Metrics */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Phase Metrics</h4>
              <div className="space-y-2">
                {currentPhase.metrics && typeof currentPhase.metrics === 'object' ? Object.entries(currentPhase.metrics).map(([key, value]) => {
                  if (value === undefined || value === null) return null;
                  
                  let displayValue = value;
                  let unit = '';
                  
                  if (typeof value === 'number') {
                    if (key.includes('Angle') || key.includes('Rotation')) {
                      unit = '°';
                    } else if (key.includes('Transfer') || key.includes('Balance')) {
                      unit = '%';
                    } else if (key.includes('Ratio')) {
                      unit = ':1';
                    }
                    displayValue = value.toFixed(1);
                  } else if (typeof value === 'object' && value !== null) {
                    // Handle different object types safely
                    if (value.left !== undefined && value.right !== undefined) {
                      displayValue = `${value.left.toFixed(0)}/${value.right.toFixed(0)}`;
                      unit = '%';
                    } else if (value.x !== undefined && value.y !== undefined) {
                      // Handle position objects like {x, y, z}
                      displayValue = `(${value.x.toFixed(1)}, ${value.y.toFixed(1)}${value.z !== undefined ? `, ${value.z.toFixed(1)}` : ''})`;
                      unit = '';
                    } else {
                      // Skip complex objects that can't be displayed
                      return null;
                    }
                  } else if (typeof value === 'string') {
                    displayValue = value;
                  } else {
                    // Skip other types that can't be displayed
                    return null;
                  }
                  
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900">
                        {displayValue}{unit}
                      </span>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-gray-500">No metrics available</div>
                )}
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {currentPhase.recommendations && Array.isArray(currentPhase.recommendations) ? currentPhase.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500">No recommendations available</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Professional Benchmark */}
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Professional Benchmark</h4>
            <div className="text-sm text-gray-600">
              {currentPhase.professionalBenchmark ? (
                <>
                  <div>Ideal Duration: {(currentPhase.professionalBenchmark.idealDuration / 1000).toFixed(1)}s</div>
                  <div>Your Duration: {(currentPhase.duration / 1000).toFixed(1)}s</div>
                  <div className="mt-2">
                    <span className="font-medium">Common Mistakes:</span>
                    <ul className="list-disc list-inside mt-1">
                      {currentPhase.professionalBenchmark.commonMistakes && Array.isArray(currentPhase.professionalBenchmark.commonMistakes) ? 
                        currentPhase.professionalBenchmark.commonMistakes.map((mistake, index) => (
                          <li key={index}>{mistake}</li>
                        )) : (
                          <li>No common mistakes data available</li>
                        )
                      }
                    </ul>
                  </div>
                </>
              ) : (
                <div>No professional benchmark data available</div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
