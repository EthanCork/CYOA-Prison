/**
 * Tests for PathIndicator component
 */

import { render, screen } from '@testing-library/react';
import PathIndicator from '../PathIndicator';
import { useGameStore } from '@/lib/store';

describe('PathIndicator', () => {
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.setState({
      currentPath: null,
    });
  });

  describe('No Path Selected', () => {
    it('should show placeholder when no path selected', () => {
      render(<PathIndicator />);

      expect(screen.getByText('No path selected yet')).toBeInTheDocument();
      expect(screen.getByText(/Choose your approach/)).toBeInTheDocument();
    });

    it('should hide when hideWhenUnselected is true and no path', () => {
      const { container } = render(<PathIndicator hideWhenUnselected={true} />);

      expect(container.firstChild).toBeNull();
    });

    it('should show placeholder when hideWhenUnselected is false and no path', () => {
      render(<PathIndicator hideWhenUnselected={false} />);

      expect(screen.getByText('No path selected yet')).toBeInTheDocument();
    });
  });

  describe('Path A Selected', () => {
    beforeEach(() => {
      useGameStore.setState({ currentPath: 'A' });
    });

    it('should show Path A name', () => {
      render(<PathIndicator />);

      expect(screen.getByText('Path A: Night')).toBeInTheDocument();
    });

    it('should show Path A icon', () => {
      render(<PathIndicator />);

      expect(screen.getByLabelText('Path A icon')).toHaveTextContent('🌙');
    });

    it('should show Path A approach', () => {
      render(<PathIndicator />);

      expect(screen.getByText(/Stealth and infiltration/)).toBeInTheDocument();
    });

    it('should apply blue colors for Path A', () => {
      const { container } = render(<PathIndicator />);

      const card = container.querySelector('.border-blue-600');
      expect(card).toBeInTheDocument();
    });

    it('should show description when showDescription is true', () => {
      render(<PathIndicator showDescription={true} />);

      expect(screen.getByText(/darkness/)).toBeInTheDocument();
    });

    it('should not show description by default', () => {
      render(<PathIndicator showDescription={false} />);

      expect(screen.queryByText(/darkness/)).not.toBeInTheDocument();
    });
  });

  describe('Path B Selected', () => {
    beforeEach(() => {
      useGameStore.setState({ currentPath: 'B' });
    });

    it('should show Path B name', () => {
      render(<PathIndicator />);

      expect(screen.getByText('Path B: Social')).toBeInTheDocument();
    });

    it('should show Path B icon', () => {
      render(<PathIndicator />);

      expect(screen.getByLabelText('Path B icon')).toHaveTextContent('🤝');
    });

    it('should show Path B approach', () => {
      render(<PathIndicator />);

      expect(screen.getByText(/Social manipulation and alliances/)).toBeInTheDocument();
    });

    it('should apply green colors for Path B', () => {
      const { container } = render(<PathIndicator />);

      const card = container.querySelector('.border-green-600');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Path C Selected', () => {
    beforeEach(() => {
      useGameStore.setState({ currentPath: 'C' });
    });

    it('should show Path C name', () => {
      render(<PathIndicator />);

      expect(screen.getByText('Path C: Day (Justice)')).toBeInTheDocument();
    });

    it('should show Path C icon', () => {
      render(<PathIndicator />);

      expect(screen.getByLabelText('Path C icon')).toHaveTextContent('⚖️');
    });

    it('should show Path C approach', () => {
      render(<PathIndicator />);

      expect(screen.getByText(/Investigation and evidence gathering/)).toBeInTheDocument();
    });

    it('should apply amber colors for Path C', () => {
      const { container } = render(<PathIndicator />);

      const card = container.querySelector('.border-amber-600');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should show compact version for Path A', () => {
      useGameStore.setState({ currentPath: 'A' });
      render(<PathIndicator compact={true} />);

      expect(screen.getByText('Path A: Night')).toBeInTheDocument();
      expect(screen.getByLabelText('Path A icon')).toHaveTextContent('🌙');
    });

    it('should not show approach in compact mode', () => {
      useGameStore.setState({ currentPath: 'B' });
      render(<PathIndicator compact={true} />);

      expect(screen.queryByText(/Social manipulation/)).not.toBeInTheDocument();
    });

    it('should not show description in compact mode', () => {
      useGameStore.setState({ currentPath: 'C' });
      render(<PathIndicator compact={true} showDescription={true} />);

      expect(screen.queryByText(/evidence/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have status role when path is selected', () => {
      useGameStore.setState({ currentPath: 'A' });
      render(<PathIndicator />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label with current path', () => {
      useGameStore.setState({ currentPath: 'B' });
      render(<PathIndicator />);

      expect(screen.getByLabelText(/Current path: Path B/)).toBeInTheDocument();
    });

    it('should label path icons', () => {
      useGameStore.setState({ currentPath: 'C' });
      render(<PathIndicator />);

      expect(screen.getByLabelText('Path C icon')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<PathIndicator className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should preserve custom className in compact mode', () => {
      useGameStore.setState({ currentPath: 'A' });
      const { container } = render(<PathIndicator compact={true} className="my-custom-class" />);

      expect(container.firstChild).toHaveClass('my-custom-class');
    });
  });

  describe('Dynamic Path Changes', () => {
    it('should update when path changes from A to B', () => {
      useGameStore.setState({ currentPath: 'A' });
      const { rerender } = render(<PathIndicator />);

      expect(screen.getByText('Path A: Night')).toBeInTheDocument();

      useGameStore.setState({ currentPath: 'B' });
      rerender(<PathIndicator />);

      expect(screen.queryByText('Path A: Night')).not.toBeInTheDocument();
      expect(screen.getByText('Path B: Social')).toBeInTheDocument();
    });

    it('should update when path is unselected', () => {
      useGameStore.setState({ currentPath: 'C' });
      const { rerender } = render(<PathIndicator />);

      expect(screen.getByText('Path C: Day (Justice)')).toBeInTheDocument();

      useGameStore.setState({ currentPath: null });
      rerender(<PathIndicator />);

      expect(screen.queryByText('Path C: Day (Justice)')).not.toBeInTheDocument();
      expect(screen.getByText('No path selected yet')).toBeInTheDocument();
    });
  });
});
