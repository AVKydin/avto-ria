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
            currencyUah: parseFloat((response[0].buy * price).toFixed(2)),
            currencyUsd: parseFloat(
              ((response[0].buy * price) / response[1].sale).toFixed(2),
            ),
            response,
          };
          break;
        case CurrencyEnum.UAH:
          return {
            currencyEur: parseFloat((response[0].buy * price).toFixed(2)),
            currencyUsd: parseFloat((response[0].buy / price).toFixed(2)),
            response,
          };
          break;
        case CurrencyEnum.USD:
          return {
            currencyEur: parseFloat(
              ((response[1].buy * price) / response[0].sale).toFixed(2),
            ),
            currencyUah: parseFloat((response[0].buy * price).toFixed(2)),
            response,
          };
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
