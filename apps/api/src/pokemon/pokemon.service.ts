import { Injectable } from '@nestjs/common';
import { IGameAnalyzer, GamePieceData } from '@deckmaster/types';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map} from 'rxjs';

interface PokeApiResponse {
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

@Injectable()
export class PokemonService implements IGameAnalyzer {
  gameKey: string = 'pokemon';
  private readonly pokeApiBaseUrl = 'https://pokeapi.co/api/v2';
  //--- Inyección de Dependencias ---
  // NestJS inyectará el 'HttpService' que importamos en el módulo
  // en esta variable 'httpService'

  constructor(private readonly httpService: HttpService) {}

  // --- Implementación del Contrato IGameAnalyzer ---
  async fetchPieceData(pieceName: string): Promise<GamePieceData> {
    const cleanName = pieceName.toLowerCase().trim();
    try {
      // El 'HttpService' de Nest devuelve un 'Observable' de RxJS.
      // 'firstValueFrom' lo convierte en una Promesa (para async/await)
      const observable = this.httpService.get<PokeApiResponse>(
        `${this.pokeApiBaseUrl}/pokemon/${cleanName}`,
      );
      // 'data' es la respuesta completa de la API
      const { data } = await firstValueFrom(observable);
      //Transformamos la repsuesta de la API a nuestro formato 'GamePieceData'
      return this.transformPokeApiData(data);
    } catch (error) {
      console.error(`Error al buscar ${pieceName}:`, error.message);
      throw new Error(`No se pudo encontrar el Pokémon: ${pieceName}`);
    }
  }

  getGameRules(): string {
    return 'Reglas falsas por ahora';
  }

  compressDataForAI(pieces: GamePieceData[]): string {
    return pieces
      .map(
        (p) =>
          `- ${p.name} (Tipos: ${p.types.join('/')}. 
            Stats: 
                ${p.stats[0].base_stat} hp /
                ${p.stats[1].base_stat} attack /
                ${p.stats[2].base_stat} defense / 
                ${p.stats[3].base_stat} special-attack / 
                ${p.stats[4].base_stat} Atk / 
                ${p.stats[5].base_stat} PS )`,
      )
      .join('\n');
  }
}
