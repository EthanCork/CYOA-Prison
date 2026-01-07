/**
 * Tests for ConfirmDialog component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    title: 'Test Dialog',
    message: 'Test message',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    isOpen: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('should render default button text', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render custom button text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button clicked', () => {
    const onConfirm = jest.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should apply danger styling by default', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('should apply warning styling', () => {
    render(<ConfirmDialog {...defaultProps} confirmType="warning" />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-yellow-600');
  });

  it('should apply info styling', () => {
    render(<ConfirmDialog {...defaultProps} confirmType="info" />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-blue-600');
  });

  it('should render with backdrop', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} />);
    const backdrop = container.querySelector('.bg-black.bg-opacity-50');
    expect(backdrop).toBeInTheDocument();
  });

  it('should render dialog with proper structure', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} />);

    // Check for dialog container
    const dialog = container.querySelector('.bg-gray-800');
    expect(dialog).toBeInTheDocument();

    // Check for title
    const title = container.querySelector('h2');
    expect(title).toHaveTextContent('Test Dialog');

    // Check for message
    const message = container.querySelector('p');
    expect(message).toHaveTextContent('Test message');
  });

  it('should handle multiple button clicks', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    // Click confirm multiple times
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(onConfirm).toHaveBeenCalledTimes(2);

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should support long messages', () => {
    const longMessage = 'This is a very long message that should still render correctly in the dialog. '.repeat(10);
    const { container } = render(<ConfirmDialog {...defaultProps} message={longMessage} />);
    const message = container.querySelector('p');
    expect(message).toHaveTextContent('This is a very long message');
  });

  it('should support long titles', () => {
    const longTitle = 'This Is A Very Long Title That Should Still Render Correctly';
    render(<ConfirmDialog {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
