export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CampoErro {
  campo: string;
  mensagem: string;
}

export interface ErroResposta {
  status?: number;
  mensagem: string;
  campos?: CampoErro[];
}

export interface ProdutoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  precoBase: number;
  imagemUrl?: string | null;
  ativo: boolean;
  destaque: boolean;
}

export interface VariacaoDTO {
  id: number;
  tamanho: string;
  cor: string;
  quantidadeEstoque: number;
}

export interface ProdutoDetalheDTO extends ProdutoResponseDTO {
  variacoes: VariacaoDTO[];
}

export interface ProdutoRequestDTO {
  nome: string;
  descricao: string;
  precoBase: number;
  imagemUrl?: string;
  tamanho: string;
  cor: string;
  estoqueInicial: number;
}

export interface ProdutoAtualizacaoDTO {
  nome: string;
  descricao: string;
  precoBase: number;
  imagemUrl?: string;
  ativo: boolean;
  destaque: boolean;
}

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  token: string;
}

export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

export interface UsuarioPerfilDTO {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface UsuarioResponseDTO extends UsuarioPerfilDTO {
  role: string;
  ativo: boolean;
  dataCadastro: string;
}

export interface EnderecoRequestDTO {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface EnderecoResponseDTO extends EnderecoRequestDTO {
  id: number;
}

export interface ItemCompraDTO {
  variacaoId: number;
  quantidade: number;
}

export interface CheckoutRequestDTO {
  usuarioId: number;
  endereco: EnderecoRequestDTO;
  itens: ItemCompraDTO[];
}

export interface CheckoutResponseDTO {
  pedidoId: number;
  valorTotal: number;
  statusPedido: string;
  codigoPixCopiaECola: string;
}

export interface ItemPedidoDTO {
  produtoId: number;
  nomeProduto: string;
  tamanho: string;
  cor: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PedidoHistoricoDTO {
  pedidoId: number;
  valorTotal: number;
  statusPedido: string;
}

export interface PedidoDetalheDTO extends PedidoHistoricoDTO {
  enderecoEntrega: string;
  itens: ItemPedidoDTO[];
}
