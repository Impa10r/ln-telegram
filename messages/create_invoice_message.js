const {InlineKeyboard} = require('grammy');
const {parsePaymentRequest} = require('ln-service');

const {callbackCommands} = require('./../interface');
const {labels} = require('./../interface');

const {cancelInvoice} = callbackCommands;
const {invoiceMessageCancelButtonLabel} = labels;
const {invoiceMessageDescriptionButtonLabel} = labels;
const {invoiceMessageNodeButtonLabel} = labels;
const {invoiceMessageSetTokensButtonLabel} = labels;
const join = arr => arr.filter(n => !!n).join('\n');
const mode = 'Markdown';
const {setInvoiceDescription} = callbackCommands;
const {setInvoiceNode} = callbackCommands;
const {setInvoiceTokens} = callbackCommands;
const tokensAsBigTokens = tokens => (tokens / 1e8).toFixed(8);

/** Create an invoice message

  {
    [from]: <Invoice From Node String>
    request: <BOLT 11 Payment Request String>
  }

  @returns
  {
    markup: <Reply Markup Object>
    mode: <Message Parse Mode String>
    text: <Message Text String>
  }
*/
module.exports = ({from, request}) => {
  const markup = new InlineKeyboard();

  const {description, tokens} = parsePaymentRequest({request});

  markup.text(invoiceMessageDescriptionButtonLabel, setInvoiceDescription);
  markup.text(invoiceMessageSetTokensButtonLabel, setInvoiceTokens);

  if (!!from) {
    markup.text(invoiceMessageNodeButtonLabel, setInvoiceNode);
  }

  markup.text(invoiceMessageCancelButtonLabel, cancelInvoice);

  const memo = !description ? '' : `“${description}”`;

  const text = join([
    `Invoice: ${tokensAsBigTokens(tokens)} ${memo}`,
    `\`${request}\``,
    `${from || ''}`,
  ]);

  return {markup, mode, text};
};