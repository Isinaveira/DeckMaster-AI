
//Define la forma de una pieza de juego genérica
export interface GamePieceData {
    name: string;
    types: string[];
    imageUrl?: string;
    cost?: number;
    stats?: Record<string, number>;
}


export interface IGameAnalyzer {
    gameKey: string;
    fetchPieceData(pieceName: string): Promise<GamePieceData>;
    getGameRules(): string;
    compressDataForAI(pieces: GamePieceData[]): string; //JSON to TOON
}