
import { GraphQLFormattedError } from 'graphql';

interface ValidationError {
  property: string;
  constraints: { [key: string]: string };
}

interface ExceptionExtensions {
  validationErrors?: ValidationError[];
  statusCode?: number;
  message?: string;
  error?: string;
}

export interface CustomGraphQLError extends GraphQLFormattedError {
  extensions: {
    code: string;
    exception?: ExceptionExtensions;
    originalError?: {
      message: string;
      statusCode: number;
      error: string;
    };
  };
}

export const customErrorFormatter = (
  error: CustomGraphQLError,
) => {

  const originalError = error.extensions?.originalError;
  const exception = error.extensions?.exception;

  // Handle validation errors
  if (
    error.extensions?.code === 'BAD_USER_INPUT' &&
    exception?.validationErrors
  ) {
    return {
      message: 'Validation failed',
      statusCode: 400,
      error: 'Bad Request',
      details: exception.validationErrors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      })),
    };
  }

  // Handle other errors
  if (originalError) {
    return {
      message: originalError.message,
      statusCode: originalError.statusCode,
      error: originalError.error,
    };
  }

  // Default error response
  return {
    message: error.message,
    statusCode: error.extensions?.code || 500,
    error: 'Internal Server Error',
  };
};
