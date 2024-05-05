interface PollingCallback {
  response: any;
  continuePoll: Function;
  stopPoll: Function;
  isFalled: boolean;
}

class Polling {
  private interval: number;
  private timeout: number = 0;
  private fetch: any;
  private isPolling: boolean = false;


  constructor(fetch: any, interval = 2500) {
    this.fetch = fetch;
    this.interval = interval;
  }

  start() {
    if (!this.isPolling) {
      this.isPolling = true;
      return new Promise<PollingCallback>((resolve, reject) => {
        const executePoll = async () => {
          const resolveData: PollingCallback = {
            response: null,
            continuePoll: () => {
              if(this.isPolling) {
                this.timeout = setTimeout(executePoll, this.interval);
              }
            },
            stopPoll: this.stop.bind(this),
            isFalled: false
          }

          try {
            const { data } = await this.fetch();
            resolveData.response = data;

            resolve(resolveData);
          } catch (error) {
            console.error(error);
            resolveData.isFalled = true;

            reject(resolveData);
          }
        }
        executePoll();
      });
    }
  }

  stop() {
    if(this.isPolling) {
      this.isPolling = false;
      clearTimeout(this.timeout);
    }
  }
}
