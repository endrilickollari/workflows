import { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
    
    console.log('BetterAuth handler received request:', {
      method: context.request.method,
      url: context.request.url,
      path: new URL(context.request.url).pathname
    });
    
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
      console.log('Processing auth request...');
      try {
        return auth.handler(context.request);
      } catch (error) {
        console.error('Error in auth handler:', error);
        throw error;
      }
    }
    else {
      context.error(405);
    }
};

export default betterAuthView;
