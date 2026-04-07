import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StockBadge } from './stock-badge';

describe('StockBadge', () => {
  it('renders in-stock state without exposing the exact quantity by default', () => {
    render(<StockBadge quantity={42} />);

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.queryByText('42 in stock')).not.toBeInTheDocument();
  });

  it('renders low stock and out-of-stock messaging', () => {
    const { rerender } = render(<StockBadge quantity={3} showQuantity />);

    expect(screen.getByText('Only 3 left')).toBeInTheDocument();

    rerender(<StockBadge quantity={0} showQuantity />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
