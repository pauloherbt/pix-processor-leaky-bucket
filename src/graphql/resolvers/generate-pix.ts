import { MutationResolvers } from '../generated/types';

export const generatePix: MutationResolvers['generatePix'] = async (parent, args, context) => {
  console.log(context);

  return {
    success: false, // Simula sucesso ou falha aleatoriamente
    message: 'Pix key generated successfully',
    remainingTokens: 9, // Exemplo de tokens restantes
  };
};
