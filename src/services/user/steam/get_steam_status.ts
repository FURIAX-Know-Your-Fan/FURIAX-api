import axios from "axios";
import { Request, Response } from "express";
import { STEAM_API_KEY } from "../../../utils/constants";

export const get_steam_stats = async (req: Request, res: Response) => {
  const { steam_id } = req.params;
  if (!steam_id) {
    res
      .status(400)
      .json({ error: "Campos obrigatórios não fornecidos (Servidor)" });
    return;
  }

  try {
    const response: any = await axios.get(
      ` http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steam_id}`
    );

    const response_game_data: any = await axios.get(`
        http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steam_id}&format=json&include_appinfo=true`);

    const sortedGames = response_game_data.data.response.games.sort(
      (a: any, b: any) => b.playtime_forever - a.playtime_forever
    );
    const top12Games = sortedGames.slice(0, 12);
    res.status(200).json({
      player: response.data.response.players[0],
      games: top12Games,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
