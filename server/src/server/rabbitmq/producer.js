import amqplib from "amqplib";
//docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management
const exchangeName = "direct_logs";
const args = process.argv.slice(2);

export const sendMessage = async (msg,logType) => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "direct", { durable: false });
  channel.publish(exchangeName, logType,Buffer.from(msg));
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};