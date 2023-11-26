/**
 * Represents the name of an AI function.
 */
export type AIFunctionName = string;

/**
 * Describes an AI function.
 */
export type AIFunctionDescription = string;

/**
 * Represents the name of a parameter in an AI function.
 */
export type AIFunctionParameterName = string;

/**
 * Enumerates the possible types for AI function properties.
 */
export type AIPropertyType = "string" | "integer" | "boolean" | "object";

/**
 * Represents the name of a property in an AI function.
 */
export type AIFunctionPropertyName = string;

/**
 * Describes a property in an AI function.
 */
export type AIPropertyDescription = string;

/**
 * Represents a property of an AI function, including its type and description.
 */
export type AIFunctionProperty = {
  /** The type of the property. */
  type: AIPropertyType;
  /** The description of the property. */
  description: AIPropertyDescription;
};

/**
 * Represents the parameters of an AI function, including their types and required status.
 */
export type AIFunctionParameters = {
  /** The type of the parameters, typically an object. */
  type: "object";
  /** The properties of the parameters, keyed by the parameter name. */
  properties: {
    [key: AIFunctionParameterName]: AIFunctionProperty;
  };
  /** An array of parameter names that are required. */
  required: AIFunctionParameterName[];
};

/**
 * Represents a parameter value in an AI function call, which can be a string, number, or boolean.
 */
export type AIFunctionParameter = string | number | boolean;

/**
 * Represents a call to an AI function, including the function name and arguments.
 */
export type AIFunctionCall = {
  /** The name of the AI function being called. */
  name: AIFunctionName;
  /** The arguments passed to the AI function. */
  arguments: AIFunctionCallArguments;
};

/**
 * Represents the arguments passed in an AI function call.
 */
export type AIFunctionCallArguments = string;

/**
 * Represents an example usage of an AI function.
 */
export type AIFunctionExample = string;

/**
 * Represents an AI function, including its name, description, parameters, and the method to execute it.
 * @template AiFunctionCallResponse The expected response type from the AI function call.
 */
export type AIFunction<AiFunctionCallResponse> = {
  /** The name of the AI function. */
  name: AIFunctionName;
  /** A description of the AI function. */
  description: AIFunctionDescription;
  /** The parameters required by the AI function. */
  parameters: AIFunctionParameters;
  /** The method to execute the AI function. */
  method: (args: AIFunctionCallArguments) => Promise<AiFunctionCallResponse>;
  /** An optional example of how the AI function can be used. */
  example?: AIFunctionExample;
};
