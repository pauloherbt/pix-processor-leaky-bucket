export const createUser = async (_, args) => {
    const { name, email, password } = args.input;

    const encryptedPassword = `encrypted-${password}`;
}