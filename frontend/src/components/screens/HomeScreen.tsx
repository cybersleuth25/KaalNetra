/**
 * KaalNetra Home Screen
 *
 * PRD: "Hero background: Chittor fort at dusk."
 * Elements: Logo, tagline, CTA button.
 * Tagline: "History is fixed. Your decisions are not."
 */

import { useStage } from '../../app/StageContext';

export default function HomeScreen() {
  const { nextStage } = useStage();

  return (
    <div className="home-screen">
      {/* Dark atmospheric overlay */}
      <div className="home-overlay" />

      <div className="home-content">
        {/* Logo / Title */}
        <h1 className="home-title">
          <span className="home-title-kaal">Kaal</span>
          <span className="home-title-netra">Netra</span>
        </h1>

        {/* Subtitle */}
        <p className="home-subtitle">
          Change the decision. Experience the consequence.
          <br />
          Remember what really happened.
        </p>

        {/* Tagline */}
        <p className="home-tagline">
          History is fixed. Your decisions are not.
        </p>

        {/* CTA */}
        <button
          className="home-cta"
          onClick={nextStage}
        >
          Enter Chittor
        </button>

        {/* Attribution */}
        <p className="home-attribution">
          Interactive Historical Simulation &middot; SIH 26208
        </p>
      </div>
    </div>
  );
}
