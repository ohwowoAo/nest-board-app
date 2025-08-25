import { PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];
  transform(value: any): BoardStatus {
    if (typeof value === 'string') {
      value = value.toUpperCase();
    }

    if (!this.isStatusValid(value as BoardStatus)) {
      throw new Error(`${value} isn't in the status options`);
    }

    return value as BoardStatus;
  }

  private isStatusValid(status: BoardStatus): boolean {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
