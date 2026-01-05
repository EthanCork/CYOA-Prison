/**
 * Tests for RelationshipPanel component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import RelationshipPanel from '../RelationshipPanel';
import { useGameStore } from '@/lib/store';

// Mock the character loader
jest.mock('@/lib/characterLoader', () => ({
  loadAllCharacters: jest.fn(() => [
    {
      id: 'bastian',
      name: 'Bastian',
      initialRelationship: 30,
      description: 'A fellow inmate who knows the prison well',
      role: 'Veteran Inmate',
      category: 'ally',
      location: 'Cell Block A',
      traits: ['Resourceful', 'Cautious', 'Loyal'],
      background: 'Survived by staying neutral',
      relationshipThresholds: {
        trusted: 50,
        friend: 70,
        devotedAlly: 90,
      },
      unlocks: {
        '50': 'Bastian shares prison secrets',
        '70': 'Bastian introduces you to contacts',
        '90': 'Bastian commits to helping escape',
      },
    },
    {
      id: 'viktor',
      name: 'Viktor',
      initialRelationship: -20,
      description: 'A gang lieutenant',
      role: 'Gang Lieutenant',
      category: 'antagonist',
      location: 'Cell Block C',
      traits: ['Aggressive', 'Territorial'],
      background: 'Runs protection rackets',
      relationshipThresholds: {
        neutral: 0,
        respectful: 40,
      },
      unlocks: {
        '0': 'Viktor stops harassing you',
        '40': 'Viktor offers protection',
      },
    },
    {
      id: 'marcel',
      name: 'Marcel',
      initialRelationship: 0,
      description: 'A quiet loner',
      role: 'Loner',
      category: 'neutral',
      location: 'Cell Block B',
      traits: ['Reserved', 'Observant'],
      background: 'Nobody knows much about him',
      relationshipThresholds: {
        acquaintance: 20,
        trusted: 60,
      },
      unlocks: {
        '20': 'Marcel starts acknowledging you',
        '60': 'Marcel reveals secrets',
      },
    },
  ]),
  getNextUnlock: jest.fn((characterId: string, score: number) => {
    if (characterId === 'bastian' && score < 50) {
      return { threshold: 50, description: 'Bastian shares prison secrets' };
    }
    if (characterId === 'bastian' && score < 70) {
      return { threshold: 70, description: 'Bastian introduces you to contacts' };
    }
    return null;
  }),
  getUnlockedContent: jest.fn((characterId: string, score: number) => {
    if (characterId === 'bastian' && score >= 50) {
      return ['Bastian shares prison secrets'];
    }
    return [];
  }),
}));

describe('RelationshipPanel', () => {
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.setState({
      relationships: {},
      discoveredCharacters: [],
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no characters are discovered', () => {
      render(<RelationshipPanel />);

      expect(screen.getByText('No characters discovered yet.')).toBeInTheDocument();
      expect(screen.getByText('Meet NPCs to track relationships.')).toBeInTheDocument();
    });

    it('should show character count as 0 when none discovered', () => {
      render(<RelationshipPanel />);

      expect(screen.getByText('0 characters discovered')).toBeInTheDocument();
    });
  });

  describe('Character Discovery', () => {
    it('should show discovered characters', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Bastian')).toBeInTheDocument();
      expect(screen.getByText('Veteran Inmate')).toBeInTheDocument();
    });

    it('should show correct character count', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian', 'viktor'],
        relationships: { bastian: 30, viktor: -20 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('2 characters discovered')).toBeInTheDocument();
    });

    it('should only show discovered characters by default', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Bastian')).toBeInTheDocument();
      expect(screen.queryByText('Viktor')).not.toBeInTheDocument();
      expect(screen.queryByText('Marcel')).not.toBeInTheDocument();
    });

    it('should show all characters in debug mode', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel showUndiscovered={true} />);

      expect(screen.getByText('Bastian')).toBeInTheDocument();
      expect(screen.getByText('Viktor')).toBeInTheDocument();
      expect(screen.getByText('Marcel')).toBeInTheDocument();
    });
  });

  describe('Relationship Scores', () => {
    it('should display relationship score', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should display negative scores', () => {
      useGameStore.setState({
        discoveredCharacters: ['viktor'],
        relationships: { viktor: -20 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('-20')).toBeInTheDocument();
    });

    it('should show 0 for undiscovered relationships', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: {},
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Character Categories', () => {
    it('should group allies together', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Allies')).toBeInTheDocument();
    });

    it('should group antagonists together', () => {
      useGameStore.setState({
        discoveredCharacters: ['viktor'],
        relationships: { viktor: -20 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Antagonists')).toBeInTheDocument();
    });

    it('should group neutral characters together', () => {
      useGameStore.setState({
        discoveredCharacters: ['marcel'],
        relationships: { marcel: 0 },
      });

      render(<RelationshipPanel />);

      // There will be multiple "Neutral" text (category heading and relationship status)
      expect(screen.getAllByText('Neutral').length).toBeGreaterThan(0);
    });

    it('should show category counts', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian', 'viktor'],
        relationships: { bastian: 30, viktor: -20 },
      });

      render(<RelationshipPanel />);

      expect(screen.getAllByText(/\(1\)/).length).toBeGreaterThan(0);
    });
  });

  describe('Expandable Details', () => {
    beforeEach(() => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });
    });

    it('should not show details initially', () => {
      render(<RelationshipPanel />);

      expect(screen.queryByText('About:')).not.toBeInTheDocument();
      expect(screen.queryByText('A fellow inmate who knows the prison well')).not.toBeInTheDocument();
    });

    it('should show details when clicked', () => {
      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      expect(screen.getByText('About:')).toBeInTheDocument();
      expect(screen.getByText('A fellow inmate who knows the prison well')).toBeInTheDocument();
    });

    it('should show location when expanded', () => {
      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      expect(screen.getByText('Location:')).toBeInTheDocument();
      expect(screen.getByText('Cell Block A')).toBeInTheDocument();
    });

    it('should show traits when expanded', () => {
      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      expect(screen.getByText('Traits:')).toBeInTheDocument();
      expect(screen.getByText('Resourceful')).toBeInTheDocument();
      expect(screen.getByText('Cautious')).toBeInTheDocument();
      expect(screen.getByText('Loyal')).toBeInTheDocument();
    });

    it('should hide details when clicked again', () => {
      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);
      expect(screen.getByText('About:')).toBeInTheDocument();

      fireEvent.click(characterCard!);
      expect(screen.queryByText('About:')).not.toBeInTheDocument();
    });
  });

  describe('Unlock System', () => {
    it('should show next unlock preview', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText(/Next at 50:/)).toBeInTheDocument();
      expect(screen.getByText(/Bastian shares prison secrets/)).toBeInTheDocument();
    });

    it('should show unlocked content when expanded', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 60 },
      });

      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      expect(screen.getByText('Unlocked:')).toBeInTheDocument();
      expect(screen.getByText('Bastian shares prison secrets')).toBeInTheDocument();
    });

    it('should show relationship milestones when expanded', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 60 },
      });

      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      expect(screen.getByText('Relationship Milestones:')).toBeInTheDocument();
      expect(screen.getAllByText(/trusted/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/friend/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/devotedAlly/).length).toBeGreaterThan(0);
    });

    it('should mark reached thresholds', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 60 },
      });

      render(<RelationshipPanel />);

      const characterCard = screen.getByText('Bastian').closest('div');
      fireEvent.click(characterCard!);

      const milestonesSection = screen.getByText('Relationship Milestones:').parentElement;
      expect(milestonesSection).toBeInTheDocument();

      // Check that checkmarks and circles are present
      const content = milestonesSection?.textContent || '';
      expect(content).toContain('✓');
      expect(content).toContain('○');
      expect(content).toContain('trusted');
      expect(content).toContain('friend');
      expect(content).toContain('devotedAlly');
    });
  });

  describe('Collapse Functionality', () => {
    it('should not be collapsed by default', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Bastian')).toBeInTheDocument();
    });

    it('should start collapsed when defaultCollapsed is true', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel defaultCollapsed={true} />);

      expect(screen.queryByText('Bastian')).not.toBeInTheDocument();
    });

    it('should toggle collapse when button is clicked', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian'],
        relationships: { bastian: 30 },
      });

      render(<RelationshipPanel />);

      const toggleButton = screen.getByLabelText('Collapse relationships');
      fireEvent.click(toggleButton);

      expect(screen.queryByText('Bastian')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByText('Bastian')).toBeInTheDocument();
    });
  });

  describe('Multiple Characters', () => {
    it('should display multiple characters from different categories', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian', 'viktor', 'marcel'],
        relationships: { bastian: 30, viktor: -20, marcel: 0 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('Bastian')).toBeInTheDocument();
      expect(screen.getByText('Viktor')).toBeInTheDocument();
      expect(screen.getByText('Marcel')).toBeInTheDocument();
    });

    it('should show correct count with multiple characters', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian', 'viktor', 'marcel'],
        relationships: { bastian: 30, viktor: -20, marcel: 0 },
      });

      render(<RelationshipPanel />);

      expect(screen.getByText('3 characters discovered')).toBeInTheDocument();
    });

    it('should only expand one character at a time', () => {
      useGameStore.setState({
        discoveredCharacters: ['bastian', 'viktor'],
        relationships: { bastian: 30, viktor: -20 },
      });

      render(<RelationshipPanel />);

      const bastianCard = screen.getByText('Bastian').closest('div');
      const viktorCard = screen.getByText('Viktor').closest('div');

      fireEvent.click(bastianCard!);
      expect(screen.getAllByText('About:').length).toBe(1);

      fireEvent.click(viktorCard!);
      expect(screen.getAllByText('About:').length).toBe(1);
      expect(screen.getByText('A gang lieutenant')).toBeInTheDocument();
    });
  });
});
