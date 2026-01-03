/**
 * Tests for ChoiceButton component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ChoiceButton from '../ChoiceButton';
import type { Choice } from '@/types';

describe('ChoiceButton', () => {
  const basicChoice: Choice = {
    text: 'Continue forward',
    nextScene: 'A-1-001',
  };

  const choiceWithStateChanges: Choice = {
    text: 'Examine the cell',
    nextScene: 'A-1-015',
    relationshipChanges: {
      ramirez: 5,
    },
    flagChanges: {
      set: ['examined_cell'],
    },
    itemChanges: {
      add: ['loose_brick'],
    },
  };

  describe('Basic Rendering', () => {
    it('should render choice text', () => {
      render(<ChoiceButton choice={basicChoice} />);
      expect(screen.getByText('Continue forward')).toBeInTheDocument();
    });

    it('should render with index number when provided', () => {
      render(<ChoiceButton choice={basicChoice} index={1} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render without index number when not provided', () => {
      render(<ChoiceButton choice={basicChoice} />);
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should have accessible aria-label', () => {
      render(<ChoiceButton choice={basicChoice} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Continue forward');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<ChoiceButton choice={basicChoice} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(basicChoice);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<ChoiceButton choice={basicChoice} onClick={handleClick} disabled />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should allow multiple clicks', () => {
      const handleClick = jest.fn();
      render(<ChoiceButton choice={basicChoice} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Disabled State', () => {
    it('should render as disabled when disabled prop is true', () => {
      render(<ChoiceButton choice={basicChoice} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show lock icon when disabled', () => {
      render(<ChoiceButton choice={basicChoice} disabled />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should display lock reason when provided', () => {
      render(
        <ChoiceButton
          choice={basicChoice}
          disabled
          lockReason="Requires: Master Key"
        />
      );
      expect(screen.getByText('Requires: Master Key')).toBeInTheDocument();
    });

    it('should not display lock reason when not disabled', () => {
      render(
        <ChoiceButton choice={basicChoice} lockReason="Requires: Master Key" />
      );
      expect(screen.queryByText('Requires: Master Key')).not.toBeInTheDocument();
    });

    it('should have aria-disabled attribute when disabled', () => {
      render(<ChoiceButton choice={basicChoice} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('State Changes Display', () => {
    it('should render choice with relationship changes', () => {
      render(<ChoiceButton choice={choiceWithStateChanges} />);
      expect(screen.getByText('Examine the cell')).toBeInTheDocument();
    });

    it('should handle complex choices with multiple state changes', () => {
      const complexChoice: Choice = {
        text: 'Use the keycard',
        nextScene: 'B-1-001',
        relationshipChanges: {
          guard: 5,
          prisoner: -3,
        },
        flagChanges: {
          set: ['used_keycard'],
          unset: ['has_keycard'],
        },
        itemChanges: {
          add: ['access_log'],
          remove: ['keycard'],
        },
        evidenceChanges: {
          add: ['security_footage'],
        },
      };

      render(<ChoiceButton choice={complexChoice} />);
      expect(screen.getByText('Use the keycard')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ChoiceButton choice={basicChoice} className="custom-class" />
      );
      const button = container.querySelector('.custom-class');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('should handle mouse enter and leave events', () => {
      render(<ChoiceButton choice={basicChoice} />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);
      // Component should update hover state (visual change)

      fireEvent.mouseLeave(button);
      // Component should reset hover state
    });
  });

  describe('Choice with Requirements', () => {
    it('should render choice with requirements', () => {
      const choiceWithReqs: Choice = {
        text: 'Unlock the door',
        nextScene: 'A-2-001',
        requirements: {
          items: ['key'],
          flags: ['found_door'],
          relationships: {
            guard: 25,
          },
        },
      };

      render(<ChoiceButton choice={choiceWithReqs} />);
      expect(screen.getByText('Unlock the door')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<ChoiceButton choice={basicChoice} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have proper button role', () => {
      render(<ChoiceButton choice={basicChoice} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
