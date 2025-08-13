import amqplib from "amqplib";
import fs from "fs";
import { DateTime } from "luxon";
import { sendMessage } from "src/server/rabbitmq/producer.js";

const args = process.argv.slice(2);// select message  type to listen to
const infoFile = 'server\\rabbitmq\\info.logs.txt'
const errorFile = 'server\\rabbitmq\\error.logs.txt'

const exchangeName = "direct_logs";

const receiveMessage = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "direct", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  args.forEach(function(severity) {
    channel.bindQueue(q.queue,exchangeName,severity);// severity is actually the routing key
    //for each type of the message on of(error,info ,warning) queue is binded with the routing key 
  })
  channel.consume(q.queue,msg => {
        let content = ""
        let currentTime = DateTime.now().toLocaleString(DateTime.DATETIME_MED)
        if(msg.content)content = `Routing key :${msg.fields.routingKey}, Message: ${msg.content.toString()}\n`;
        if(msg.fields.routingKey === "info"){
            content = `[INFO] ${currentTime} ${content}`
              fs.appendFile(infoFile,content,err => {
                if(err){
                  sendMessage(`[ERROR] ${currentTime} ${err}\n`,"error")
                }
              })
        }
        if(msg.fields.routingKey === "error"){
          content = `[ERROR] ${currentTime} ${content}`
          fs.appendFile(errorFile,content,err => {
            if(err){
              sendMessage(`[ERROR] ${currentTime} ${err}\n`,"error")
            }
          })
        }
  },{noAck: true})//do you want to aknowledge that you got the message ? if yes set noAck to true(it will delete the message from queue ) ,otherwise fale
};

receiveMessage();
