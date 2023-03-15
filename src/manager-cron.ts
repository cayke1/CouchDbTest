import { syncRemote } from "./cron/SyncDBLocal";
import { syncLocal } from "./cron/SyncDBRemote";


class ManagerCron {
    jobs: any[];

    constructor(){
        this.jobs = [syncRemote, syncLocal];
    }

    run(){
        this.jobs.map(job => job.start());
    }
}

export {ManagerCron}          