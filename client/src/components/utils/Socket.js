// import socketIOClient from 'socket.io-client';
import { TranslateDataPoints, TranslateMetaData } from './TranslateData';

export const AddCard = sym => {
  return {
    symbol: TranslateMetaData(sym['Meta Data']),
    dataPoints: TranslateDataPoints(sym['Time Series (Daily)'])
  };
};

export const RemoveCard = (sym, state) => {
  let newData = [];
  sym.forEach(s => {
    newData.push(state.filter(x => x.symbol === s)[0]);
  });
  return newData;
};

