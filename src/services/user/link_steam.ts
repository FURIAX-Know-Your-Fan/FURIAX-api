import { Request, Response } from "express";
import User from "../../models/User";
import axios from "axios";
import { STEAM_API_KEY } from "../../utils/constants";

export const link_steam = async (req: Request, res: Response) => {
  const { steam_account, user_id } = req.body;
  if (!user_id) {
    res.status(400).json({
      message: "Campos obrigatórios não preenchidos (Servidor)",
    });
    return;
  }

  if (!steam_account) {
    res.status(400).json({
      message: "Digite a sua conta steam",
    });
    return;
  }

  const user = await User.findById(user_id);
  if (!user) {
    res.status(404).json({
      message: "Usuário não encontrado",
    });
    return;
  }
  try {
    const steam_account_request = await axios.get(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${steam_account}`
    );
    if (user.steam_account) {
      user.steam_account.vanity_url = steam_account;
    }
    if (user.steam_account) {
      user.steam_account.steam_id = steam_account_request.data.response.steamid;
    }
    await user.save();
    res.status(200).json({
      message: "Conta steam vinculada com sucesso",
      steam_account: {
        vanity_url: steam_account,
        steam_id: steam_account_request.data.response.steamid,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.response.data.error,
    });
  }
};
