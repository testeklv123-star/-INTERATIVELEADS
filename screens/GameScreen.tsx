import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PrizeWheel from '../components/games/PrizeWheel';
import ScratchCard from '../components/games/ScratchCard';
import Quiz from '../components/games/Quiz';

const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  switch (gameId) {
    case 'prize_wheel':
      return <PrizeWheel />;
    case 'scratch_card':
      return <ScratchCard />;
    case 'quiz':
      return <Quiz />;
    default:
      return <Navigate to="/games" replace />;
  }
};

export default GameScreen;