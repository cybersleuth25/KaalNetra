import { StageProvider, useStage } from './StageContext';
import { GameplayProvider } from './GameplayContext';
import HomeScreen from '../components/screens/HomeScreen';
import ScenarioSelectScreen from '../components/screens/ScenarioSelectScreen';
import ContextScreen from '../components/screens/ContextScreen';
import BriefingScreen from '../components/screens/BriefingScreen';
import DecisionScreen from '../components/screens/DecisionScreen';
import SimulationScreen from '../components/screens/SimulationScreen';
import OutcomeScreen from '../components/screens/OutcomeScreen';
import CompareScreen from '../components/screens/CompareScreen';
import ReflectionScreen from '../components/screens/ReflectionScreen';
import DevDebugModal from '../components/common/DevDebugModal';
import '../styles/index.css';

/**
 * Game stages matching the flow from ANTIGRAVITY_BUILD_PROMPT.md:
 * HOME → SCENARIO → CONTEXT → BRIEFING → DECISION_1 → SIMULATION_1
 * → DECISION_2 → OUTCOME → COMPARE → REFLECTION
 */

import ScreenTransition from '../components/common/ScreenTransition';

function StageRouter() {
  const { stage } = useStage();

  const renderStage = () => {
    switch (stage) {
      case 'HOME':
        return <HomeScreen />;
      case 'SCENARIO':
        return <ScenarioSelectScreen />;
      case 'CONTEXT':
        return <ContextScreen />;
      case 'BRIEFING':
        return <BriefingScreen />;
      case 'DECISION_1':
        return <DecisionScreen decisionNumber={1} />;
      case 'SIMULATION_1':
        return <SimulationScreen />;
      case 'DECISION_2':
        return <DecisionScreen decisionNumber={2} />;
      case 'OUTCOME':
        return <OutcomeScreen />;
      case 'COMPARE':
        return <CompareScreen />;
      case 'REFLECTION':
        return <ReflectionScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return <ScreenTransition stageKey={stage}>{renderStage()}</ScreenTransition>;
}

export default function App() {
  return (
    <StageProvider>
      <GameplayProvider>
        <div className="app-root">
          <StageRouter />
          <DevDebugModal />
        </div>
      </GameplayProvider>
    </StageProvider>
  );
}
