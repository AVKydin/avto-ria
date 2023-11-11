import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { CurrencyEnum } from '../../common/enum/сurrency.enum';

@Injectable()
export class CurrencyConversionService {
  constructor(private readonly httpService: HttpService) {}

  async getExchangeRate(currency: string, price: number): Promise<any> {
    const url =
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

    try {
      const response = await this.httpService
        .get(url)
        .toPromise()
        .then((value) => value.data);

      switch (currency) {
        case CurrencyEnum.EUR:
          return {
            currencyUah: response[0].buy * price,
            currencyUsd: (response[0].buy * price) / response[1].sale,
          };
          break;
        case CurrencyEnum.UAH:
          return {
            currencyEur: response[0].buy * price,
            currencyUsd: response[0].buy / price,
          };
          break;
        case CurrencyEnum.USD:
          return {
            currencyEur: (response[1].buy * price) / response[0].sale,
            currencyUah: response[0].buy * price,
          };
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
