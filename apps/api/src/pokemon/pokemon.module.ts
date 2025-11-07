import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PokemonService],
})
export class PokemonModule {}
