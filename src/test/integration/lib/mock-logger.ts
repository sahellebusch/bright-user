function noop(): void {
  return;
}

const mockLogger = {
  info: noop,
  debug: noop,
  warn: noop,
  error: noop,
  fatal: noop
};

export default mockLogger;
