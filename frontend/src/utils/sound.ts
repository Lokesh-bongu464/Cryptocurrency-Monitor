const NOTIFICATION_SOUND = new Audio(
  "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Uk+B0CBAQC5RixYcFgYDAgAGDAsBgQBRG10BW4CBAgFaAeOAQgCg8EMgbIMIBALhAQDgQQBQIgYEAUYBQEACRAJGB4YIZIsYyBgCHgEdKQQCUASABLhDEFnyCBMdGEMubEgAEGBQKBgQA7"
);

export const playNotificationSound = () => {
  NOTIFICATION_SOUND.play().catch((error) => {
    console.warn("Failed to play notification sound:", error);
  });
};
