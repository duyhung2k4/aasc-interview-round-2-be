import { pgConnect, redisConnect } from "./connect";

const init = async () => {
    try {
        await pgConnect();
        await redisConnect();
    } catch (error) {
        console.log(error);
    }
}

export default init;