export const generatePix = async (parent, args, context) => {
  console.log(context);

  return {
    success: true,
    message: 'Pix key generated successfully',
    remainingTokens: 42,
  };
};
