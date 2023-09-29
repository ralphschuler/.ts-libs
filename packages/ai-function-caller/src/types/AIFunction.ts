export type AIFunctionName = string;
export type AIFunctionDescription = string;
export type AIFunctionParameterName = string;
export type AIPropertyType = "string" | "integer" | "boolean" | "object";
export type AIFunctionPropertyName = string;
export type AIPropertyDescription = string;
export type AIFunctionProperty = {
  type: AIPropertyType;
  description: AIPropertyDescription;
};
export type AIFunctionParameters = {
  type: "object";
  properties: {
    [key: AIFunctionParameterName]: AIFunctionProperty;
  };
  required: AIFunctionParameterName[];
};
export type AIFunctionParameter = string | number | boolean;
export type AIFunctionCall = {
  name: AIFunctionName;
  arguments: AIFunctionCallArguments;
};
export type AIFunctionCallArguments = string
export type AIFunctionExample = string;
export type AIFunction<AiFunctionCallResponse> = {
  name: AIFunctionName;
  description: AIFunctionDescription;
  parameters: AIFunctionParameters;
  method: (args: AIFunctionCallArguments) => Promise<AiFunctionCallResponse>;
  example?: AIFunctionExample;
};
