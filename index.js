require('dotenv').config()
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
const Lk21 = require("./Api/lk21")

const anibatch = new Anibatch()
const lk21 = new Lk21()
//const lk21 = new Lk21()

//const bot = new Telegraf(process.env.BOT_TOKEN)
const bot = new Telegraf(process.env.TOKEN)

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
  if (!data) {
    console.log(data)
    ctx.reply('maaf data tidak ditemukan')
  } else {
    console.log(data)
  }

})











bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));



bot.hears(/lk21/ig, async (ctx) => {

  if (ctx.match.input.match(/(?<=\/lk21.).*/gm) == null) {
    ctx.reply('anda belum memasukan parameter ! \n baca petunjuk /help')
  } else {
    const param = ctx.match.input.match(/(?<=\/lk21.).*/gm)[0]

    let data = await lk21.search(param)
    const list = data.results.data
    if (data == null) {
      ctx.reply('maaf data tidak ditemukan')
    } else
    {
      await list.reduce((accumulatorPromise, data, i) => {
        return accumulatorPromise.then(() => {
          return new Promise((resolve, reject) => {
            //console.log(data['title'])
            //let send = ctx.reply("oke")
            ctx.replyWithChatAction('typing')
            let send = ctx.replyWithPhoto({
              url: data.img
            },
              {
                caption: data.title,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                  Markup.button.callback('download', 'show-lk21-' + data.id)

                ])
              }
            )
            resolve(send)
          });
        });
      }, Promise.resolve());
    }
  }

});


bot.action(/(^show[-]lk21[-])+(.*)/gm, async (ctx) => {

  const id = ctx.match[2]
  let data = await lk21.show(id)
  // Using context shortcut
  //ctx.answerCbQuery()
  //console.log(id)
  if (!data) {
    //console.log(data)
    ctx.reply('maaf data tidak ditemukan')
  } else {

    const button = []

    for (let key in data.results) {
      button.push(Markup.button.url(data['results'][key]['item'], data['results'][key]['link']))
    }

    /*
    ctx.reply(
      'choose server to download',
      Markup.inlineKeyboard(button)
    )
    */

    await ctx.editMessageCaption(
      "choose server to download",
      Markup.inlineKeyboard(button)
    );


  }

})

bot.command("random", ctx => {
  return ctx.reply(
    "random example",
    Markup.inlineKeyboard([
      Markup.button.callback("Coke", "Coke"),
      Markup.button.callback("Dr Pepper", "Dr Pepper", Math.random() > 0.5),
      Markup.button.callback("Pepsi", "Pepsi"),
    ]),
  );
});

bot.command('pyramid', (ctx) => {
  return ctx.reply(
    "Keyboard wrap",
    Markup.inlineKeyboard(["one", "two", "three", "four", "five", "six"], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
    }),
  );
})

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id,
    `Command ${ctx.state.role}`);

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
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id,
    result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch({
  webhook: {
    domain: process.env.WEBHOOKS_DOMAIN,
    port: 80
  }
});


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));