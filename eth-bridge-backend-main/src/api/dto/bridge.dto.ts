import { ApiProperty } from '@nestjs/swagger';

export class BridgeDto {
  @ApiProperty()
  public readonly fromChain: Chain;

  @ApiProperty()
  public readonly toChain: Chain;

  @ApiProperty()
  public readonly amountIn: string;

  @ApiProperty()
  public readonly toAddress: string;
}
