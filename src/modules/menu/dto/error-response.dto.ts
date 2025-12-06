import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard error response format for Vietnamese locale
 */
export class ErrorResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      code: { type: 'string', example: 'TENANT_NOT_FOUND' },
      message: { type: 'string', example: 'Không tìm thấy cửa hàng' },
      details: {
        type: 'object',
        additionalProperties: true,
        example: { tenantId: '550e8400-e29b-41d4-a716-446655440000' },
      },
    },
  })
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  @ApiProperty({
    type: 'object',
    properties: {
      timestamp: { type: 'string', example: '2025-12-06T12:00:00.000Z' },
      requestId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
    },
  })
  meta: {
    timestamp: string;
    requestId?: string;
  };
}
