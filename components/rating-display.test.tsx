import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RatingDisplay } from './rating-display';

describe('RatingDisplay', () => {
  it('renders rating and review count when count display is enabled', () => {
    render(<RatingDisplay rating={4.6} reviewCount={18} />);

    expect(screen.getByText('4.6')).toBeInTheDocument();
    expect(screen.getByText('(18)')).toBeInTheDocument();
  });

  it('clamps ratings to the supported range', () => {
    render(<RatingDisplay rating={8} reviewCount={1} />);

    expect(screen.getByText('5.0')).toBeInTheDocument();
  });
});
