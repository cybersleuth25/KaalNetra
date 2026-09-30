/**
 * KaalNetra — Phaser Tactical Map Scene
 *
 * Implements Phase 6 interactive game-like canvas:
 *   - Strategic map visualization of Chittorgarh and the Mughal encirclement
 *   - Interactive Points of Interest (POIs):
 *       1. Lakhota Bastion (Northern Wall / Mines)
 *       2. Suraj Pol (Sun Gate / Eastern Ramparts)
 *       3. Gaumukh Kund (Rainwater Cistern)
 *       4. Mughal Sabat & Battery Line (Covered Trench Approach)
 *       5. Imperial Encampment (Akbar's Command Pavilion)
 *   - Lightweight ambient motion: pulsing breach markers, atmospheric smoke/dust particles
 *   - Click and hover events emitting to React
 */

import Phaser from 'phaser';
import { TACTICAL_POINTS, type TacticalPoint } from './tacticalData';

export { TACTICAL_POINTS, type TacticalPoint };

export default class TacticalMapScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image;
  private poiMarkers: Phaser.GameObjects.Container[] = [];
  private onSelectPoi?: (poi: TacticalPoint) => void;
  public selectedPoiId: string | null = null;

  constructor() {
    super({ key: 'TacticalMapScene' });
  }

  init(data: { onSelectPoi?: (poi: TacticalPoint) => void; selectedId?: string }) {
    this.onSelectPoi = data.onSelectPoi;
    this.selectedPoiId = data.selectedId || null;
  }

  preload() {
    // Load strategic map background
    this.load.image('strategic_map_bg', '/assets/environments/strategic_map.webp');
  }

  create() {
    const { width, height } = this.scale;

    // Background Image
    this.bgImage = this.add.image(width / 2, height / 2, 'strategic_map_bg');
    this.adjustBackgroundScale();

    // Ambient dark tint for historical seriousness
    const overlay = this.add.rectangle(0, 0, width, height, 0x14100e, 0.45);
    overlay.setOrigin(0, 0);

    // Grid lines for cartographic style
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xbfa57a, 0.12);
    const step = 60;
    for (let x = 0; x < width; x += step) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y < height; y += step) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    graphics.strokePath();

    // Create tactical markers
    this.createTacticalMarkers();

    // Listen to resize
    this.scale.on('resize', this.handleResize, this);
  }

  private adjustBackgroundScale() {
    if (!this.bgImage) return;
    const { width, height } = this.scale;
    const scaleX = width / this.bgImage.width;
    const scaleY = height / this.bgImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.bgImage.setScale(scale).setScrollFactor(0);
    this.bgImage.setPosition(width / 2, height / 2);
  }

  private handleResize() {
    this.adjustBackgroundScale();
    this.updateMarkerPositions();
  }

  private createTacticalMarkers() {
    // Clear existing
    this.poiMarkers.forEach((m) => m.destroy());
    this.poiMarkers = [];

    const { width, height } = this.scale;

    TACTICAL_POINTS.forEach((poi) => {
      const posX = poi.x * width;
      const posY = poi.y * height;

      const container = this.add.container(posX, posY);

      // Color scheme based on type
      let ringColor = 0xd4a72c; // gold
      let iconText = '🏰';
      if (poi.type === 'danger') {
        ringColor = 0xef4444; // red
        iconText = '💥';
      } else if (poi.type === 'resource') {
        ringColor = 0x38bdf8; // cyan
        iconText = '💧';
      } else if (poi.type === 'enemy') {
        ringColor = 0x10b981; // emerald
        iconText = '⚔️';
      }

      // Pulse circle
      const pulseRing = this.add.circle(0, 0, 18, ringColor, 0.25);
      this.tweens.add({
        targets: pulseRing,
        scale: 1.5,
        alpha: 0,
        duration: 1800,
        repeat: -1,
        ease: 'Cubic.easeOut',
      });

      // Core marker disc
      const coreDisc = this.add.circle(0, 0, 12, 0x1c1714, 0.95);
      coreDisc.setStrokeStyle(2, ringColor, 0.9);

      // Icon text
      const icon = this.add.text(0, 0, iconText, {
        fontSize: '12px',
      }).setOrigin(0.5);

      // Label background & text
      const labelBg = this.add.rectangle(0, 22, 100, 18, 0x14100e, 0.85);
      labelBg.setStrokeStyle(1, ringColor, 0.4);
      labelBg.setOrigin(0.5);

      const label = this.add.text(0, 22, poi.name.split(' (')[0], {
        fontFamily: 'serif',
        fontSize: '10px',
        color: '#f5edd6',
      }).setOrigin(0.5);

      container.add([pulseRing, coreDisc, icon, labelBg, label]);
      container.setSize(36, 36);
      container.setInteractive({ useHandCursor: true });

      // Hover effects
      container.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scale: 1.15,
          duration: 150,
          ease: 'Sine.easeOut',
        });
        labelBg.setStrokeStyle(1.5, 0xffffff, 0.9);
      });

      container.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scale: 1.0,
          duration: 150,
          ease: 'Sine.easeOut',
        });
        labelBg.setStrokeStyle(1, ringColor, 0.4);
      });

      container.on('pointerdown', () => {
        this.selectedPoiId = poi.id;
        if (this.onSelectPoi) {
          this.onSelectPoi(poi);
        }
      });

      this.poiMarkers.push(container);
    });
  }

  private updateMarkerPositions() {
    const { width, height } = this.scale;
    TACTICAL_POINTS.forEach((poi, idx) => {
      const marker = this.poiMarkers[idx];
      if (marker) {
        marker.setPosition(poi.x * width, poi.y * height);
      }
    });
  }

  public selectPoint(poiId: string) {
    this.selectedPoiId = poiId;
    const poi = TACTICAL_POINTS.find((p) => p.id === poiId);
    if (poi && this.onSelectPoi) {
      this.onSelectPoi(poi);
    }
  }

  shutdown() {
    this.scale.off('resize', this.handleResize, this);
  }
}
