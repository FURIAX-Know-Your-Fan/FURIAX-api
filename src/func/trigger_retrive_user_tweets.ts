import axios from "axios";
import User from "../models/User";
import { Request, Response } from "express";
import Tweet from "../models/Tweet";

export const trigger_retrive_user_tweets = async (
  req: Request,
  res: Response
) => {
  const users = await User.find();
  if (users.length === 0) {
    res.status(404).json({ message: "No users found" });
    return;
  }

  // Usando for...of para garantir que as promessas sejam aguardadas corretamente
  for (const user of users) {
    try {
      // Enviando requisição para obter tweets
      const tweets = await axios.post(
        `http://furiax-xmodule:8000/tweets/`,
        {
          screen_name: user.twitter_account,
          local_id: user._id, // Certifique-se de que 'user._id' está correto
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Processamento de dados de tweets (se necessário)
      if (tweets.data) {
        console.log(`Tweets for user ${user.twitter_account} retrieved`);
        // Você pode salvar ou processar os tweets conforme necessário
      }
    } catch (error: any) {
      console.error(
        `Error fetching tweets for user ${user.twitter_account}: ${error.message}`
      );
      // Envie uma resposta de erro para o cliente se necessário
    }
  }

  // Resposta ao final do processamento
  res.status(200).json({ message: "Tweets retrieval process completed" });
};
