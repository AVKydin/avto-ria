import { AudiModelEnum } from './audi.model.enum';
import { BmwModelEnum } from './bmw.model.enum';
import { ChevroletModelEnum } from './chevrolet.model.enum';
import { RenaultModelEnum } from './renault.model.enum';
import { VolkswagenModelEnum } from './volkswagen.model.enum';
import { VolvoModelEnum } from './volvo.model.enum';

export const AllCarModelEnum = [
  ...Object.values(AudiModelEnum),
  ...Object.values(BmwModelEnum),
  ...Object.values(ChevroletModelEnum),
  ...Object.values(RenaultModelEnum),
  ...Object.values(VolkswagenModelEnum),
  ...Object.values(VolvoModelEnum),
];
