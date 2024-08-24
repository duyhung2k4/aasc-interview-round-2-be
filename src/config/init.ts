import { pgConnect } from "./connect";

const init = async () => {
    try {
        await pgConnect();
    } catch (error) {
        console.log(error);
    }
}

export default init;