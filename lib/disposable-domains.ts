// Common disposable / temporary email domains. Signups from these are blocked.
// Not exhaustive (thousands exist) but covers the overwhelming majority of real abuse.
export const DISPOSABLE_DOMAINS = new Set<string>([
  '0-mail.com', '10minutemail.com', '10minutemail.net', '20minutemail.com', '33mail.com',
  'armyspy.com', 'binkmail.com', 'bobmail.info', 'burnermail.io', 'byom.de',
  'cuvox.de', 'dayrep.com', 'deadaddress.com', 'despam.it', 'dispostable.com',
  'einrot.com', 'emailondeck.com', 'emailtemporario.com.br', 'fakeinbox.com', 'fakemail.net',
  'fakemailgenerator.com', 'fleckens.hu', 'getairmail.com', 'getnada.com', 'grr.la',
  'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamailblock.com', 'harakirimail.com', 'inboxalias.com', 'inboxbear.com',
  'jetable.org', 'kissfans.com', 'maildrop.cc', 'maileater.com', 'mailexpire.com',
  'mailforspam.com', 'mailinator.com', 'mailinator.net', 'mailinator2.com', 'mailmetrash.com',
  'mailnesia.com', 'mailnull.com', 'mailtemp.net', 'mailtothis.com', 'mintemail.com',
  'moakt.com', 'mohmal.com', 'mt2015.com', 'mytemp.email', 'mytrashmail.com',
  'nada.email', 'nowmymail.com', 'nwytg.net', 'objectmail.com', 'onewaymail.com',
  'pokemail.net', 'poofy.org', 'pookmail.com', 'rhyta.com', 'rppkn.com',
  'sharklasers.com', 'shitmail.me', 'smellfear.com', 'spam4.me', 'spamavert.com',
  'spambog.com', 'spambox.us', 'spamfree24.org', 'spamgourmet.com', 'spamherelots.com',
  'superrito.com', 'teleworm.us', 'temp-mail.io', 'temp-mail.org', 'tempail.com',
  'tempinbox.com', 'tempmail.com', 'tempmail.net', 'tempmail.plus', 'tempmaildemo.com',
  'tempmailer.com', 'tempmailo.com', 'tempomail.fr', 'temporaryemail.net', 'temporaryinbox.com',
  'throwam.com', 'throwawaymail.com', 'tmail.ws', 'tmailinator.com', 'trashmail.com',
  'trashmail.de', 'trashmail.me', 'trashmail.net', 'trbvm.com', 'tyldd.com',
  'veryrealemail.com', 'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'yopmail.com',
  'yopmail.fr', 'yopmail.net', 'yomail.info', 'zippymail.info', 'zoemail.com',
  'mailcatch.com', 'spam.la', 'mvrht.com', 'disposable.com', 'anonmails.de',
  'mail-temp.com', 'minuteinbox.com', 'luxusmail.org', 'dropmail.me', 'tempr.email',
  'fakemailbox.com', 'mail7.io', 'inboxkitten.com', 'mailpoof.com', 'tmpmail.org',
  'tmpmail.net', 'tmpeml.com', 'csgospins.site', 'disbox.net', 'mailto.plus',
  'fexbox.org', 'fexbox.ru', 'rover.info', 'chitthi.in', 'vmani.com',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1]
  if (!domain) return false
  if (DISPOSABLE_DOMAINS.has(domain)) return true
  // Catch common disposable sub-patterns
  const flagged = ['tempmail', 'temp-mail', 'throwaway', 'guerrilla', 'mailinator', 'yopmail', 'trashmail', 'fakemail', '10minute', 'getnada', 'dispostable']
  return flagged.some((f) => domain.includes(f))
}
