/**
 * Tests for SceneRenderer component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SceneRenderer from '../SceneRenderer';
import type { Scene } from '@/types';

describe('SceneRenderer', () => {
  const narrativeScene: Scene = {
    id: 'X-0-001',
    type: 'narrative',
    content: {
      text: 'The transport van rumbles to a stop.',
      visual: '/images/bg.jpg',
    },
    choices: [],
    nextScene: 'X-0-002',
  };

  const dialogueScene: Scene = {
    id: 'X-0-002',
    type: 'dialogue',
    content: {
      text: 'Welcome to El Palo de Queso.',
      speaker: 'Officer Ramirez',
      visual: '/images/ramirez.png',
    },
    choices: [
      {
        text: 'Thank you, officer.',
        nextScene: 'A-1-001',
      },
      {
        text: 'Say nothing.',
        nextScene: 'A-1-003',
      },
    ],
  };

  const choiceScene: Scene = {
    id: 'A-1-001',
    type: 'choice',
    content: {
      text: 'You reach your cell.',
    },
    choices: [
      {
        text: 'Examine the cell',
        nextScene: 'A-1-015',
      },
      {
        text: 'Talk to inmates',
        nextScene: 'A-1-016',
      },
      {
        text: 'Rest on bunk',
        nextScene: 'A-1-017',
      },
    ],
  };

  const endingScene: Scene = {
    id: 'END-1-ESCAPE',
    type: 'ending',
    content: {
      text: 'You have escaped!',
    },
    choices: [],
    flagChanges: {
      set: ['escaped_prison', 'ending_reached'],
    },
  };

  const investigationScene: Scene = {
    id: 'A-1-015',
    type: 'investigation',
    content: {
      text: 'You find mysterious numbers scratched into the wall.',
    },
    choices: [
      {
        text: 'Take note of the numbers',
        nextScene: 'A-2-001',
      },
    ],
    itemChanges: {
      add: ['loose_brick'],
    },
  };

  describe('Scene Content Rendering', () => {
    it('should render scene text', () => {
      render(<SceneRenderer scene={narrativeScene} />);
      expect(screen.getByText(/transport van rumbles/i)).toBeInTheDocument();
    });

    it('should render speaker name for dialogue scenes', () => {
      render(<SceneRenderer scene={dialogueScene} />);
      expect(screen.getByText('Officer Ramirez')).toBeInTheDocument();
    });

    it('should not render speaker for non-dialogue scenes', () => {
      render(<SceneRenderer scene={narrativeScene} />);
      expect(screen.queryByText('Officer Ramirez')).not.toBeInTheDocument();
    });

    it('should render scene type badge', () => {
      render(<SceneRenderer scene={dialogueScene} />);
      expect(screen.getByText('Dialogue')).toBeInTheDocument();
    });

    it('should render visual indicator when present', () => {
      render(<SceneRenderer scene={narrativeScene} />);
      expect(screen.getByText(/bg\.jpg/i)).toBeInTheDocument();
    });
  });

  describe('Choice Rendering', () => {
    it('should render all choices', () => {
      render(<SceneRenderer scene={choiceScene} />);
      expect(screen.getByText('Examine the cell')).toBeInTheDocument();
      expect(screen.getByText('Talk to inmates')).toBeInTheDocument();
      expect(screen.getByText('Rest on bunk')).toBeInTheDocument();
    });

    it('should render choice numbers when enabled', () => {
      render(<SceneRenderer scene={dialogueScene} showChoiceNumbers={true} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should not render choice numbers when disabled', () => {
      render(<SceneRenderer scene={dialogueScene} showChoiceNumbers={false} />);
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should show "What will you do?" header when choices exist', () => {
      render(<SceneRenderer scene={choiceScene} />);
      expect(screen.getByText('What will you do?')).toBeInTheDocument();
    });

    it('should call onChoiceSelected when choice is clicked', () => {
      const handleChoice = jest.fn();
      render(
        <SceneRenderer scene={dialogueScene} onChoiceSelected={handleChoice} />
      );

      const firstChoice = screen.getByText('Thank you, officer.');
      fireEvent.click(firstChoice);

      expect(handleChoice).toHaveBeenCalledTimes(1);
      expect(handleChoice).toHaveBeenCalledWith({
        text: 'Thank you, officer.',
        nextScene: 'A-1-001',
      });
    });
  });

  describe('Narrative Scenes (Auto-Continue)', () => {
    it('should render continue button for narrative scenes', () => {
      render(<SceneRenderer scene={narrativeScene} />);
      expect(screen.getByText('Continue →')).toBeInTheDocument();
    });

    it('should call onContinue when continue button is clicked', () => {
      const handleContinue = jest.fn();
      render(
        <SceneRenderer scene={narrativeScene} onContinue={handleContinue} />
      );

      const continueButton = screen.getByText('Continue →');
      fireEvent.click(continueButton);

      expect(handleContinue).toHaveBeenCalledTimes(1);
      expect(handleContinue).toHaveBeenCalledWith('X-0-002');
    });

    it('should not render continue button for scenes with choices', () => {
      render(<SceneRenderer scene={dialogueScene} />);
      expect(screen.queryByText('Continue →')).not.toBeInTheDocument();
    });
  });

  describe('Ending Scenes', () => {
    it('should render ending display', () => {
      render(<SceneRenderer scene={endingScene} />);
      expect(screen.getByText('The End')).toBeInTheDocument();
    });

    it('should render ending text', () => {
      render(<SceneRenderer scene={endingScene} />);
      expect(screen.getByText(/You have escaped!/i)).toBeInTheDocument();
    });

    it('should display ending flags', () => {
      render(<SceneRenderer scene={endingScene} />);
      expect(screen.getByText('escaped_prison')).toBeInTheDocument();
      expect(screen.getByText('ending_reached')).toBeInTheDocument();
    });

    it('should not render choices for ending scenes', () => {
      render(<SceneRenderer scene={endingScene} />);
      expect(screen.queryByText('What will you do?')).not.toBeInTheDocument();
    });

    it('should not render continue button for ending scenes', () => {
      render(<SceneRenderer scene={endingScene} />);
      expect(screen.queryByText('Continue →')).not.toBeInTheDocument();
    });
  });

  describe('Typewriter Effect', () => {
    it('should pass typewriter prop to SceneText', () => {
      render(<SceneRenderer scene={narrativeScene} typewriter={true} />);
      // SceneText component handles typewriter - just verify it renders
      expect(screen.getByText(/transport van/i)).toBeInTheDocument();
    });

    it('should pass typewriterSpeed to SceneText', () => {
      render(
        <SceneRenderer
          scene={narrativeScene}
          typewriter={true}
          typewriterSpeed={50}
        />
      );
      expect(screen.getByText(/transport van/i)).toBeInTheDocument();
    });
  });

  describe('Scene Types', () => {
    it('should render investigation scene correctly', () => {
      render(<SceneRenderer scene={investigationScene} />);
      expect(screen.getByText(/mysterious numbers/i)).toBeInTheDocument();
      expect(screen.getByText('Investigation')).toBeInTheDocument();
    });

    it('should render all scene type badges correctly', () => {
      const { rerender } = render(<SceneRenderer scene={narrativeScene} />);
      expect(screen.getByText('Narrative')).toBeInTheDocument();

      rerender(<SceneRenderer scene={dialogueScene} />);
      expect(screen.getByText('Dialogue')).toBeInTheDocument();

      rerender(<SceneRenderer scene={choiceScene} />);
      expect(screen.getByText('Choice')).toBeInTheDocument();

      rerender(<SceneRenderer scene={investigationScene} />);
      expect(screen.getByText('Investigation')).toBeInTheDocument();

      rerender(<SceneRenderer scene={endingScene} />);
      expect(screen.getByText('Ending')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show warning for scene with no choices and no next scene', () => {
      const brokenScene: Scene = {
        id: 'BROKEN-001',
        type: 'choice',
        content: {
          text: 'A scene with no options',
        },
        choices: [],
      };

      render(<SceneRenderer scene={brokenScene} />);
      expect(
        screen.getByText(/This scene has no choices or continuation/i)
      ).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SceneRenderer scene={narrativeScene} className="custom-class" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
