export const TranslateDataPoints = rawData => {
  let translatedData = {};
  for (var prop in rawData) {
    translatedData[prop] = {
      open: rawData[prop]['1. open'],
      close: rawData[prop]['4. close'],
      volume: rawData[prop]['5. volume']
    };
  }
  return translatedData;
};

export const TranslateMetaData = rawData => {
  return rawData['2. Symbol'];
};
