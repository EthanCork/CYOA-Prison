/**
 * Tests for SaveLoadMenu component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveLoadMenu from '../SaveLoadMenu';
import { useGameStore } from '@/lib/store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SaveLoadMenu', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  it('should render 3 save slots', () => {
    render(<SaveLoadMenu />);

    expect(screen.getByText('Slot 1')).toBeInTheDocument();
    expect(screen.getByText('Slot 2')).toBeInTheDocument();
    expect(screen.getByText('Slot 3')).toBeInTheDocument();
  });

  it('should show empty slots initially', () => {
    render(<SaveLoadMenu />);

    const emptySlots = screen.getAllByText('Empty Slot');
    expect(emptySlots).toHaveLength(3);
  });

  it('should display save/load/delete buttons for each slot', () => {
    render(<SaveLoadMenu />);

    const saveButtons = screen.getAllByText('Save');
    const loadButtons = screen.getAllByText('Load');
    const deleteButtons = screen.getAllByText('Delete');

    expect(saveButtons).toHaveLength(3);
    expect(loadButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('should disable load and delete buttons for empty slots', () => {
    render(<SaveLoadMenu />);

    const loadButtons = screen.getAllByText('Load');
    const deleteButtons = screen.getAllByText('Delete');

    loadButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should save game to slot when save button is clicked', async () => {
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.addItem('test-item');

    render(<SaveLoadMenu />);

    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]); // Click save on slot 1

    await waitFor(() => {
      expect(screen.getByText(/Game saved to Slot 1/)).toBeInTheDocument();
    });

    // Slot should no longer show "Empty Slot"
    await waitFor(() => {
      const emptySlots = screen.queryAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(2); // Only 2 empty slots now
    });
  });

  it('should show confirmation dialog when overwriting existing save', async () => {
    // Save to slot 1 first
    const store = useGameStore.getState();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]); // Click save on slot 1 again

    await waitFor(() => {
      expect(screen.getByText(/Confirm Save/)).toBeInTheDocument();
      expect(screen.getByText(/This will overwrite the existing save/)).toBeInTheDocument();
    });
  });

  it('should load game when load button is clicked', async () => {
    const store = useGameStore.getState();
    store.goToScene('saved-scene');
    store.addItem('saved-item');
    store.saveToSlot(1);

    // Reset and change state
    store.goToScene('different-scene');
    store.addItem('different-item');

    render(<SaveLoadMenu />);

    const loadButtons = screen.getAllByText('Load');
    fireEvent.click(loadButtons[0]); // Click load on slot 1

    // Confirm load
    await waitFor(() => {
      expect(screen.getByText(/Confirm Load/)).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText('Load');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-blue-600')
    );
    fireEvent.click(confirmButton!);

    await waitFor(() => {
      expect(screen.getByText(/Game loaded from Slot 1/)).toBeInTheDocument();
    });

    // Verify state was restored
    const currentState = useGameStore.getState();
    expect(currentState.currentScene).toBe('saved-scene');
    expect(currentState.inventory).toContain('saved-item');
  });

  it('should show confirmation dialog when loading', async () => {
    const store = useGameStore.getState();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    const loadButtons = screen.getAllByText('Load');
    fireEvent.click(loadButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Confirm Load/)).toBeInTheDocument();
      expect(screen.getByText(/Any unsaved progress will be lost/)).toBeInTheDocument();
    });
  });

  it('should delete save when delete button is clicked', async () => {
    const store = useGameStore.getState();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm delete
    await waitFor(() => {
      expect(screen.getByText(/Confirm Delete/)).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText('Delete');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-red-600')
    );
    fireEvent.click(confirmButton!);

    await waitFor(() => {
      expect(screen.getByText(/Slot 1 deleted/)).toBeInTheDocument();
    });

    // Slot should now be empty
    await waitFor(() => {
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(3);
    });
  });

  it('should show confirmation dialog when deleting', async () => {
    const store = useGameStore.getState();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Confirm Delete/)).toBeInTheDocument();
      expect(screen.getByText(/This cannot be undone/)).toBeInTheDocument();
    });
  });

  it('should cancel confirmation dialog when cancel is clicked', async () => {
    const store = useGameStore.getState();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Confirm Delete/)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Confirm Delete/)).not.toBeInTheDocument();
    });
  });

  it('should display save metadata', async () => {
    const store = useGameStore.getState();
    store.goToScene('metadata-scene');
    store.setPath('A');
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    await waitFor(() => {
      expect(screen.getByText(/metadata-scene/)).toBeInTheDocument();
      expect(screen.getByText(/Night\/Stealth/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display path information correctly', async () => {
    const store = useGameStore.getState();

    // Test Path A
    store.setPath('A');
    store.saveToSlot(1);

    // Test Path B
    store.setPath('B');
    store.saveToSlot(2);

    // Test Path C
    store.setPath('C');
    store.saveToSlot(3);

    render(<SaveLoadMenu />);

    await waitFor(() => {
      expect(screen.getByText(/Night\/Stealth/)).toBeInTheDocument();
      expect(screen.getByText(/Social\/Persuasion/)).toBeInTheDocument();
      expect(screen.getByText(/Day\/Justice/)).toBeInTheDocument();
    });
  });

  it('should display day/time for Path C saves', async () => {
    const store = useGameStore.getState();
    store.setPath('C');
    store.initializeTime();
    store.saveToSlot(1);

    render(<SaveLoadMenu />);

    await waitFor(() => {
      expect(screen.getByText(/Day 1/)).toBeInTheDocument();
      expect(screen.getByText(/morning/)).toBeInTheDocument();
    });
  });

  it('should show close button when showCloseButton is true', () => {
    const onClose = jest.fn();
    render(<SaveLoadMenu onClose={onClose} showCloseButton={true} />);

    const closeButton = screen.getByText('✕');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not show close button when showCloseButton is false', () => {
    render(<SaveLoadMenu showCloseButton={false} />);

    const closeButton = screen.queryByText('✕');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('should handle errors when saving fails', async () => {
    // Mock the store's saveToSlot to throw error
    const store = useGameStore.getState();
    const originalSave = store.saveToSlot;
    store.saveToSlot = jest.fn().mockImplementation(() => {
      throw new Error('Save failed');
    });

    render(<SaveLoadMenu />);

    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Failed to save game/)).toBeInTheDocument();
    });

    store.saveToSlot = originalSave;
  });

  it('should handle errors when loading fails', async () => {
    const store = useGameStore.getState();
    store.saveToSlot(1);

    // Mock the store's loadFromSlot to throw error
    const originalLoad = store.loadFromSlot;
    store.loadFromSlot = jest.fn().mockImplementation(() => {
      throw new Error('Load failed');
    });

    render(<SaveLoadMenu />);

    const loadButtons = screen.getAllByText('Load');
    fireEvent.click(loadButtons[0]);

    // Confirm load
    await waitFor(() => {
      const confirmButtons = screen.getAllByText('Load');
      const confirmButton = confirmButtons.find(btn =>
        btn.className.includes('bg-blue-600')
      );
      fireEvent.click(confirmButton!);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to load game/)).toBeInTheDocument();
    });

    store.loadFromSlot = originalLoad;
  });

  it('should show notification when trying to load empty slot', () => {
    render(<SaveLoadMenu />);

    const loadButtons = screen.getAllByText('Load');
    fireEvent.click(loadButtons[0]);

    // Should show error notification without confirmation dialog
    waitFor(() => {
      expect(screen.getByText(/Slot 1 is empty/)).toBeInTheDocument();
      expect(screen.queryByText(/Confirm Load/)).not.toBeInTheDocument();
    });
  });

  it('should show notification when trying to delete empty slot', () => {
    render(<SaveLoadMenu />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Should show error notification without confirmation dialog
    waitFor(() => {
      expect(screen.getByText(/Slot 1 is already empty/)).toBeInTheDocument();
      expect(screen.queryByText(/Confirm Delete/)).not.toBeInTheDocument();
    });
  });

  it('should auto-hide notification after 3 seconds', async () => {
    render(<SaveLoadMenu />);

    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]);

    // Wait for notification to appear
    await waitFor(() => {
      expect(screen.getByText(/Game saved to Slot 1/)).toBeInTheDocument();
    });

    // Use fake timers after async operations are done
    jest.useFakeTimers();

    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);

    // Run pending timers
    jest.runAllTimers();

    jest.useRealTimers();

    // Notification should be gone
    await waitFor(() => {
      expect(screen.queryByText(/Game saved to Slot 1/)).not.toBeInTheDocument();
    });
  });
});
