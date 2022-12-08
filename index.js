const {
  Telegraf,
  Markup,
  Extra
} = require('telegraf');
const {
  message
} = require('telegraf/filters');
const {
  Keyboard
} = require('telegram-keyboard')
const Anibatch = require("./Api/anibatch")
const anibatch = new Anibatch()
//const lk21 = new Lk21()

//const bot = new Telegraf(process.env.BOT_TOKEN)
const bot = new Telegraf("5824625543:AAEslB26tupftKCDQTs0OULDa1uYWxv6XfM")

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}






// const keyboard = Markup.inlineKeyboard([
//   Markup.button.url('❤️', 'http://telegraf.js.org'),
//   Markup.button.callback('Delete', 'delete')
// ])
// bot.start((ctx) => ctx.replyWithDice())
// bot.settings(async (ctx) => {
//   await ctx.setMyCommands([{
//     command: '/help',
//     description: 'for help'
//   },
//     {
//       command: '/lk21',
//       description: 'untuk mencari film'
//     },
//     {
//       command: '/anime',
//       description: 'untuk mencari anime'
//     }])
//   return ctx.reply('Ok')
// })
// bot.help(async (ctx) => {
//   const commands = await ctx.getMyCommands()
//   const info = commands.reduce((acc, val) => `${acc}/${val.command} - ${val.description}\n`, '')
//   return ctx.reply(info)
// })
// bot.action('delete', ({
//   deleteMessage
// }) => deleteMessage())
// bot.on('dice', (ctx) => ctx.reply(`Value: ${ctx.message.dice.value}`))
// bot.on('message', (ctx) => ctx.copyMessage(ctx.chat.id, Markup.keyboard(keyboard)))





bot.hears(/anime/ig, async (ctx) => {
  const input = ctx.match.input.split(' ')
  const param = input[1]

  if (!param) {
    ctx.reply('anda belum memasukan parameter ! \n baca petunjuk /help')
  } else {
    let tes = await anibatch.search(param)
    if (!tes) {
      ctx.reply('Maaf anime yang anda cari tidak ditemukan!')
    } else {
      const data = tes.results
      data.forEach(function (v, i) {
        console.log(v.id)
        ctx.replyWithPhoto({
          url: v.size_thumb[1]
        },
          {
            caption: v.title,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
              Markup.button.callback('download', 'show-anibatch-' + v.id)
              //Markup.button.callback('Italic', 'italic')
            ])
          }
        )
      })
    }
  }
  //ctx.reply(ctx.match[1].split('').reverse().join(''))
})


bot.action(/(^show[-]anibatch[-])+(.*)/gm, async (ctx) => {
  ctx.reply('klicked')
  const id = ctx.match[2]
  let data = await anibatch.show(id)
    // Using context shortcut
    ctx.answerCbQuery()
console.log(id)
  if (!data)  {
    console.log(data)
    ctx.reply('maaf data tidak ditemukan')
  } else {
    console.log(data)
  }

})





bot.hears(/reverse (.+)/, (ctx) =>
  ctx.reply(ctx.match[1].split('').reverse().join(''))
)







bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));



bot.hears(/lk21/ig, async (ctx) => {
  const query = ctx.match[1]
  console.log(query)
  ctx.reply('hello')

  /*
  asyncForEach(data, async (num, i, v) => {
    //ctx.telegram.sendMessage(ctx.message.chat.id, `Command ${ctx.state.role}`);
    const keyboard = Keyboard.make([
      ['Download'], // First row
      // Second row
    ])
    console.log()
    */
  // ctx.telegram.sendMessage(ctx.message.chat.id, v.title);

  /*
    ctx.replyWithPhoto({
      url: v.thumb
    }, {
      caption: 'Your caption'
    })
    ctx.reply(v.title, keyboard.inline())
    //await waitFor(50);
    //console.log(num);
    */





  /*
  data.forEach(function(v, i) {
    //console.log(v)
    const keyboard = Keyboard.make([
      ['Download'], // First row
      // Second row
    ])
    // ctx.telegram.sendMessage(ctx.message.chat.id, v.title);
    ctx.replyWithPhoto({
      url: v.thumb
    }, {
      caption: 'Your caption'
    })
    ctx.reply(v.title, keyboard.inline())
  })
*/
  // Using context shortcut
  //await ctx.leaveChat();
});

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Command ${ctx.state.role}`);

  // Using context shortcut
  //await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on('inline_query', async (ctx) => {
  const result = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));