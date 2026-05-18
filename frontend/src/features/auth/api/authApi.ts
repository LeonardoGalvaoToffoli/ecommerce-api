import { http } from '@/shared/api/http';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  UsuarioPerfilDTO,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
} from '@/shared/api/types';

export async function login(payload: LoginRequestDTO) {
  const { data } = await http.post<LoginResponseDTO>('/auth/login', payload);
  return data;
}

export async function registerUser(payload: UsuarioRequestDTO) {
  const { data } = await http.post<UsuarioResponseDTO>('/usuarios', payload);
  return data;
}

export async function registerAdmin(payload: UsuarioRequestDTO) {
  const { data } = await http.post<UsuarioResponseDTO>('/usuarios/admin', payload);
  return data;
}

export async function getPerfil() {
  const { data } = await http.get<UsuarioPerfilDTO>('/usuarios/perfil');
  return data;
}
