/**
 * Tests for EvidencePanel component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import EvidencePanel from '../EvidencePanel';
import { useGameStore } from '@/lib/store';

// Mock the evidence loader
jest.mock('@/lib/evidenceLoader', () => ({
  loadAllEvidence: jest.fn(() => [
    {
      id: 'warden_ledger',
      name: "Warden's Financial Ledger",
      description: 'Documents corruption and bribes by Warden Vásquez',
    },
    {
      id: 'guard_brutality_photos',
      name: 'Photographs of Guard Brutality',
      description: 'Evidence of systematic abuse by guards',
    },
    {
      id: 'innocence_dna_report',
      name: 'DNA Test Results',
      description: 'Proves your innocence in the crime',
    },
  ]),
  getEvidenceById: jest.fn((id: string) => {
    const evidence: any = {
      warden_ledger: {
        id: 'warden_ledger',
        name: "Warden's Financial Ledger",
        description: 'Documents corruption and bribes by Warden Vásquez',
      },
      guard_brutality_photos: {
        id: 'guard_brutality_photos',
        name: 'Photographs of Guard Brutality',
        description: 'Evidence of systematic abuse by guards',
      },
      innocence_dna_report: {
        id: 'innocence_dna_report',
        name: 'DNA Test Results',
        description: 'Proves your innocence in the crime',
      },
    };
    return evidence[id];
  }),
  getEvidenceProgress: jest.fn((collected: string[]) => ({
    collected: collected.length,
    total: 9,
    percentage: Math.round((collected.length / 9) * 100),
  })),
  hasEnoughEvidenceForJustice: jest.fn((collected: string[]) => collected.length >= 5),
  getEvidenceCategories: jest.fn((collected: string[]) => ({
    hasCorruption: collected.includes('warden_ledger'),
    hasBrutality: collected.includes('guard_brutality_photos'),
    hasInnocence: collected.includes('innocence_dna_report'),
    hasSystemic: false,
  })),
}));

describe('EvidencePanel', () => {
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.setState({
      evidence: [],
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no evidence collected', () => {
      render(<EvidencePanel />);

      expect(screen.getByText('No evidence collected yet.')).toBeInTheDocument();
      expect(screen.getByText(/Investigate to find proof of corruption/)).toBeInTheDocument();
    });

    it('should show 0/9 progress when no evidence collected', () => {
      render(<EvidencePanel />);

      expect(screen.getByText('0 / 9 collected')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should not show justice path unlocked when no evidence', () => {
      render(<EvidencePanel />);

      expect(screen.queryByText('Justice Path Unlocked!')).not.toBeInTheDocument();
    });

    it('should hide panel when hideWhenEmpty is true and no evidence', () => {
      const { container } = render(<EvidencePanel hideWhenEmpty={true} />);

      expect(container.firstChild).toBeNull();
    });

    it('should show panel when hideWhenEmpty is false and no evidence', () => {
      render(<EvidencePanel hideWhenEmpty={false} />);

      expect(screen.getByText('Evidence')).toBeInTheDocument();
    });
  });

  describe('Evidence Collection', () => {
    it('should display collected evidence', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText("Warden's Financial Ledger")).toBeInTheDocument();
    });

    it('should show correct progress with collected evidence', () => {
      useGameStore.setState({
        evidence: ['warden_ledger', 'guard_brutality_photos'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText('2 / 9 collected')).toBeInTheDocument();
      expect(screen.getByText('22%')).toBeInTheDocument();
    });

    it('should display multiple evidence pieces', () => {
      useGameStore.setState({
        evidence: ['warden_ledger', 'guard_brutality_photos', 'innocence_dna_report'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText("Warden's Financial Ledger")).toBeInTheDocument();
      expect(screen.getByText('Photographs of Guard Brutality')).toBeInTheDocument();
      expect(screen.getByText('DNA Test Results')).toBeInTheDocument();
    });

    it('should show panel when hideWhenEmpty is true and evidence exists', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel hideWhenEmpty={true} />);

      expect(screen.getByText('Evidence')).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('should calculate percentage correctly', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText('5 / 9 collected')).toBeInTheDocument();
      expect(screen.getByText('56%')).toBeInTheDocument();
    });

    it('should show progress bar with correct width', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2'],
      });

      const { container } = render(<EvidencePanel />);
      const progressBar = container.querySelector('.bg-amber-600, .bg-green-600');

      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '22%' });
    });
  });

  describe('Justice Path Indicator', () => {
    it('should not show justice unlocked with less than 5 pieces', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2', 'ev3', 'ev4'],
      });

      render(<EvidencePanel />);

      expect(screen.queryByText('Justice Path Unlocked!')).not.toBeInTheDocument();
    });

    it('should show justice unlocked with 5 or more pieces', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/Enough evidence for justice path/)).toBeInTheDocument();
    });

    it('should change progress bar color when justice unlocked', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5'],
      });

      const { container } = render(<EvidencePanel />);
      const progressBar = container.querySelector('.bg-green-600');

      expect(progressBar).toBeInTheDocument();
    });

    it('should use amber color when justice not unlocked', () => {
      useGameStore.setState({
        evidence: ['ev1', 'ev2'],
      });

      const { container } = render(<EvidencePanel />);
      const progressBar = container.querySelector('.bg-amber-600');

      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Category Badges', () => {
    it('should show corruption category when warden ledger collected', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/Corruption/)).toBeInTheDocument();
    });

    it('should show brutality category when photos collected', () => {
      useGameStore.setState({
        evidence: ['guard_brutality_photos'],
      });

      render(<EvidencePanel />);

      expect(screen.getAllByText(/Brutality/).length).toBeGreaterThan(0);
    });

    it('should show innocence category when DNA report collected', () => {
      useGameStore.setState({
        evidence: ['innocence_dna_report'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/Innocence/)).toBeInTheDocument();
    });

    it('should show multiple categories', () => {
      useGameStore.setState({
        evidence: ['warden_ledger', 'guard_brutality_photos', 'innocence_dna_report'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/Corruption/)).toBeInTheDocument();
      expect(screen.getAllByText(/Brutality/).length).toBeGreaterThan(0);
      expect(screen.getByText(/Innocence/)).toBeInTheDocument();
    });

    it('should not show category section when no evidence', () => {
      render(<EvidencePanel />);

      expect(screen.queryByText('Categories Found:')).not.toBeInTheDocument();
    });
  });

  describe('Expandable Evidence Details', () => {
    beforeEach(() => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });
    });

    it('should not show description initially', () => {
      render(<EvidencePanel />);

      expect(
        screen.queryByText('Documents corruption and bribes by Warden Vásquez')
      ).not.toBeInTheDocument();
    });

    it('should show description when clicked', () => {
      render(<EvidencePanel />);

      const evidenceCard = screen.getByText("Warden's Financial Ledger").closest('div');
      fireEvent.click(evidenceCard!);

      expect(
        screen.getByText('Documents corruption and bribes by Warden Vásquez')
      ).toBeInTheDocument();
    });

    it('should hide description when clicked again', () => {
      render(<EvidencePanel />);

      const evidenceCard = screen.getByText("Warden's Financial Ledger").closest('div');
      fireEvent.click(evidenceCard!);
      expect(
        screen.getByText('Documents corruption and bribes by Warden Vásquez')
      ).toBeInTheDocument();

      fireEvent.click(evidenceCard!);
      expect(
        screen.queryByText('Documents corruption and bribes by Warden Vásquez')
      ).not.toBeInTheDocument();
    });

    it('should only expand one evidence at a time', () => {
      useGameStore.setState({
        evidence: ['warden_ledger', 'guard_brutality_photos'],
      });

      render(<EvidencePanel />);

      const ledgerCard = screen.getByText("Warden's Financial Ledger").closest('div');
      const photoCard = screen.getByText('Photographs of Guard Brutality').closest('div');

      fireEvent.click(ledgerCard!);
      expect(
        screen.getByText('Documents corruption and bribes by Warden Vásquez')
      ).toBeInTheDocument();

      fireEvent.click(photoCard!);
      expect(
        screen.queryByText('Documents corruption and bribes by Warden Vásquez')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Evidence of systematic abuse by guards')).toBeInTheDocument();
    });
  });

  describe('Collapse Functionality', () => {
    it('should not be collapsed by default', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText("Warden's Financial Ledger")).toBeInTheDocument();
    });

    it('should start collapsed when defaultCollapsed is true', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel defaultCollapsed={true} />);

      expect(screen.queryByText("Warden's Financial Ledger")).not.toBeInTheDocument();
    });

    it('should toggle collapse when button is clicked', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel />);

      const toggleButton = screen.getByLabelText('Collapse evidence');
      fireEvent.click(toggleButton);

      expect(screen.queryByText("Warden's Financial Ledger")).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByText("Warden's Financial Ledger")).toBeInTheDocument();
    });
  });

  describe('Hint for Missing Evidence', () => {
    it('should show hint when some evidence is missing', () => {
      useGameStore.setState({
        evidence: ['warden_ledger'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/8 more pieces of evidence remain undiscovered/)).toBeInTheDocument();
    });

    it('should not show hint when no evidence collected', () => {
      render(<EvidencePanel />);

      expect(screen.queryByText(/more pieces of evidence remain/)).not.toBeInTheDocument();
    });

    it('should update hint count as evidence is collected', () => {
      useGameStore.setState({
        evidence: ['warden_ledger', 'guard_brutality_photos'],
      });

      render(<EvidencePanel />);

      expect(screen.getByText(/7 more pieces of evidence remain undiscovered/)).toBeInTheDocument();
    });
  });
});
