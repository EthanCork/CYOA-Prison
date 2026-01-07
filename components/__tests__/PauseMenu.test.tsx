/**
 * Tests for PauseMenu component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import PauseMenu from '../PauseMenu';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock window.confirm
global.confirm = jest.fn(() => true);

describe('PauseMenu', () => {
  const mockPush = jest.fn();
  const mockOnResume = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockPush.mockClear();
    mockOnResume.mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(<PauseMenu isOpen={false} onResume={mockOnResume} />);
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('should display all menu options', () => {
    render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
    expect(screen.getByText('Resume Game')).toBeInTheDocument();
    expect(screen.getByText('Save Game')).toBeInTheDocument();
    expect(screen.getByText('Load Game')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('should display keyboard shortcut hint', () => {
    render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
    expect(screen.getByText('Press ESC to resume')).toBeInTheDocument();
  });

  describe('Resume Button', () => {
    it('should call onResume when clicked', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Resume Game'));
      expect(mockOnResume).toHaveBeenCalled();
    });

    it('should have green gradient styling', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Resume Game');
      expect(button).toHaveClass('from-green-700');
    });
  });

  describe('Save Game Button', () => {
    it('should open save/load menu', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Save Game'));

      // SaveLoadMenu should appear
      expect(screen.getByText('Save/Load Game')).toBeInTheDocument();
    });

    it('should hide main pause menu when save/load opens', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Save Game'));

      // Main pause menu should be hidden
      expect(screen.queryByText('Paused')).not.toBeInTheDocument();
    });
  });

  describe('Load Game Button', () => {
    it('should open save/load menu', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Load Game'));

      // SaveLoadMenu should appear
      expect(screen.getByText('Save/Load Game')).toBeInTheDocument();
    });
  });

  describe('Settings Button', () => {
    it('should open settings menu', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Settings'));

      // SettingsMenu should appear with its title
      expect(screen.getByText('Text Speed')).toBeInTheDocument();
      expect(screen.getByText('Audio')).toBeInTheDocument();
    });

    it('should hide main pause menu when settings opens', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Settings'));

      // Main pause menu should be hidden
      expect(screen.queryByText('Paused')).not.toBeInTheDocument();
    });

    it('should return to pause menu when settings closed', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Settings'));

      // Close settings
      const closeButtons = screen.getAllByText('Close');
      const settingsCloseButton = closeButtons.find(btn => btn.tagName === 'BUTTON');
      fireEvent.click(settingsCloseButton!);

      // Pause menu should be back
      expect(screen.getByText('Paused')).toBeInTheDocument();
    });
  });

  describe('Main Menu Button', () => {
    it('should show confirmation dialog', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Main Menu'));

      expect(screen.getByText('Return to Main Menu?')).toBeInTheDocument();
      expect(screen.getByText(/Any unsaved progress will be lost/)).toBeInTheDocument();
    });

    it('should navigate to menu when confirmed', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Main Menu'));

      // Click confirm button
      const confirmButton = screen.getByText('Return to Menu');
      fireEvent.click(confirmButton);

      expect(mockPush).toHaveBeenCalledWith('/menu');
    });

    it('should not navigate when cancelled', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Main Menu'));

      // Click cancel button
      const cancelButton = screen.getByText('Stay in Game');
      fireEvent.click(cancelButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should hide confirmation dialog when cancelled', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Main Menu'));

      expect(screen.getByText('Return to Main Menu?')).toBeInTheDocument();

      // Click cancel
      const cancelButton = screen.getByText('Stay in Game');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Return to Main Menu?')).not.toBeInTheDocument();
      expect(screen.getByText('Paused')).toBeInTheDocument(); // Back to pause menu
    });

    it('should use warning type for confirmation', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      fireEvent.click(screen.getByText('Main Menu'));

      const confirmButton = screen.getByText('Return to Menu');
      expect(confirmButton).toHaveClass('bg-yellow-600');
    });
  });

  describe('Overlay Styling', () => {
    it('should have dark overlay background', () => {
      const { container } = render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const overlay = container.querySelector('.bg-black.bg-opacity-90');
      expect(overlay).toBeInTheDocument();
    });

    it('should have fade-in animation', () => {
      const { container } = render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const overlay = container.querySelector('.animate-fade-in');
      expect(overlay).toBeInTheDocument();
    });

    it('should be positioned fixed and fullscreen', () => {
      const { container } = render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('should have high z-index', () => {
      const { container } = render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const overlay = container.querySelector('.z-50');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Button Colors', () => {
    it('should have green Resume button', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Resume Game');
      expect(button).toHaveClass('from-green-700');
    });

    it('should have blue Save button', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Save Game');
      expect(button).toHaveClass('from-blue-800');
    });

    it('should have purple Load button', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Load Game');
      expect(button).toHaveClass('from-purple-800');
    });

    it('should have gray Settings button', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Settings');
      expect(button).toHaveClass('from-gray-700');
    });

    it('should have red Main Menu button', () => {
      render(<PauseMenu isOpen={true} onResume={mockOnResume} />);
      const button = screen.getByText('Main Menu');
      expect(button).toHaveClass('from-red-800');
    });
  });
});
