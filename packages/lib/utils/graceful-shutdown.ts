import Handler from '@flerokoo/graceful-shutdown-handler'

const gracefulShutdownHandler = new Handler();
gracefulShutdownHandler.enable();

export default gracefulShutdownHandler;