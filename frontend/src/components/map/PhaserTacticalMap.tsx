/**
 * KaalNetra — Phaser Tactical Map Component
 *
 * Implements Phase 6 Game-like Map Presentation:
 *   - Embedded Phaser 3/4 canvas with strategic cartography
 *   - Interactive Point-of-Interest selection (Lakhota, Suraj Pol, Gaumukh, Sabats)
 *   - Contextual intelligence card below canvas
 *   - Full destruction on unmount to prevent memory leaks and ghost loops
 */

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import TacticalMapScene, { TACTICAL_POINTS, type TacticalPoint } from '../../game/TacticalMapScene';

interface PhaserTacticalMapProps {
  onSelectPoint?: (point: TacticalPoint) => void;
  className?: string;
  height?: number;
}

export default function PhaserTacticalMap({
  onSelectPoint,
  className = '',
  height = 360,
}: PhaserTacticalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<TacticalPoint>(TACTICAL_POINTS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Phaser Configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth || 600,
      height: height,
      transparent: true,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [TacticalMapScene],
    };

    // Instantiate Phaser
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Send callback to scene
    game.scene.start('TacticalMapScene', {
      onSelectPoi: (poi: TacticalPoint) => {
        setSelectedPoint(poi);
        if (onSelectPoint) onSelectPoint(poi);
      },
      selectedId: selectedPoint.id,
    });

    setIsLoaded(true);

    return () => {
      // Clean teardown
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [height]);

  const handleQuickSelect = (poi: TacticalPoint) => {
    setSelectedPoint(poi);
    if (onSelectPoint) onSelectPoint(poi);

    // Communicate to scene if active
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('TacticalMapScene') as TacticalMapScene;
      if (scene && scene.selectPoint) {
        scene.selectPoint(poi.id);
      }
    }
  };

  return (
    <div className={`phaser-tactical-map-root flex flex-col gap-2 ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900/90 border border-amber-600/30 px-3 py-1.5 rounded-t-lg">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-serif font-bold uppercase tracking-wider">
          <span>🗺️</span>
          <span>Tactical Map of Chittorgarh Environs (1567)</span>
        </div>

        {/* Sector Quick-Select Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {TACTICAL_POINTS.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handleQuickSelect(poi)}
              className={`text-[10px] font-sans px-2 py-0.5 rounded transition-all whitespace-nowrap ${
                selectedPoint.id === poi.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-amber-200'
              }`}
            >
              {poi.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Phaser Canvas Container */}
      <div
        ref={containerRef}
        style={{ height: `${height}px` }}
        className="w-full relative overflow-hidden bg-stone-950 border-x border-amber-600/30 shadow-inner"
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-amber-400 text-xs font-serif">
            Loading Cartographic Data...
          </div>
        )}
      </div>

      {/* Selected Point Intelligence Card */}
      <div className="bg-stone-900/95 border border-amber-600/30 border-t-0 p-3 rounded-b-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {selectedPoint.type === 'danger'
                ? '💥'
                : selectedPoint.type === 'resource'
                ? '💧'
                : selectedPoint.type === 'defense'
                ? '🏰'
                : '⚔️'}
            </span>
            <h5 className="font-serif font-bold text-amber-200 text-xs md:text-sm">
              {selectedPoint.name}
            </h5>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                selectedPoint.type === 'danger'
                  ? 'bg-red-950/60 border-red-700/50 text-red-300'
                  : selectedPoint.type === 'resource'
                  ? 'bg-sky-950/60 border-sky-700/50 text-sky-300'
                  : selectedPoint.type === 'defense'
                  ? 'bg-amber-950/60 border-amber-700/50 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
              }`}
            >
              {selectedPoint.type}
            </span>
          </div>
          <p className="text-xs text-parchment-200 mt-1 leading-snug">
            {selectedPoint.description}
          </p>
        </div>

        <div className="bg-stone-950/70 border border-stone-700/40 p-2 rounded text-[11px] text-stone-300 max-w-xs flex-shrink-0">
          <strong className="text-amber-400 font-serif">Tactical Note: </strong>
          {selectedPoint.tacticalNote}
        </div>
      </div>
    </div>
  );
}
