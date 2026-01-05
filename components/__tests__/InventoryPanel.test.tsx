/**
 * Tests for InventoryPanel component
 * Phase 2 - Step 18: Inventory Panel Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import InventoryPanel from '../InventoryPanel';
import { useGameStore } from '@/lib/store';
import { getItemById } from '@/lib/itemLoader';

describe('InventoryPanel', () => {
  beforeEach(() => {
    // Reset game store before each test
    useGameStore.getState().resetGame();
  });

  describe('Basic Rendering', () => {
    it('should render the inventory panel', () => {
      render(<InventoryPanel />);

      expect(screen.getByText('Inventory')).toBeInTheDocument();
    });

    it('should display empty state when inventory is empty', () => {
      render(<InventoryPanel />);

      expect(screen.getByText(/your inventory is empty/i)).toBeInTheDocument();
      expect(screen.getByText(/items you collect will appear here/i)).toBeInTheDocument();
    });

    it('should display item count in header', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');
      addItem('loose_brick');

      render(<InventoryPanel />);

      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('should display inventory icon emoji', () => {
      render(<InventoryPanel />);

      // Check for backpack emoji in header
      expect(screen.getByText('🎒')).toBeInTheDocument();
    });
  });

  describe('Item Display', () => {
    it('should display items in the inventory', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');
      addItem('loose_brick');

      render(<InventoryPanel />);

      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();
      expect(screen.getByText('Loose Brick')).toBeInTheDocument();
    });

    it('should display item categories', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon'); // tool
      addItem('shiv'); // weapon

      render(<InventoryPanel />);

      const categories = screen.getAllByText(/tool|weapon/i);
      expect(categories.length).toBeGreaterThanOrEqual(2);
    });

    it('should display item icons', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      // Spoon emoji should be visible
      expect(screen.getByText('🥄')).toBeInTheDocument();
    });

    it('should display multiple items correctly', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');
      addItem('shiv');
      addItem('guard_uniform');
      addItem('bandages');

      render(<InventoryPanel />);

      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();
      expect(screen.getByText('Makeshift Shiv')).toBeInTheDocument();
      expect(screen.getByText('Guard Uniform')).toBeInTheDocument();
      expect(screen.getByText('Bandages')).toBeInTheDocument();
    });

    it('should handle items that do not exist gracefully', () => {
      const { addItem } = useGameStore.getState();
      addItem('valid_item_rusty_spoon');
      addItem('invalid_nonexistent_item');
      addItem('loose_brick');

      render(<InventoryPanel />);

      // Should only show valid items
      expect(screen.getByText('Loose Brick')).toBeInTheDocument();
    });
  });

  describe('Item Selection and Details', () => {
    it('should show item details when clicking an item', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      const item = screen.getByText('Rusty Spoon');
      fireEvent.click(item);

      // Details should appear
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Location Hint')).toBeInTheDocument();
    });

    it('should display item description in details', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      const item = screen.getByText('Rusty Spoon');
      fireEvent.click(item);

      const spoon = getItemById('rusty_spoon');
      expect(screen.getByText(spoon!.description)).toBeInTheDocument();
    });

    it('should display location hint in details', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      const item = screen.getByText('Rusty Spoon');
      fireEvent.click(item);

      const spoon = getItemById('rusty_spoon');
      expect(screen.getByText(spoon!.locationHint)).toBeInTheDocument();
    });

    it('should close details when clicking close button', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      // Open details
      const item = screen.getByText('Rusty Spoon');
      fireEvent.click(item);
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Close details
      const closeButton = screen.getByLabelText('Close details');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('should deselect item when clicking same item again', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      const item = screen.getByText('Rusty Spoon');

      // First click - select
      fireEvent.click(item);
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Second click - deselect
      fireEvent.click(item);
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('should switch selection when clicking different item', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');
      addItem('loose_brick');

      render(<InventoryPanel />);

      // Select first item
      const spoon = screen.getByText('Rusty Spoon');
      fireEvent.click(spoon);

      const spoonItem = getItemById('rusty_spoon');
      expect(screen.getByText(spoonItem!.description)).toBeInTheDocument();

      // Select second item
      const brick = screen.getByText('Loose Brick');
      fireEvent.click(brick);

      // First item description should be gone, second should appear
      expect(screen.queryByText(spoonItem!.description)).not.toBeInTheDocument();

      const brickItem = getItemById('loose_brick');
      expect(screen.getByText(brickItem!.description)).toBeInTheDocument();
    });
  });

  describe('Mobile Collapse Functionality', () => {
    it('should show collapse button', () => {
      render(<InventoryPanel />);

      const collapseButton = screen.getByLabelText(/collapse inventory/i);
      expect(collapseButton).toBeInTheDocument();
    });

    it('should start collapsed when defaultCollapsed is true', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel defaultCollapsed={true} />);

      // Items should not be visible when collapsed
      expect(screen.queryByText('Rusty Spoon')).not.toBeInTheDocument();
    });

    it('should expand when clicking collapse button while collapsed', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel defaultCollapsed={true} />);

      // Should be collapsed initially
      expect(screen.queryByText('Rusty Spoon')).not.toBeInTheDocument();

      // Click expand button
      const expandButton = screen.getByLabelText(/expand inventory/i);
      fireEvent.click(expandButton);

      // Should now show items
      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();
    });

    it('should collapse when clicking collapse button while expanded', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel defaultCollapsed={false} />);

      // Should be expanded initially
      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();

      // Click collapse button
      const collapseButton = screen.getByLabelText(/collapse inventory/i);
      fireEvent.click(collapseButton);

      // Should now be hidden
      expect(screen.queryByText('Rusty Spoon')).not.toBeInTheDocument();
    });

    it('should show correct icon based on collapse state', () => {
      render(<InventoryPanel defaultCollapsed={false} />);

      // Should show up arrow when expanded
      expect(screen.getByText('▲')).toBeInTheDocument();

      // Click to collapse
      const collapseButton = screen.getByLabelText(/collapse inventory/i);
      fireEvent.click(collapseButton);

      // Should show down arrow when collapsed
      expect(screen.getByText('▼')).toBeInTheDocument();
    });
  });

  describe('Dynamic Updates', () => {
    it('should update when items are added to inventory', () => {
      const { addItem } = useGameStore.getState();

      const { rerender } = render(<InventoryPanel />);

      // Initially empty
      expect(screen.getByText(/your inventory is empty/i)).toBeInTheDocument();

      // Add item
      addItem('rusty_spoon');
      rerender(<InventoryPanel />);

      // Should now show item
      expect(screen.queryByText(/your inventory is empty/i)).not.toBeInTheDocument();
      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();
    });

    it('should update when items are removed from inventory', () => {
      const { addItem, removeItem } = useGameStore.getState();
      addItem('rusty_spoon');
      addItem('loose_brick');

      const { rerender } = render(<InventoryPanel />);

      expect(screen.getByText('Rusty Spoon')).toBeInTheDocument();
      expect(screen.getByText('Loose Brick')).toBeInTheDocument();

      // Remove item
      removeItem('rusty_spoon');
      rerender(<InventoryPanel />);

      // Should no longer show removed item
      expect(screen.queryByText('Rusty Spoon')).not.toBeInTheDocument();
      expect(screen.getByText('Loose Brick')).toBeInTheDocument();
    });

    it('should update item count when inventory changes', () => {
      const { addItem, removeItem } = useGameStore.getState();

      render(<InventoryPanel />);

      expect(screen.getByText('(0)')).toBeInTheDocument();

      act(() => {
        addItem('loose_brick');
      });
      expect(screen.getByText('(1)')).toBeInTheDocument();

      act(() => {
        addItem('rusty_spoon');
      });
      expect(screen.getByText('(2)')).toBeInTheDocument();

      act(() => {
        removeItem('loose_brick');
      });
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });
  });

  describe('Styling and Categories', () => {
    it('should apply different styles for different item categories', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon'); // tool - blue
      addItem('shiv'); // weapon - red
      addItem('bandages'); // medical - green

      render(<InventoryPanel />);

      // Items should be rendered with different category labels
      expect(screen.getByText('tool')).toBeInTheDocument();
      expect(screen.getByText('weapon')).toBeInTheDocument();
      expect(screen.getByText('medical')).toBeInTheDocument();
    });

    it('should accept custom className prop', () => {
      const { container } = render(<InventoryPanel className="custom-class" />);

      const panel = container.querySelector('.custom-class');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for item buttons', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      expect(screen.getByLabelText('View details for Rusty Spoon')).toBeInTheDocument();
    });

    it('should have proper aria-label for collapse button', () => {
      render(<InventoryPanel />);

      expect(screen.getByLabelText(/collapse inventory/i)).toBeInTheDocument();
    });

    it('should have proper aria-label for close details button', () => {
      const { addItem } = useGameStore.getState();
      addItem('rusty_spoon');

      render(<InventoryPanel />);

      // Open details
      const item = screen.getByText('Rusty Spoon');
      fireEvent.click(item);

      expect(screen.getByLabelText('Close details')).toBeInTheDocument();
    });
  });
});
