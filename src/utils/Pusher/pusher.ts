import Pusher from "pusher-js";

const pusherClient = new Pusher(
    process.env.REACT_APP_PUSHER_KEY!, 
    {
        cluster: `ap2`,
    }
);

export default pusherClient;