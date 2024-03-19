import Pusher from 'pusher'

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_PUBLIC_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET_KEY!,
  cluster: "ap2",
  useTLS: true,
});
