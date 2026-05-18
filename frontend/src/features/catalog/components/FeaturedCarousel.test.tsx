import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { ProdutoResponseDTO } from '@/shared/api/types';

import { FeaturedCarousel } from './FeaturedCarousel';

const produtos: ProdutoResponseDTO[] = [
  {
    id: 1,
    nome: 'Camisa Alfa',
    descricao: 'descricao',
    precoBase: 89.9,
    imagemUrl: 'https://cdn.exemplo.com/alfa.jpg',
    ativo: true,
    destaque: true,
  },
  {
    id: 2,
    nome: 'Camisa Beta',
    descricao: 'descricao',
    precoBase: 119.9,
    imagemUrl: 'https://cdn.exemplo.com/beta.jpg',
    ativo: true,
    destaque: true,
  },
];

function renderCarousel(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('FeaturedCarousel', () => {
  it('mostra fallback quando lista esta vazia', () => {
    renderCarousel(<FeaturedCarousel produtos={[]} />);
    expect(screen.getByText(/colecao essenciais/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /proxima camisa/i })).not.toBeInTheDocument();
  });

  it('renderiza o primeiro destaque', () => {
    renderCarousel(<FeaturedCarousel produtos={produtos} />);
    expect(screen.getByText('Camisa Alfa')).toBeInTheDocument();
  });

  it('avanca para o proximo ao clicar em "proxima"', async () => {
    const user = userEvent.setup();
    renderCarousel(<FeaturedCarousel produtos={produtos} />);

    await user.click(screen.getByRole('button', { name: /proxima camisa/i }));
    expect(screen.getByText('Camisa Beta')).toBeInTheDocument();
  });

  it('volta para o anterior ao clicar em "anterior"', async () => {
    const user = userEvent.setup();
    renderCarousel(<FeaturedCarousel produtos={produtos} />);

    await user.click(screen.getByRole('button', { name: /proxima camisa/i }));
    await user.click(screen.getByRole('button', { name: /camisa anterior/i }));
    expect(screen.getByText('Camisa Alfa')).toBeInTheDocument();
  });

  it('nao mostra setas quando ha só um destaque', () => {
    renderCarousel(<FeaturedCarousel produtos={[produtos[0]]} />);
    expect(screen.queryByRole('button', { name: /proxima camisa/i })).not.toBeInTheDocument();
  });
});
