import React from 'react';
import { useGameStore } from './hooks/useGameStore';
import RoleScreen from './screens/RoleScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import NameScreen from './screens/NameScreen';
import WorldSelectScreen from './screens/WorldSelectScreen';
import GameScreen from './screens/GameScreen';
import CelebrationScreen from './screens/CelebrationScreen';
import TeacherScreen from './screens/TeacherScreen';

const SCREENS = {
  role: RoleScreen, welcome: WelcomeScreen, name: NameScreen,
  worldSelect: WorldSelectScreen, game: GameScreen,
  celebration: CelebrationScreen, teacher: TeacherScreen,
};

export default function App() {
  const screen = useGameStore(s => s.screen);
  const Screen = SCREENS[screen] || RoleScreen;
  return <div className="h-full w-full overflow-hidden"><Screen /></div>;
}
