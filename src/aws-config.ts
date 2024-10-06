
export const getConfig = async () => {
   return {
    UserPoolId: import.meta.env.VITE_APP_USER_POOL_ID || '',
    ClientId: import.meta.env.VITE_APP_CLIENT_ID || ''
   }
};

