/**
 * KaalNetra — Phaser Tactical Map Component
 *
 * Implements Game-like Strategic Cartography:
 *   - Embedded Phaser 3/4 canvas with strategic cartography
 *   - Interactive Point-of-Interest selection (Lakhota, Suraj Pol, Gaumukh, Sabats)
 *   - Contextual intelligence card below canvas
 *   - Dark fortress theme, antique gold trims, zero gradients
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
    <div className={`phaser-tactical-map-root flex flex-col gap-1.5 ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141720] border border-[#272E3D] px-3 py-1.5">
        <div className="flex items-center gap-1.5 text-xs text-[#DFBE76] font-mono font-bold uppercase tracking-wider">
          <span>🗺️</span>
          <span>Tactical Map of Chittorgarh Environs (1567)</span>
        </div>

        {/* Sector Quick-Select Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {TACTICAL_POINTS.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handleQuickSelect(poi)}
              className={`text-[10px] font-mono px-2 py-0.5 transition-colors whitespace-nowrap border ${
                selectedPoint.id === poi.id
                  ? 'bg-[#C5A059] border-[#DFBE76] text-[#0D0F14] font-bold'
                  : 'bg-[#0D0F14] border-[#272E3D] text-[#B8B09F] hover:border-[#C5A059]'
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
        className="w-full relative overflow-hidden bg-[#0D0F14] border border-[#272E3D]"
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-[#DFBE76] text-xs font-mono">
            Loading Cartographic Data...
          </div>
        )}
      </div>

      {/* Selected Point Intelligence Card */}
      <div className="bg-[#141720] border border-[#272E3D] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
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
            <h5 className="font-bold text-[#F4EFE6] text-xs md:text-sm">
              {selectedPoint.name}
            </h5>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 border ${
                selectedPoint.type === 'danger'
                  ? 'bg-[#2A1212] border-[#9E2A2B] text-[#FFA3A3]'
                  : selectedPoint.type === 'resource'
                  ? 'bg-[#12281D] border-[#2E724F] text-[#79D19E]'
                  : selectedPoint.type === 'defense'
                  ? 'bg-[#241D12] border-[#C5A059] text-[#DFBE76]'
                  : 'bg-[#12281D] border-[#2E724F] text-[#79D19E]'
              }`}
            >
              {selectedPoint.type}
            </span>
          </div>
          <p className="text-xs text-[#B8B09F] mt-1 leading-snug">
            {selectedPoint.description}
          </p>
        </div>

        <div className="bg-[#0D0F14] border border-[#272E3D] p-2 text-[11px] text-[#B8B09F] max-w-xs flex-shrink-0 font-mono">
          <strong className="text-[#DFBE76]">Tactical Note: </strong>
          {selectedPoint.tacticalNote}
        </div>
      </div>
    </div>
  );
}
