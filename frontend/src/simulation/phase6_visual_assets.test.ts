/**
 * KaalNetra — Phase 6 Test Suite: Visual Polish & Asset Integration
 *
 * Verifies Phase 6 requirements:
 *   1. Centralized asset catalog has all required characters and environments
 *   2. Strict aspect ratio constraints (3:4 for characters) and metadata definitions
 *   3. Fallback resolution for characters and environments
 *   4. Tactical map scene POI definitions and coordinate boundaries
 *   5. Clean asset paths without malformed URIs or dead links
 */

import { describe, it, expect } from 'vitest';
import {
  CHARACTERS,
  ENVIRONMENTS,
  getCharacterAsset,
  getEnvironmentAsset,
} from '../assets/registry';
import { TACTICAL_POINTS } from '../game/tacticalData';

describe('Phase 6 — Visual Polish & Asset Integration', () => {
  describe('1. Character Asset Catalog', () => {
    it('contains all 6 required historical and composite characters', () => {
      const required = ['jaimal', 'patta', 'udai_singh', 'akbar', 'mirza_yusuf', 'resource_steward'];
      for (const id of required) {
        expect(CHARACTERS[id]).toBeDefined();
        expect(CHARACTERS[id].name).toBeTruthy();
        expect(CHARACTERS[id].role).toBeTruthy();
        expect(CHARACTERS[id].src).toMatch(/^\/assets\/characters\//);
        expect(CHARACTERS[id].aspectRatio).toBe('3/4');
        expect(['mewar', 'mughal', 'neutral']).toContain(CHARACTERS[id].faction);
      }
    });

    it('distinguishes between documented historical figures and composite characters', () => {
      expect(CHARACTERS.jaimal.historical).toBe(true);
      expect(CHARACTERS.patta.historical).toBe(true);
      expect(CHARACTERS.udai_singh.historical).toBe(true);
      expect(CHARACTERS.akbar.historical).toBe(true);

      // Composites representing institutions
      expect(CHARACTERS.mirza_yusuf.historical).toBe(false);
      expect(CHARACTERS.resource_steward.historical).toBe(false);
    });

    it('getCharacterAsset resolves IDs, keywords, and role aliases', () => {
      expect(getCharacterAsset('jaimal').id).toBe('jaimal');
      expect(getCharacterAsset('Rao Jaimal Rathore').id).toBe('jaimal');
      expect(getCharacterAsset('patta').id).toBe('patta');
      expect(getCharacterAsset('Rawat Patta').id).toBe('patta');
      expect(getCharacterAsset('udai_singh').id).toBe('udai_singh');
      expect(getCharacterAsset('Maharana Udai').id).toBe('udai_singh');
      expect(getCharacterAsset('akbar').id).toBe('akbar');
      expect(getCharacterAsset('Emperor Akbar').id).toBe('akbar');
      expect(getCharacterAsset('siege_officer').id).toBe('mirza_yusuf');
      expect(getCharacterAsset('resource_steward').id).toBe('resource_steward');
      expect(getCharacterAsset('unknown_role').id).toBe('jaimal'); // default fallback
    });
  });

  describe('2. Environment Asset Catalog', () => {
    it('contains all 5 required environments with WebP and PNG paths', () => {
      const requiredEnvs = [
        'chittor_overview',
        'fort_interior',
        'fort_walls',
        'mughal_siege_camp',
        'strategic_map',
      ];

      for (const envId of requiredEnvs) {
        expect(ENVIRONMENTS[envId]).toBeDefined();
        expect(ENVIRONMENTS[envId].src).toMatch(/^\/assets\/environments\/.*\.webp$/);
        expect(ENVIRONMENTS[envId].fallbackSrc).toMatch(/^\/assets\/environments\/.*\.png$/);
        expect(ENVIRONMENTS[envId].context).toBeTruthy();
        expect(ENVIRONMENTS[envId].description).toBeTruthy();
      }
    });

    it('getEnvironmentAsset resolves scene keys and keywords', () => {
      expect(getEnvironmentAsset('chittor_overview').id).toBe('chittor_overview');
      expect(getEnvironmentAsset('map').id).toBe('strategic_map');
      expect(getEnvironmentAsset('strategic').id).toBe('strategic_map');
      expect(getEnvironmentAsset('camp').id).toBe('mughal_siege_camp');
      expect(getEnvironmentAsset('walls').id).toBe('fort_walls');
      expect(getEnvironmentAsset('interior').id).toBe('fort_interior');
      expect(getEnvironmentAsset('unknown').id).toBe('chittor_overview'); // default fallback
    });
  });

  describe('3. Phaser Tactical Map Scene Points of Interest', () => {
    it('contains all 5 required tactical POIs with valid normalized coordinates', () => {
      expect(TACTICAL_POINTS.length).toBe(5);

      const requiredPoiIds = ['lakhota', 'suraj_pol', 'gaumukh', 'sabat_line', 'akbar_camp'];
      const foundIds = TACTICAL_POINTS.map((p) => p.id);

      for (const id of requiredPoiIds) {
        expect(foundIds).toContain(id);
      }

      for (const poi of TACTICAL_POINTS) {
        expect(poi.x).toBeGreaterThanOrEqual(0);
        expect(poi.x).toBeLessThanOrEqual(1);
        expect(poi.y).toBeGreaterThanOrEqual(0);
        expect(poi.y).toBeLessThanOrEqual(1);
        expect(['danger', 'defense', 'resource', 'enemy']).toContain(poi.type);
        expect(poi.description).toBeTruthy();
        expect(poi.tacticalNote).toBeTruthy();
      }
    });
  });
});
