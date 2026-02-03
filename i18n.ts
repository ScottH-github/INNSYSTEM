import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  // Ensure that incoming locale is valid
  if (!locale || !['en', 'zh-TW'].includes(locale)) {
    locale = 'zh-TW';
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
