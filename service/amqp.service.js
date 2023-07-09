const amqp = require("amqplib");

module.exports = class AmqpService {
    connection = null
    channelWrapper = null
    channel = null

    async connect() {
        this.connection = await amqp.connect("amqp://localhost:5672")
        const channel = await this.connection.createChannel();
        await channel.assertExchange("assesment", 'direct', { durable: false });
        this.connection.on('error', err => {
          console.log('Connection error', err)
       })
       
       return this.connection
     }

     async getChannel() {
        if (!this.connection) {
         await this.connect()
        }
        if (!this.channelWrapper) {
          this.createChannelWrapper()
        }
        return this.channelWrapper
      }

      createChannelWrapper() {
        this.channelWrapper = this.connection.createChannel({
          setup: async (channel) => {
            await channel.bindQueue(routeKey, "assesment", routeKey)
            console.log('Creating channel exchange and sessions')
            await channel.assertExchange("assesment", 'direct', {durable: false})
            this.channel = channel
          },
        })
        return this.channelWrapper
      }
    
      publish(routeKey, data, options) {
        this.getChannel().then(channelWrapper => {
          console.log('Publish Queue message %s %O', routeKey, JSON.stringify(data))
          channelWrapper.sendToQueue(routeKey, Buffer.from(JSON.stringify(data)))
        })
      }

      consumeQueue(routeKey, handle) {
        this.getChannel().then(channelWrapper => {
          // console.log(await channelWrapper.consume())
          channelWrapper.consume(routeKey, msg => {
            handle(msg)
            channelWrapper.ack(msg)
          })
        })
      }

}

