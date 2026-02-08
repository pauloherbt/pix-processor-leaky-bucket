import { MutationResolvers } from '../generated/types';

export const generatePix: MutationResolvers['generatePix'] = async (_, __, context) => {
  if (!context.userId) {
    throw new Error('Unauthorized');
  }
  return {
    success: false, // Simula sucesso ou falha aleatoriamente
    message: 'Pix key generated successfully',
  };
};
